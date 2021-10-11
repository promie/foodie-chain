// SPDX-License-Identifier: UNLICENSED

// test
pragma solidity ^0.8.0;

import "./Profile.sol";
import "./Trace.sol";

contract ProductSC {
    // state management
    //1. Machine State for the product contract
    // 1 Activated = The participants can use functions in the product contract.
    // 0 Deactivated = The participants **cannot** use functions in the product contract.
    enum MachineState {
        Deactivated,
        Activated
    }

    MachineState private machineState;

    enum status {
        FARMING,
        MANUFACTURING,
        SHIPPING,
        RETAILING,
        PURCHASING,
        RECALLING
    }

    struct Product {
        uint256 productId;
        string productName;
        status statusType;
        uint256 productPrice;
        address FarmerId;
        address manufacturerId;
        address distributorId;
        address retailerId;
        address ConsumerId;
    }

    struct Farming {
        uint256 productId;
        uint256 recordBlock;
        uint256 farmingTime;
        uint256 harvestTime;
        string productLocation;
    }

    struct Manufacturing {
        uint256 productId;
        string processType;
        uint256 recordBlock;
        uint256 timestamp;
    }

    // relevant to track.sol,
    // may add new attribute after interact with tracker
    struct Logistics {
        uint256 productId;
        uint256 recordBlock;
        uint256 timeStamp;
        //To store sender and receiver addresses
        address sender;
        address receiver;
    }

    struct Retailing {
        uint256 productId;
        uint256 recordBlock;
        uint256 timeStamp;
    }

    struct Purchasing {
        uint256 productId;
        uint256 recordBlock;
        uint256 timeStamp;
    }

    // Event for the current product status
    event CurrentProductStatus(uint256 productId, uint256 productStatus);
    // maaping parts
    mapping(uint256 => Product) public products;
    mapping(uint256 => Farming) public farming_process;
    mapping(uint256 => Manufacturing) public manu_process;
    mapping(uint256 => Logistics) public logi_process;
    mapping(uint256 => Retailing) public retail_process;
    mapping(uint256 => Purchasing) public purchase_process;

    uint256 public numProducts = 0;
    address public traceAddress;
    Profile profile;
    address public regulatorAddress;

    constructor(address _traceAddress, address _profileAddress) {
        traceAddress = _traceAddress;
        profile = Profile(_profileAddress);
        //add regulator address
        regulatorAddress = profile.getRegulatorAddress();
        //initial machine state
        machineState = MachineState.Deactivated;
    }

    //1. For Farming process (The first node of one-line supply chain)
    function createProduct(
        string memory name,
        uint256 _farmtime,
        uint256 _harvtime,
        string memory _productLocation
    ) public isFarmerOnly onlyActivatedMachineState returns (uint256) {
        require(
            _harvtime > _farmtime,
            "Harvest time should be later than farm time."
        );

        numProducts = numProducts + 1;
        Product memory p;
        p.productName = name;

        p.productId = numProducts;
        p.statusType = status.FARMING;
        p.FarmerId = msg.sender;
        products[p.productId] = p;

        Farming memory f;
        f.productId = p.productId;
        f.farmingTime = _farmtime;
        f.harvestTime = _harvtime;
        f.recordBlock = block.number;
        f.productLocation = _productLocation;
        farming_process[p.productId] = f;

        emit CurrentProductStatus(f.productId, uint256(p.statusType));

        return numProducts;
    }

    //2. For MANUFACTURING process (The second node of one-line supply chain)
    function manuProductInfo(uint256 _pid, string memory _processtype)
        public
        isManufacturerOnly
        isProductActive(_pid)
        isProductIdExist(_pid)
        onlyActivatedMachineState
    {
        require(
            products[_pid].statusType == status.FARMING,
            "The current status of product should be FARMING."
        );

        Product storage existProduct = products[_pid];
        existProduct.manufacturerId = msg.sender;
        existProduct.statusType = status.MANUFACTURING;

        Manufacturing memory m;
        m.productId = _pid;
        m.processType = _processtype;
        m.recordBlock = block.number;
        m.timestamp = block.timestamp;
        manu_process[_pid] = m;

        emit CurrentProductStatus(
            m.productId,
            uint256(existProduct.statusType)
        );
    }

    //3. For Logistic process (The third node of one-line supply chain)
    //**Scope** Manufacturer sends the product to the chosen Logistic or Oracle.
    // Valiadation
    // 1. msg.sender account type = manufacturer
    // 2. receiver = retailerId
    // 3. logistic = logistic or oracle
    function sendProduct(
        uint256 _pid,
        address receiver,
        address logistic,
        string memory trackingNumber
    )
        public
        isProductIdExist(_pid)
        OnlyProductReadyToSend(_pid)
        isManufacturerOnly
        onlyActivatedMachineState
    {
        require(
            profile.isLogisticOrOracle(logistic) == true,
            "It is not the logistic address."
        );
        require(
            profile.isRetailer(receiver) == true,
            "The receiver is not the retailer address."
        );
        require(
            products[_pid].statusType == status.MANUFACTURING,
            "The current status of product should be MANUFACTURING."
        );
        require(
            bytes(trackingNumber).length != 0,
            "The tracking number cannot be empty."
        );

        Product storage existProduct = products[_pid];
        existProduct.distributorId = msg.sender;
        existProduct.statusType = status.SHIPPING;

        Logistics memory l;
        l.productId = _pid;
        l.recordBlock = block.number;
        l.timeStamp = block.timestamp;
        l.sender = msg.sender;
        l.receiver = receiver;
        logi_process[_pid] = l;

        Trace trace = Trace(traceAddress);
        // set product contract address
        //trace.setProductContractAddress(address(this));
        trace.addProduct(_pid, logistic, trackingNumber);

        emit CurrentProductStatus(
            l.productId,
            uint256(existProduct.statusType)
        );
    }

    //4. For Retailing process (The fourth node of one-line supply chain)
    function retailProductInfo(uint256 _pid)
        public
        isRetailerOnly
        isProductActive(_pid)
        isProductIdExist(_pid)
        onlyActivatedMachineState
    {
        Product storage existProduct = products[_pid];
        existProduct.retailerId = msg.sender;
        existProduct.statusType = status.RETAILING;

        Retailing memory r;
        r.productId = _pid;
        r.recordBlock = block.number;
        r.timeStamp = block.timestamp;
        retail_process[_pid] = r;

        emit CurrentProductStatus(
            r.productId,
            uint256(existProduct.statusType)
        );
    }

    //5. For Purchasing process (The last node of one-line supply chain)
    function purchasingProductInfo(uint256 _pid, uint256 _price)
        public
        isConsumerOnly
        isProductActive(_pid)
        isProductIdExist(_pid)
        onlyActivatedMachineState
    {
        require(
            products[_pid].statusType == status.RETAILING,
            "The current status of product should be RETAILING."
        );

        Product storage existProduct = products[_pid];
        existProduct.ConsumerId = msg.sender;
        existProduct.statusType = status.PURCHASING;
        existProduct.productPrice = _price;

        Purchasing memory p;
        p.productId = _pid;
        p.recordBlock = block.number;
        p.timeStamp = block.timestamp;
        purchase_process[_pid] = p;

        emit CurrentProductStatus(
            p.productId,
            uint256(existProduct.statusType)
        );
    }

    //event
    event RecallProduct(uint256 productId);

    //Validation
    // 1. the sender must be Farmer; manufacturer; distributor; retailer; Consumer in this product
    // 2. The product status is not RECALLING
    function recallProduct(uint256 productId)
        public
        isProductActive(productId)
        isProductIdExist(productId)
        onlyActivatedMachineState
    {
        require(
            msg.sender == products[productId].FarmerId ||
                msg.sender == products[productId].manufacturerId ||
                msg.sender == products[productId].distributorId ||
                msg.sender == products[productId].retailerId ||
                msg.sender == products[productId].ConsumerId,
            "The address is not farmer,manufacturer, distributor, retailer or consumer in this product."
        );

        products[productId].statusType = status.RECALLING;
        emit RecallProduct(productId);
    }

    // private functions
    // Does account address exist?
    function isProductReadyToSend(uint256 productId)
        private
        view
        onlyActivatedMachineState
        returns (bool)
    {
        if (products[productId].statusType == status.MANUFACTURING) {
            return true;
        }
        return false;
    }

    function getMachineState() public view returns (uint256) {
        uint256 _machineState = uint256(machineState);
        return _machineState;
    }

    /// @notice Activate contract
    function setActivatedMachineState() public onlyRegulator returns (uint256) {
        //Validation
        // The profile contract must be active.
        require(
            profile.getMachineState() == 1,
            "The profile contract must be active before activate the product contract."
        );
        // Activate profile contract
        machineState = MachineState.Activated;
        return uint256(machineState);
    }

    /// @notice Deactivate contract
    function setDeactivatedMachineState()
        public
        onlyRegulator
        returns (uint256)
    {
        // Deactivate profile contract
        machineState = MachineState.Deactivated;
        return uint256(machineState);
    }

    /// @notice Destroy Profile Contract
    function destroyContract() public payable onlyRegulator {
        // Deactivate contract
        machineState = MachineState.Deactivated;
        address payable regulator_address = payable(address(regulatorAddress));
        selfdestruct(regulator_address);
    }

    event ShowOneLineTrack(
        address FarmerId,
        address manufacturerId,
        address distributorId,
        address retailerId,
        address ConsumerId,
        uint256 statusType
    );

    function showOneLineTrack(uint256 _productId)
        public
        isProductIdExist(_productId)
    {
        Product storage existProduct = products[_productId];
        //empty address : 0x0000000000000000000000000000000000000000
        emit ShowOneLineTrack(
            existProduct.FarmerId,
            existProduct.manufacturerId,
            existProduct.distributorId,
            existProduct.retailerId,
            existProduct.ConsumerId,
            uint256(existProduct.statusType)
        );
    }

    // Validation parts
    // modifiers
    modifier onlyRegulator {
        require(
            msg.sender == regulatorAddress,
            "This function can only be executed by the regulator."
        );
        _;
    }
    modifier OnlyProductReadyToSend(uint256 _productId) {
        require(
            isProductReadyToSend(_productId) == true,
            "Cannot send this product. Because the product is not ready to send or it has already been sent."
        );
        _;
    }
    modifier isFarmerOnly {
        require(
            profile.isFarmer(msg.sender) == true,
            "This function can only be executed by the farmer."
        );
        _;
    }

    modifier isManufacturerOnly {
        require(
            profile.isManufacturer(msg.sender) == true,
            "This function can only be executed by the manufacturer."
        );
        _;
    }

    modifier isLogisticOrOracleOnly {
        require(
            profile.isLogisticOrOracle(msg.sender) == true,
            "This function can only be executed by the logistic or oracle."
        );
        _;
    }

    modifier isRetailerOnly {
        require(
            profile.isRetailer(msg.sender) == true,
            "This function can only be executed by the retailer."
        );
        _;
    }

    modifier isConsumerOnly {
        require(
            profile.isConsumer(msg.sender) == true,
            "This function can only be executed by the consumer."
        );
        _;
    }
    modifier isProductActive(uint256 _productId) {
        require(
            products[_productId].statusType != status.RECALLING,
            "This product has already recalled."
        );
        _;
    }

    modifier isProductIdExist(uint256 __productId) {
        require(
            products[__productId].productId != 0,
            "This product id does not exist."
        );
        _;
    }
    modifier onlyActivatedMachineState {
        require(
            machineState == MachineState.Activated,
            "This contract is not activated by the regulator."
        );
        _;
    }
}
