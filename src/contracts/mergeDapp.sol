// SPDX-License-Identifier: MIT
pragma solidity  >=0.5.0;
pragma experimental ABIEncoderV2;

/********************************************************************************************/
/*  This contract is the interface for DappState.sol functions used in Dapp.sol             */
/*  to enable DappState functions to be called from Dapp. You can restrict the functions    */
/*  in DappState directly known to Dapp by limiting the definitions you include here.       */
/*  It's OK to not use IDappState and Dapp, but if you do use them, it's highly recommended */
/*  that you use the DappStarter "Contract Access" feature  block so you can limit which    */
/*  contracts can call in to the DappState contract.                                        */
/********************************************************************************************/

interface IDappState {
  function getContractOwner() external view returns(address);     // Example READ function
  function incrementCounter(uint256 increment) external;          // Example WRITE function
  function getCounter() external view returns(uint256);           // Another example READ function
}

// Shared library for all contracts
library DappLib {

  ///+library

  function getItemsByPage
  (
    uint256 page,
    uint256 resultsPerPage,
    bytes32[] memory itemList

  )
  internal
  pure
  returns(bytes32[] memory)
  {
    /*
        Source: https://medium.codylamson.com/how-to-paginate-smart-contract-array-returns-cd6227479aa3
        ex: _page 1, _resultsPerPage 20 | 1 * 20 - 20 = 0
        ex2: _page 2, _resultsPerPage 20 | 2 * 20 - 20 = 20
        starting point for listing items in array
    */

    uint256 index = sub(mul(resultsPerPage,page),resultsPerPage);

    // Return emptry array if already empty or index is out of bounds
    if ((itemList.length == 0) || (index > sub(itemList.length, 1))) {
      return new bytes32[](0);
    }

    // Create fixed length array because we cannot push to array in memory
    bytes32[] memory itemPage = new bytes32[](resultsPerPage);


    uint256 returnCounter = 0;

    for(index; index < (mul(resultsPerPage, page)); index++) {
      if (index < (itemList.length)) {
        itemPage[returnCounter] = itemList[index];
      } else {
        itemPage[returnCounter] = bytes32(0);
      }

      returnCounter++;
    }

    return itemPage;
  }



  // *** BEGIN SafeMath -- Copyright (c) 2016 Smart Contract Solutions, Inc. ***

  // It's important to avoid vulnerabilities due to numeric overflow bugs
  // OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

}

/********************************************************************************************/
/* This contract is auto-generated based on your choices in DappStarter. You can make       */
/* changes, but be aware that generating a new DappStarter project will require you to      */
/* merge changes. One approach you can take is to make changes in Dapp.sol and have it      */
/* call into this one. You can maintain all your data in this contract and your app logic   */
/* in Dapp.sol. This lets you update and deploy Dapp.sol with revised code and still        */
/* continue using this one.                                                                 */
/********************************************************************************************/

contract DappState is IDappState {
  // Allow DappLib(SafeMath) functions to be called for all uint256 types
  // (similar to "prototype" in Javascript)
  using DappLib for uint256;


  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

  // Account used to deploy contract
  address private contractOwner;

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  // Contract run state
  bool private contractRunState = true;

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  // Track authorized admins count to prevent lockout
  uint256 private authorizedAdminsCount = 1;

  // Admins authorized to manage contract
  mapping(address => uint256) private authorizedAdmins;

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT ACCESS  <<<<<<<<<<<<<<<<<<<<<<<<<<<*/
  // Contracts authorized to call this one
  mapping(address => uint256) private authorizedContracts;


  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

  constructor()
  {
    contractOwner = msg.sender;

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // Add account that deployed contract as an authorized admin
    authorizedAdmins[msg.sender] = 1;

  }

  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  // Event fired when status is changed
  event ChangeContractRunState
  (
    bool indexed mode,
    address indexed account,
    uint256 timestamp
  );


  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Modifier that requires the "contractRunState" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
  modifier requireContractRunStateActive()
  {
    require(contractRunState, "Contract is currently not active");
    // Modifiers require an "_" which indicates where the function body will be added
    _;
  }

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Modifier that requires the function caller to be a contract admin
    */
  modifier requireContractAdmin()
  {
    require(isContractAdmin(msg.sender), "Caller is not a contract administrator");
    // Modifiers require an "_" which indicates where the function body will be added
    _;
  }

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT ACCESS  <<<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Modifier that requires the calling contract to be authorized
    */
  modifier requireContractAuthorized()
  {
    require(isContractAuthorized(msg.sender), "Calling contract not authorized");
    // Modifiers require an "_" which indicates where the function body will be added
    _;
  }


  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Get active status of contract
    *
    * @return A bool that is the current active status
    */
  function isContractRunStateActive()
  external
  view
  returns(bool)
  {
    return contractRunState;
  }

  /**
  * @dev Sets contract active status on/off
    *
    * When active status is off, all write transactions except for this one will fail
    */
  function setContractRunState
  (
    bool mode
  )
  external
    // **** WARNING: Adding requireContractRunStateActive modifier will result in contract lockout ****
  requireContractAdmin  // Administrator Role block is required to ensure only authorized individuals can pause contract
  {
    require(mode != contractRunState, "Run state is already set to the same value");
    contractRunState = mode;

    emit ChangeContractRunState(mode, msg.sender, block.timestamp);
  }


  /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Checks if an account is an admin
    *
    * @param account Address of the account to check
    */
  function isContractAdmin
  (
    address account
  )
  public
  view
  returns(bool)
  {
    return authorizedAdmins[account] == 1;
  }


  /**
  * @dev Adds a contract admin
    *
    * @param account Address of the admin to add
    */
  function addContractAdmin
  (
    address account
  )
  external
  requireContractRunStateActive
  requireContractAdmin
  {
    require(account != address(0), "Invalid address");
    require(authorizedAdmins[account] < 1, "Account is already an administrator");

    authorizedAdmins[account] = 1;
    authorizedAdminsCount++;
  }

  /**
  * @dev Removes a previously added admin
    *
    * @param account Address of the admin to remove
    */
  function removeContractAdmin
  (
    address account
  )
  external
  requireContractRunStateActive
  requireContractAdmin
  {
    require(account != address(0), "Invalid address");
    require(authorizedAdminsCount >= 2, "Cannot remove last admin");

    delete authorizedAdmins[account];
    authorizedAdminsCount--;
  }

  /**
  * @dev Removes the last admin fully decentralizing the contract
    *
    * @param account Address of the admin to remove
    */
  function removeLastContractAdmin
  (
    address account
  )
  external
  requireContractRunStateActive
  requireContractAdmin
  {
    require(account != address(0), "Invalid address");
    require(authorizedAdminsCount == 1, "Not the last admin");

    delete authorizedAdmins[account];
    authorizedAdminsCount--;
  }


  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT ACCESS  <<<<<<<<<<<<<<<<<<<<<<<<<<<*/
  /**
  * @dev Authorizes a smart contract to call this contract
    *
    * @param account Address of the calling smart contract
    */
  function authorizeContract
  (
    address account
  )
  public
  requireContractRunStateActive
  requireContractAdmin
  {
    require(account != address(0), "Invalid address");

    authorizedContracts[account] = 1;
  }

  /**
  * @dev Deauthorizes a previously authorized smart contract from calling this contract
    *
    * @param account Address of the calling smart contract
    */
  function deauthorizeContract
  (
    address account
  )
  external
  requireContractRunStateActive
  requireContractAdmin
  {
    require(account != address(0), "Invalid address");

    delete authorizedContracts[account];
  }

  /**
  * @dev Checks if a contract is authorized to call this contract
    *
    * @param account Address of the calling smart contract
    */
  function isContractAuthorized
  (
    address account
  )
  public
  view
  returns(bool)
  {
    return authorizedContracts[account] == 1;
  }


  //  Example functions that demonstrate how to call into this contract that holds state from
  //  another contract. Look in ~/interfaces/IDappState.sol for the interface definitions and
  //  in Dapp.sol for the actual calls into this contract.

  /**
  * @dev This is an EXAMPLE function that illustrates how functions in this contract can be
    *      called securely from another contract to READ state data. Using the Contract Access
    *      block will enable you to make your contract more secure by restricting which external
    *      contracts can call functions in this contract.
    */
  function getContractOwner()
  external
  view
  returns(address)
  {
    return contractOwner;
  }

  uint256 counter;    // This is an example variable used only to demonstrate calling
  // a function that writes state from an external contract. It and
  // "incrementCounter" and "getCounter" functions can (should?) be deleted.
  /**
  * @dev This is an EXAMPLE function that illustrates how functions in this contract can be
    *      called securely from another contract to WRITE state data. Using the Contract Access
    *      block will enable you to make your contract more secure by restricting which external
    *       contracts can call functions in this contract.
    */
  function incrementCounter
  (
    uint256 increment
  )
  external
    // Enable the modifier below if using the Contract Access feature
    // requireContractAuthorized
  {
    // NOTE: If another contract is calling this function, then msg.sender will be the address
    //       of the calling contract and NOT the address of the user who initiated the
    //       transaction. It is possible to get the address of the user, but this is
    //       spoofable and therefore not recommended.

    require(increment > 0 && increment < 10, "Invalid increment value");
    counter = counter.add(increment);   // Demonstration of using SafeMath to add to a number
    // While verbose, using SafeMath everywhere that you
    // add/sub/div/mul will ensure your contract does not
    // have weird overflow bugs.
  }

  /**
  * @dev This is an another EXAMPLE function that illustrates how functions in this contract can be
    *      called securely from another contract to READ state data. Using the Contract Access
    *      block will enable you to make your contract more secure by restricting which external
    *      contracts can call functions in this contract.
    */
  function getCounter()
  external
  view
  returns(uint256)
  {
    return counter;
  }
}

/*

VERY IMPORTANT SECURITY NOTE:

You will want to restrict some of your state contract functions so only authorized
contracts can call them. This can be achieved in four steps:

1) Include the "Access Control: Contract Access" feature block when creating your project.
   This adds all the functionality to manage white-listing of external contracts in your
   state contract.

2) Add the "requireContractAuthorized" function modifiers to those state contract functions
   that should be restricted.

3) Deploy the contract that will be calling into the state contract (like this one, for example).

4) Call the "authorizeContract()" function in the state contract with the deployed address of the
   calling contract. This adds the calling contract to a white-list. Thereafter, any calls to any
   function in the state contract that use the "requireContractAuthorized" function modifier will
   succeed only if the calling contract (or any caller for that matter) is white-listed.

*/


contract Dapp {
  // Allow DappLib(SafeMath) functions to be called for all uint256 types
  // (similar to "prototype" in Javascript)
  using DappLib for uint256;

  IDappState state;

  // During deployment, the address of the contract that contains data (or "state")
  // is provided as a constructor argument. The "state" variable can then call any
  // function in the state contract that it is aware of (by way of IDappState).
  constructor
  (
    address dappStateContract
  )
  {
    state = IDappState(dappStateContract);
  }

  /**
  * @dev Example function to demonstrate cross-contract READ call
    *
    */
  function getStateContractOwner()
  external
  view
  returns(address)
  {
    return state.getContractOwner();
  }

  /**
  * @dev Example function to demonstrate cross-contract WRITE call
    *
    */
  function incrementStateCounter
  (
    uint256 increment
  )
  external
  {
    return state.incrementCounter(increment);
  }


  /**
  * @dev Another example function to demonstrate cross-contract WRITE call
    *
    */
  function getStateCounter()
  external
  view
  returns(uint256)
  {
    return state.getCounter();
  }

  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  struct Voter {
    string name;
    uint count;
  }

  uint public candidateCount;
  uint public roomQuota;

  mapping(string => bool) public voterLookup;
  mapping(uint => Candidate) public candidateLookup;

  function addCandidate(string memory name) public {
    candidateLookup[candidateCount] = Candidate(candidateCount, name, 0);
    candidateCount++;
  }

  // function getCandidate(uint id) external view returns (string memory name, uint voteCount) {
  //     name = candidateLookup[id].name;
  //     voteCount = candidateLookup[id].voteCount;
  // }

  function getCandidates() external view returns (string[] memory, uint[] memory) {
    string[] memory names = new string[](candidateCount);
    uint[] memory voteCounts = new uint[](candidateCount);
    for (uint i = 0; i < candidateCount; i++) {
      names[i] = candidateLookup[i].name;
      voteCounts[i] = candidateLookup[i].voteCount;
    }
    return (names, voteCounts);
  }

  function vote(uint id, string memory voterId) external {
    require (!voterLookup[voterId] && bytes(voterId).length != 0, "fill the blank!");
    require (id >= 0 && id <= candidateCount-1);
    require(roomQuota >= 0, "out of room quota");
    candidateLookup[id].voteCount++;
    voterLookup[voterId] = true;
    roomQuota--;
    emit votedEvent(id);
  }

  function setQuota(uint quota) external {
    roomQuota = quota;
  }

  event votedEvent(uint indexed id);
}
