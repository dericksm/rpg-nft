pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RPGCharacter is ERC721, VRFConsumerBase, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    mapping(bytes32 => address) public requestIdToSender;
    mapping(bytes32 => uint256) public requestIdToTokenId;
    mapping(bytes32 => string) public requestIdToCharacterName;

    bytes32 private keyHash;
    uint256 private fee;  
    uint256 public tokenCounter;
    
    address public VRFCoordinator;
    address public LinkToken;

    Character[] public characters;

    string[] private firstNames;
    string[] private middleNames;
    string[] private fullNames;

    uint256 private maxLevel;
    uint256 private statusPointsPerLevel;

    enum Class {
        ARCHER,
        WARRIOR,
        MAGE
    }

    struct Character {    
        uint256 level;
        uint256 strength;
        uint256 constitution;
        uint256 dexterity;
        uint256 intelligence;
        string name;
        Class class;
    }

    event newCharacter(
        uint256 level,
        uint256 strength,
        uint256 constitution,
        uint256 dexterity,
        uint256 intelligence,
        string name,
        Class class
    );

    constructor(
        address _VRFCoordinator,
        address _LinkToken,
        bytes32 _keyhash
        ) 
    public
    VRFConsumerBase(_VRFCoordinator, _LinkToken)
    ERC721("Dungeon Warriors", "DNW") {
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        tokenCounter = 0;
        maxLevel = 10;
        statusPointsPerLevel = 5;
        keyHash = _keyhash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    function createRandomWarrior(string memory name)
        public returns (bytes32) {
            bytes32 requestId = requestRandomness(keyHash, fee);
            requestIdToCharacterName[requestId] = name;
            requestIdToSender[requestId] = msg.sender;
            return requestId;
    }    

    function getCalculatedRandomStatus(uint256 randomNumber, uint256 characterAvailablePoints) private pure returns (uint256){
        uint256 statusPoints = (randomNumber % characterAvailablePoints) + 1;
        return statusPoints;
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
        {
        address owner = requestIdToSender[requestId];
        uint256 tokenId = characters.length;
        requestIdToTokenId[requestId] = tokenId;

        string memory name = requestIdToCharacterName[requestId];
        uint256 level = (randomNumber % maxLevel) + 1;
        uint256 characterAvailablePoints = level * statusPointsPerLevel;

        uint256 strength = getCalculatedRandomStatus(randomNumber, characterAvailablePoints);
        uint256 constitution = getCalculatedRandomStatus(randomNumber, characterAvailablePoints);
        uint256 dexterity = getCalculatedRandomStatus(randomNumber, characterAvailablePoints);
        uint256 intelligence = getCalculatedRandomStatus(randomNumber, characterAvailablePoints);    
        Class class = Class(randomNumber % 3);

        Character memory character = Character(level, strength, constitution, dexterity, intelligence, name, class);
        emit newCharacter(level, strength, constitution, dexterity, intelligence, name, class);
        characters.push(character);
        _safeMint(owner, tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function getNumberOfCharacters() public view returns (uint256) {
        return characters.length; 
    }
}