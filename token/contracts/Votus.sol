pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";

contract Votus is Ownable, ERC721Full {

    // Mapping from pollId to Mapping from voteProposition to votesCount
    mapping(uint32 => mapping (uint8 => uint32)) private _votes;

    // Mapping from tokenId to pollId
    mapping(uint256 => uint32) private _pollIdPerTokenId;

    // Mapping from pollId to bool, to store if the poll already exists
    mapping(uint32 => bool) private _pollIdExists;

    // Mapping from pollId to bool, to store if the poll has ended
    mapping(uint32 => bool) public pollEnded;

    // Mapping from pollId to int, to store how many token remains per poll
    mapping(uint32 => uint32) public votersCountPerPoll;

    // Mapping from pollId to owner address, to store the creator of each poll
    mapping(uint32 => address) private _pollOwners;

    constructor () public
        ERC721Full("Votus Token", "VOTUS")
    {
    }

    function() external payable {
        // nothing, we just receiving an mount of ETH, maybe ?
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        uint32 pollId,
        address payable to,
        uint256 tokenId,
        string memory tokenURI
    ) public
    {
        require (pollIdExists(pollId), "poll does not exist");
        require (!pollIsEnded(pollId), "poll is now ended");
        require (calledByCreator(pollId), "this method can only be called by the poll creator");
        super._mint(to, tokenId);
        super._setTokenURI(tokenId, tokenURI);
        _pollIdPerTokenId[tokenId] = pollId;
        votersCountPerPoll[pollId]++;
        to.transfer(10000000000000000); // 0.01 ETH
    }

    function transfer(address payable to, uint256 amount) public onlyOwner {
        to.transfer(amount);
    }

    function pollIsEnded(uint32 pollId) public view returns(bool) {
        return pollEnded[pollId];
    }

    function pollIdExists(uint32 pollId) internal view returns(bool) {
        return _pollIdExists[pollId];
    }

    function calledByCreator(uint32 pollId) internal view returns(bool) {
        return msg.sender == _pollOwners[pollId];
    }

    function createPoll(uint32 pollId) external {
        require (!pollIdExists(pollId), "poll already exist");
        _pollOwners[pollId] = msg.sender;
        _pollIdExists[pollId] = true;
        votersCountPerPoll[pollId] = 0;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return super._exists(tokenId);
    }

    function burn(uint256 tokenId) public onlyOwner {
        super._burn(tokenId);
    }

    /**
        vote records the voteProposition for the sender and for the specified pollId,
        if and only if the sender owns at least one token for this poll.
        Then, this token is burnt
     */
    function vote(uint32 pollId, uint8 voteProposition) public {
        require (pollIdExists(pollId), "poll does not exist");
        require (!pollIsEnded(pollId), "poll is now ended");
        for (uint i = 0; i < super.balanceOf(msg.sender); i++) {
            uint256 tokenId = super.tokenOfOwnerByIndex(msg.sender, i);
            if (_pollIdPerTokenId[tokenId] == pollId) {
                _votes[pollId][voteProposition]++;
                votersCountPerPoll[pollId]--;
                super._burn(tokenId);
            }
        }
        if (votersCountPerPoll[pollId] == 0) {
            _endPoll(pollId);
        }
    }

    /**
        getNbTokensOwnedForPoll returns the number of token the specified owner owns for the specified pollId
     */
    function getNbTokensOwnedForPoll(address owner, uint32 pollId) public view returns(uint32) {
        uint32 count = 0;
        for (uint i = 0; i < super.balanceOf(owner); i++) {
            uint256 tokenId = super.tokenOfOwnerByIndex(owner, i);
            if (_pollIdPerTokenId[tokenId] == pollId) {
                count++;
            }
        }
        return count;
    }

    function endPoll(uint32 pollId) external {
        require (calledByCreator(pollId), "this method can only be called by the poll creator");
        _endPoll(pollId);
    }

    function _endPoll(uint32 pollId) internal {
        require (pollIdExists(pollId), "poll does not exist");
        require (!pollIsEnded(pollId), "poll is now ended");
        pollEnded[pollId] = true;
    }

    function getResult(uint32 pollId, uint8 voteProposition) public view returns(uint32) {
        require(pollIsEnded(pollId), "the vote shall be ended to get the results");
        return _votes[pollId][voteProposition];
    }
}

