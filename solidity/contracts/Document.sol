// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// import profile contract
import "./Profile.sol";

/**
 * @title Document Management
 * @dev Implements document mMnagement.
 * To strore additional documents for account registration in Profile contract
 * Program Flows
 *
 */
contract Document {
    //DocumentStatus: 0=Pending, 1=Approved, 2=Rejected
    enum DocumentStatus {
        Pending,
        Approved,
        Rejected
    }

    // state management
    //1. Machine State for the document contract
    // 1 Activated = The participants can add documents. The regualtor can verify the documents.
    // 0 Deactivated = The participants **cannot** add documents. The regualtor **cannot** verify the documents.
    enum MachineState {
        Deactivated,
        Activated
    }
    //2. Add document state
    // 1 Enable = the participants can add their accounts' documents.
    // 0  Disable = the participants cannot their accounts' documents.
    // Both stages the regulator can still verify the participants' documents.
    enum AddDocState {
        Disable,
        Enable
    }

    AddDocState private addDocState;
    MachineState private machineState;

    Profile profile;

    address public regulatorAddress;

    struct DocumentItem {
        uint256 subDocumentId;
        string documentName;
        uint256 accountId;
        address accountAddress;
        DocumentStatus documentStatus;
        string hashContent; // TODO: recheck that it can store hash data
        uint256 timestamp;
    }
    // Get account Info. by referenceId
    mapping(uint256 => DocumentItem[]) public documentsByAccId;

    // @notice To create document contract and have an association relationship with Profile contract
    constructor(address _profileAddress) {
        profile = Profile(_profileAddress);
        regulatorAddress = profile.getRegulatorAddress();

        //Initial state Add document state
        addDocState = AddDocState.Disable;
        //Initial state StateMachine
        machineState = MachineState.Deactivated;
    }

    // Create events
    // Event 1: AddDocument by Farmer,Manufacturer,Reatiler,Logistic
    event AddDocument(
        uint256 indexed subDocumentId,
        string documentName,
        uint256 indexed accountId,
        address accountAddress,
        uint256 documentStatus,
        string hashContent // To DO: check with Promie that could he send bytes32 ?
    );
    // Event 2: VerifyDocument by Regulator
    event VerifyDocument(
        uint256 indexed accountId,
        address accountAddress,
        uint256 indexed subDocumentId,
        uint256 documentStatus
    );

    /// @notice Function 1: Add document for registration
    function addDocument(
        uint256 _accountId,
        string memory _documentName,
        string memory _hashContent
    )
        public
        onlyDocumentOwner(_accountId)
        onlyActiveAddDocState
        onlyActivatedMachineState
    {
        require(
            bytes(_documentName).length != 0,
            "Document name cannot be empty"
        );
        uint256 newId = documentsByAccId[_accountId].length + 1;
        // create a new doc item
        DocumentItem memory documentItem = DocumentItem(
            newId,
            _documentName,
            _accountId,
            msg.sender,
            DocumentStatus.Pending,
            _hashContent,
            block.number
        );

        // Add doc item to mapping documentsByRefId
        documentsByAccId[_accountId].push(documentItem);

        emit AddDocument(
            documentItem.subDocumentId,
            documentItem.documentName,
            documentItem.accountId,
            documentItem.accountAddress,
            uint256(documentItem.documentStatus),
            documentItem.hashContent
        );
    }

    /// @notice Function 2: approveAccount. Only regulator account can use this function.
    function verifydocument(
        uint256 _accountId,
        uint256 _subDocumentId,
        uint256 _documentStatusValue
    ) public onlyRegulator onlyActivatedMachineState {
        require(
            _subDocumentId > 0 &&
                _subDocumentId <= documentsByAccId[_accountId].length,
            "Cannot find the document."
        );
        // Get document item by referenceId and doc. item index

        documentsByAccId[_accountId][_subDocumentId - 1]
        .documentStatus = DocumentStatus(_documentStatusValue);

        emit VerifyDocument(
            documentsByAccId[_accountId][_subDocumentId - 1].accountId,
            msg.sender,
            documentsByAccId[_accountId][_subDocumentId - 1].subDocumentId,
            uint256(
                documentsByAccId[_accountId][_subDocumentId - 1].documentStatus
            )
        );
    }

    function getAddDocState()
        public
        view
        onlyActivatedMachineState
        returns (uint256)
    {
        uint256 _addDocState = uint256(addDocState);
        return _addDocState;
    }

    /// @notice Enable add doc. fn
    function setEnableAddDocState()
        public
        onlyRegulator
        onlyActivatedMachineState
        returns (uint256)
    {
        // Disable add doc. fn
        addDocState = AddDocState.Enable;
        return uint256(addDocState);
    }

    /// @notice Disable  add doc. fn
    function setDisableAddDocState()
        public
        onlyRegulator
        onlyActivatedMachineState
        returns (uint256)
    {
        // Disable  add doc. fn
        addDocState = AddDocState.Disable;
        return uint256(addDocState);
    }

    function getMachineState() public view returns (uint256) {
        uint256 _machineState = uint256(machineState);
        return _machineState;
    }

    /// @notice Enable add document fn
    function setActivatedMachineState() public onlyRegulator returns (uint256) {
        // Validation
        // The profile contract must be active.
        require(
            profile.getMachineState() == 1,
            "The profile contract must be active before activate the document contract."
        );

        // Activate document contract
        machineState = MachineState.Activated;
        addDocState = AddDocState.Enable;
        return uint256(machineState);
    }

    /// @notice Disable add document fn
    function setDeactivatedMachineState()
        public
        onlyRegulator
        returns (uint256)
    {
        // Deactivate document contract
        machineState = MachineState.Deactivated;
        // Disable add doc. State
        addDocState = AddDocState.Disable;
        return uint256(machineState);
    }

    /// @notice Destroy Document Contract
    function destroyContract() public payable onlyRegulator {
        // Disable add doc. fn
        addDocState = AddDocState.Disable;
        machineState = MachineState.Deactivated;
        address payable regulator_address = payable(address(regulatorAddress));
        selfdestruct(regulator_address);
    }

    // modifier
    modifier onlyDocumentOwner(uint256 _accountId) {
        require(
            profile.isAccountOwner(msg.sender, _accountId) == true,
            "This function can only be executed by the owner."
        );
        _;
    }

    // modifier
    modifier onlyRegulator {
        require(
            msg.sender == regulatorAddress,
            "This function can only be executed by the regulator."
        );
        _;
    }
    modifier onlyActiveAddDocState {
        require(
            addDocState == AddDocState.Enable,
            "The registration function is not enable."
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
