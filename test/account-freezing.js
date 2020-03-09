const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
const expect = chai.use(bnChai(BN)).expect;

const expectThrow = require('./helpers/expectThrow.js');
const CenfuraToken = artifacts.require('./CenfuraToken.sol');

contract('CenfuraToken allows freezing accounts', accounts => {

  it('should allow owner to freeze accounts', async () => {
    const target = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const isFrozenBefore = await instance.frozenAccounts.call(target);

    expect(isFrozenBefore).is.false;

    await instance.freezeAccount(target, true, { from: owner });

    const isFrozenAfter = await instance.frozenAccounts.call(target);

    expect(isFrozenAfter).is.true;
  });

  it('should allow owner to unfreeze accounts', async () => {
    const target = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const isFrozenBefore = await instance.frozenAccounts.call(target);

    expect(isFrozenBefore).is.true;

    await instance.freezeAccount(target, false, { from: owner });

    const isFrozenAfter = await instance.frozenAccounts.call(target);

    expect(isFrozenAfter).is.false;
  });

  it('should not allow non-owners to freeze accounts', async () => {
    const target = accounts[4];
    const from = accounts[2];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    expect(owner).is.not.eql(from);

    await expectThrow(instance.freezeAccount(target, true, { from: from }));
  });

  it('should not allow non-owners to unfreeze accounts', async () => {
    const target = accounts[1];
    const from = accounts[2];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    expect(owner).is.not.eql(from);

    await expectThrow(instance.freezeAccount(target, false, { from: from }));
  });

  it('should not allow transfer tokens from a frozen account', async () => {
    const from = accounts[1];
    const to = accounts[4];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    await instance.freezeAccount(from, false, { from: owner });
    await instance.freezeAccount(to, false, { from: owner });
    await instance.transfer(from, 1, { from: accounts[0] });
    await instance.freezeAccount(from, true, { from: owner });

    const isFromFrozen = await instance.frozenAccounts.call(from);
    const isToFrozen = await instance.frozenAccounts.call(to);

    expect(isFromFrozen).is.true;
    expect(isToFrozen).is.false;

    const fromBalance = await instance.balanceOf(from);

    expect(fromBalance).to.be.gte.BN(1);

    await expectThrow(instance.transfer(to, 1, { from: from }));
  });

  it('should allow transfer tokens to a frozen account', async () => {
    const from = accounts[0];
    const to = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    await instance.freezeAccount(from, false, { from: owner });
    await instance.freezeAccount(to, true, { from: owner });

    const isFromFrozen = await instance.frozenAccounts.call(from);
    const isToFrozen = await instance.frozenAccounts.call(to);

    expect(isFromFrozen).is.false;
    expect(isToFrozen).is.true;

    const fromBalance = await instance.balanceOf(from);

    expect(fromBalance).to.be.gte.BN(1);

    await instance.transfer(to, 1, { from: from });
  });

  it('should not allow use of transferFrom to transfer tokens from a frozen account', async () => {
    const from = accounts[1];
    const to = accounts[4];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    // make sure "from" is not frozen so that we can move tokens to it
    await instance.freezeAccount(from, false, { from: owner });
    // make sure "from" has at least one token
    await instance.transfer(from, 1, { from: accounts[0] });
    // freeze "from" so that the following transfer should fail
    await instance.freezeAccount(from, true, { from: owner });
    await instance.freezeAccount(to, false, { from: owner });

    const isFromFrozen = await instance.frozenAccounts.call(from);
    const isToFrozen = await instance.frozenAccounts.call(to);

    expect(isFromFrozen).is.true;
    expect(isToFrozen).is.false;

    await instance.approve(owner, 1, { from: from });

    await expectThrow(instance.transferFrom(from, to, 1, { from: owner }));
  });

  it('should allow use of transferFrom to transfer tokens to a frozen account', async () =>  {
    const from = accounts[0];
    const to = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    // make sure "from" is not frozen
    await instance.freezeAccount(from, false, { from: owner });
    // make sure "from" has at least one token
    await instance.transfer(from, 1, { from: accounts[0] });
    // make sure "to" is frozen
    await instance.freezeAccount(to, true, { from: owner });

    const isFromFrozen = await instance.frozenAccounts.call(from);
    const isToFrozen = await instance.frozenAccounts.call(to);

    expect(isFromFrozen).is.false;
    expect(isToFrozen).is.true;

    await instance.approve(owner, 1, { from: from });

    await instance.transferFrom(from, to, 1, { from: from });
  });

});
