// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./Profile.sol";

contract Trace {
    // Events
    event ProductTracking(address indexed logisticAccountAddress, uint productId, string trackingNumber );
    event ProductLocation(uint indexed productId, uint indexed timestamp, int latitude, int longitude);
    event ProductLocationRequest(uint indexed blockNumber, uint indexed productId);

    // Information for tracking the product
    struct ProductTrack {
        uint timestamp;
        int latitude;
        int longitude;
        uint nextRequestForLocationBlockNumber;
        bool isRequestingForLocation;

        address logisticAccountAddress;

        bytes trackingNumber;
    }

    // The owner of this contract
    address payable public owner;
    // The address of the profile contract
    address public profileAddress;
    // The address of the product contract
    address public productContractAddress;
    address public regulator;

    // All the track information. Indexed by the productId
    mapping (uint => ProductTrack) _tracks;

    bool public isInEmergencyMode;

    /// View of the track information
    /// @param productId The productId
    /// @return trackingNumber The trackingNumber of the transportation.
    /// @return latitude Last known product's latitude. (Store up to 5 decimals)
    /// @return longitude Last known product's longitude. (Store up to 5 decimals)
    /// @return isRequestingForLocation Is someone request for the product location.
    function tracks(uint productId)
    public
    view
    returns(string memory trackingNumber, int latitude, int longitude, bool isRequestingForLocation, uint nextRequestForLocationBlockNumber)  {

        // Retrieve the product from map.
        ProductTrack memory t = _tracks[ productId ];

        // Check if the product exists or not by check the tracking number.
        if( t.trackingNumber.length == 0 ) {
            // Return `null` data.
            return ("", 0, 0, false, 0);
        } else {
            // Return the product data.
            return ( string(t.trackingNumber), t.latitude, t.longitude, t.isRequestingForLocation, t.nextRequestForLocationBlockNumber );
        }
    }

    /// Constructor
    /// @param _profileAddress The address of the profile contract.
    constructor(address _profileAddress) {
        profileAddress = _profileAddress;
        owner = payable(msg.sender);
        regulator = Profile(_profileAddress).getRegulatorAddress();
    }

    /// Modifer to check for the owner
    modifier onlyOwner() {
        require( msg.sender == owner, "Must be owner" );
        _;
    }

    /// Allow some function only when not in emergency mode.
    modifier notInEmergencyMode() {
        require( !isInEmergencyMode, "This contract is currently in emergency mode." );
        _;
    }

    /// Modifer to check if the product contract address is setted or not. Error if not setted.
    modifier productContractSetted() {
        require( productContractAddress != address(0), "Product contract is not setted." );
        _;
    }

    /// Modifier to check if the sender is product contract or not.
    modifier allowedProductContract() {
        require( msg.sender == productContractAddress, "Incorrect product contract" );
        _;
    }

    /// Set the product contract address. This is accessible only for the owner and can only be setted once.
    function setProductContractAddress(address _productContractAddress) public onlyOwner {
        // Check weather the product contract address is setted or not.
        require( productContractAddress == address(0), "Product contract is setted." );

        // Set the address.
        productContractAddress = _productContractAddress;
    }

    /// Add the product for tracking.
    /// @param productId The product id.
    /// @param logisticAccountAddress The account addres of the tracker.
    /// @param trackingNumber The tracking number.
    function addProduct(uint productId, address logisticAccountAddress, string memory trackingNumber)
    public
    productContractSetted 
    allowedProductContract {

        require( bytes(trackingNumber).length != 0, "trackingNumber is required" );

        // Check with  the profile contract weather the logisticAccountAddress is a logistic account or an oracle account or not.
        Profile pf = Profile( profileAddress );
        bool isLogistic = pf.isLogisticOrOracle(logisticAccountAddress);

        // Revert the transaction if the logisticAccountAddress is not a logistic account nor an oracle account.
        require( isLogistic, "logisticAccountAddress must be a logistic or an oracle" );

        // Retrieve the product.
        ProductTrack memory t = _tracks[ productId ];
        
        // Revert the transaction if the product by productId is already added.
        require( t.trackingNumber.length == 0, "Product already added" );

        // Set the information
        t.logisticAccountAddress = logisticAccountAddress;
        t.trackingNumber = bytes(trackingNumber);
        t.latitude = 0;
        t.longitude = 0;

        // Add the information to the map
        _tracks[ productId  ] = t;

        // Emit the event for reverse oracle.
        emit ProductTracking(logisticAccountAddress, productId, trackingNumber);
    }


    /// Log the location of the product
    /// @param productId The product id.
    /// @param timestamp The time of the log. This information is provided by the tracker.
    /// @param latitude The product's latitude. (Store up to 5 decimals)
    /// @param longitude The product's latitude. (Store up to 5 decimals)
    /// @return success Weather the logging is success or not.
    function logLocation(uint productId, uint timestamp, int latitude, int longitude)
    public
    productContractSetted
    notInEmergencyMode
    returns(bool success) {
        require(  -9000000 <= latitude && latitude <= 9000000, "Latitude must be between -9,000,000 (-90.00000) and 9,000,000 (90.00000)" );
        require(  -18000000 <= longitude && longitude <= 18000000, "Longitude must be between -18,000,000 (-180.00000) and 18,000,000 (180.00000)" );


        // Retrieve the product.
        ProductTrack storage t = _tracks[ productId ];

        // If there is no tracking number then the product is not added.
        if( t.trackingNumber.length == 0 ) {
            return false;
        }

        // Only the selected account could add the track information
        require( msg.sender == t.logisticAccountAddress, "Incorrect logistic account" );

        // Check weather is the product is requested for the location.
        if( t.isRequestingForLocation ) {
            // If there is a request.

            // Only save the latest location in case the timestamp is newer
            if ( t.timestamp < timestamp ) {
                saveProductLocation(t, productId, timestamp, latitude, longitude);
            }

            // Set the requesting to false.
            t.isRequestingForLocation = false;

            // Returns true to indicate the successful.
            return true;
        } else {
            // Only update the location if the timestamp of the new log is newer.
            if ( t.timestamp >= timestamp ) {
                return false;
            }

            // Save the latest location
            saveProductLocation(t, productId, timestamp, latitude, longitude);

            // Returns true to indicate the successful.
            return true;
        }
    }

    /// Manually request for the location
    /// @param productId The product Id
    /// @return The request is success or not.
    function requestForLocation(uint productId) 
    public 
    productContractSetted 
    notInEmergencyMode
    returns (bool) {

        // Retrieve the tracking information
        ProductTrack storage t = _tracks[ productId ];

        // If there is no tracking number then the product is not added.
        if( t.trackingNumber.length == 0 ) {
            return false;
        }

        // If there is already a request then this request is ignored.
        if( t.isRequestingForLocation ) {
            return false;
        }

        // If the next allow value is more then current block number then the request is denied.
        if( t.nextRequestForLocationBlockNumber > block.number ) {
            return false;
        }

        // Update the request flag.
        t.isRequestingForLocation = true;

        // Update the next request block number to be roughly next 6 hours.
        // This simply work as a rate limit
        t.nextRequestForLocationBlockNumber = block.number + 1650;

        // Emit an event for reverse oracle.
        emit ProductLocationRequest(block.number, productId);

        // Returns true to indicate the success of request
        return true;
    }

    /// Update the product location.
    /// @param t The product tracking information
    /// @param productId The product id
    /// @param timestamp The timestamp of the log
    /// @param latitude The product latitude
    /// @param longitude The product longitude
    function saveProductLocation( ProductTrack storage t, uint productId, uint timestamp, int latitude, int longitude ) 
    private
    {
        // Update the information
        t.timestamp = timestamp;
        t.latitude = latitude;
        t.longitude = longitude;

        // Emit the event for the reverse oracle and to store it on the blockchain.
        emit ProductLocation( productId, timestamp, latitude, longitude);
    }

    /// Self destroy
    function destroyContract() public {
        require( msg.sender == regulator, "Must be regulator");
        selfdestruct( owner );
    }

    /// Set the emergerncy mode on.
    function enterEmergencyMode() public onlyOwner {
        require( !isInEmergencyMode, "The contract already in the emergency mode." );
        isInEmergencyMode = true;
    }

    /// Set the emergerncy mode off.
    function exitEmergencyMode() public onlyOwner {
        require( isInEmergencyMode, "The contract already in the emergency mode." );
        isInEmergencyMode = false;
    }
}