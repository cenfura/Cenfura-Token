const chai = require('chai');
const expect = chai.expect;

const expectThrow = require('./helpers/expectThrow.js');
const CenfuraToken = artifacts.require('./CenfuraToken.sol');

contract('CenfuraToken is Pausable', accounts => {

  it('should allow owner to pause token use', async () => {
    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const isPausedBefore = await instance.paused.call();
    expect(isPausedBefore).is.false;

    await instance.pause({ from: owner });

    const isPausedAfter = await instance.paused.call();
    expect(isPausedAfter).is.true;
  });

  it('should not allow transfer when paused', async () => {
    const from = accounts[0];
    const to = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const isPaused = await instance.paused.call();

    expect(isPaused).is.true;

    await expectThrow(instance.transfer(to, 1, { from: from }));
  });

  it('should allow owner to unpause paused token use', async () => {
    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const isPausedBefore = await instance.paused.call();
    expect(isPausedBefore).is.true;

    await instance.unpause({ from: owner });

    const isPausedAfter = await instance.paused.call();
    expect(isPausedAfter).is.false;
  });

  it('should not allow non-owner to pause token use', async () => {
    const from = accounts[2];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    expect(from).not.to.eql(owner);

    await expectThrow(instance.pause({ from: from }));
  });

});
