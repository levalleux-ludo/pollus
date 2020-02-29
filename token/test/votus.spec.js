const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Votus = artifacts.require("Votus");

contract('Testing Votus contract', function(accounts) {

    let token;
    const name = "Votus Token";
    const symbol = "VOTUS"

    const pollId99 = 99;
    const pollId1 = 1;
    const pollId2 = 2;
    const pollId3 = 3;
    const pollId4 = 4;

    const voteProposition1 = 1;
    const voteProposition2 = 2;
    const voteProposition3 = 3;

    const account1 = accounts[1]
    const tokenId1 = 1111;
    const tokenUri1 = "This is data for the token 1"; // Does not have to be unique

    const account2 = accounts[2]
    const tokenId2 = 2222;
    const tokenUri2 = "This is data for the token 2"; // Does not have to be unique

    const tokenId3 = 3333;
    const tokenId4 = 4444;
    const account3 = accounts[3]

    const account4 = accounts[4]


    it('should be able to create a poll', async () => {
        token = await Votus.new()
        await token.createPoll(pollId1, {from: accounts[0]});
        expect(await token.pollIsEnded(pollId1)).to.be.false
    })
    // it('should not be able to create a poll already existing', async () => {
    //     const ret = await token.createPoll(pollId1, {from: accounts[0]})
    //     // expect(await token.createPoll(pollId1)).to.be.rejectedWith(/VM Exception while processing transaction: revert poll already exist -- Reason given: poll already exist/)
    //     expect(ret).to.be.rejectedWith(Error)
    // })
    it('should be able to end a poll if creator', async () => {
        await token.createPoll(pollId99, {from: accounts[0]});
        expect(await token.pollIsEnded(pollId99)).to.be.false
        token.endPoll(pollId99, {from: accounts[0]})
        expect(await token.pollIsEnded(pollId99)).to.be.true
    })
    // it('should not be able to end a poll if not creator', async () => {
    //     await token.createPoll(pollId2, {from: accounts[0]});
    //     expect(await token.pollIsEnded(pollId2)).to.be.false
    //     expect(await token.endPoll(pollId2, {from: accounts[1]})).to.be.rejected
    // })
    it(' should be able to deploy and mint Votus token', async () => {
        await token.mintUniqueTokenTo(pollId1, account1, tokenId1, tokenUri1, {from: accounts[0]})

        expect(await token.symbol()).to.equal(symbol)
        expect(await token.name()).to.equal(name)
    })
    it(' should be unique', async () => {
        const duplicateTokenID = token.mintUniqueTokenTo(pollId1, account2, tokenId1, tokenUri2, {from: accounts[0]}) //tokenId
        expect(duplicateTokenID).to.be.rejectedWith(/VM Exception while processing transaction: revert/)
    })
    it(' should allow creation of multiple unique tokens and manage ownership', async () => {
        const additionalToken = await token.mintUniqueTokenTo(pollId1, account2, tokenId2, tokenUri2, {from: accounts[0]})
        expect(Number(await token.totalSupply())).to.equal(2)

        expect(await token.exists(tokenId1)).to.be.true
        expect(await token.exists(tokenId2)).to.be.true
        expect(await token.exists(9999)).to.be.false // Dummy tokenId

        expect(await token.ownerOf(tokenId1)).to.equal(account1)
        expect(await token.ownerOf(tokenId2)).to.equal(account2)
    })
    it(' should allow safe transfers', async () => {
        const unownedTokenId = token.safeTransferFrom(account2, account3, tokenId1, {from: accounts[2]}) // tokenId
        expect(unownedTokenId).to.be.rejectedWith(/VM Exception while processing transaction: revert/)

        const wrongOwner = token.safeTransferFrom(account1, account3, tokenId2, {from: accounts[1]}) // wrong owner
        expect(wrongOwner).to.be.rejectedWith(/VM Exception while processing transaction: revert/)

        // Noticed that the from gas param needs to be the token owners or it fails
        const wrongFromGas = token.safeTransferFrom(account2, account3, tokenId2, {from: accounts[1]}) // wrong owner
        expect(wrongFromGas).to.be.rejectedWith(/VM Exception while processing transaction: revert/)

        await token.safeTransferFrom(account2, account3, tokenId2, {from: accounts[2]})
        expect(await token.ownerOf(tokenId2)).to.equal(account3)
    })

    it(' destroy a token', async () => {
        await token.burn(tokenId1, {from: accounts[0]})
        expect(await token.exists(tokenId1)).to.be.false
        expect(await token.exists(tokenId2)).to.be.true

    })
    it('should be able to vote if poll exists and not ended and own a token for this poll', async () => {
        await token.vote(pollId1, voteProposition1, {from: account3});
        expect(await token.exists(tokenId2)).to.be.false
        expect(Number(await token.totalSupply())).to.equal(0)

    })
    it('should be able to assign different token to different accounts for the same poll', async () => {
        await token.createPoll(pollId3, {from: accounts[0]});
        await token.mintUniqueTokenTo(pollId3, account3, tokenId3, tokenUri2, {from: accounts[0]})
        await token.mintUniqueTokenTo(pollId3, account4, tokenId4, tokenUri2, {from: accounts[0]})
        expect((await token.getNbTokensOwnedForPoll(account3, pollId3)).toNumber()).to.equal(1)
        expect((await token.getNbTokensOwnedForPoll(account4, pollId3)).toNumber()).to.equal(1)
        await token.safeTransferFrom(account4, account3, tokenId4, {from: account4})
        expect((await token.getNbTokensOwnedForPoll(account3, pollId3)).toNumber()).to.equal(2)
        expect((await token.getNbTokensOwnedForPoll(account4, pollId3)).toNumber()).to.equal(0)

    })
    // it('should not be able to vote if poll does not exist', async () => {
    //     expect(await token.vote(pollId4, voteProposition1, {from: account3})).to.be.rejected
    // })
    // it('should not be able to get results if vote not ended', async () => {
        // expect(await token.getResult(pollId3, voteProposition1)).to.be.rejected
    // })
    it('should be able to vote as many times as owned tokens', async () => {
        await token.vote(pollId3, voteProposition1, {from: account3});
        expect((await token.getNbTokensOwnedForPoll(account3, pollId3)).toNumber()).to.equal(1)
        expect(await token.pollIsEnded(pollId3)).to.be.false
        await token.vote(pollId3, voteProposition2, {from: account3});
        expect((await token.getNbTokensOwnedForPoll(account3, pollId3)).toNumber()).to.equal(0)
        expect(await token.pollIsEnded(pollId3)).to.be.true
    })
    it('should be able to get results after everyone has voted', async () => {
        expect((await token.getResult(pollId3, voteProposition1)).toNumber()).to.equal(1);
        expect((await token.getResult(pollId3, voteProposition2)).toNumber()).to.equal(1);
        expect((await token.getResult(pollId3, voteProposition3)).toNumber()).to.equal(0);
    })

})