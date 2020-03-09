const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
const expect = chai.use(bnChai(BN)).expect;

const expectThrow = require('./helpers/expectThrow.js');
const CenfuraToken = artifacts.require('./CenfuraToken.sol');

contract('CenfuraToken is Burnable', accounts => {

  it('should allow owner to burn tokens', async () => {
    const REDUCTION = 100;

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const totalSupplyBefore = await instance.totalSupply.call();
    const ownerBalance = await instance.balanceOf.call(owner);

    expect(ownerBalance).to.be.gte.BN(REDUCTION);

    await instance.burn(REDUCTION);
  });

  it('should reduce total supply after burn', async () => {
    const REDUCTION = 100;

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const totalSupplyBefore = await instance.totalSupply.call();
    const balanceBefore = await instance.balanceOf.call(owner);

    expect(balanceBefore).to.be.gte.BN(REDUCTION);

    await instance.burn(REDUCTION);

    const totalSupplyAfter = await instance.totalSupply.call();
    const balanceAfter = await instance.balanceOf.call(owner);

    expect(totalSupplyAfter).to.eq.BN(totalSupplyBefore.sub(new BN(REDUCTION)))
  });

  it('should reduce balance after burn', async () => {
    const REDUCTION = 100;

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const totalSupplyBefore = await instance.totalSupply.call();
    const balanceBefore = await instance.balanceOf.call(owner);

    expect(balanceBefore).to.be.gte.BN(REDUCTION);

    await instance.burn(REDUCTION);

    const totalSupplyAfter = await instance.totalSupply.call();
    const balanceAfter = await instance.balanceOf.call(owner);

    expect(balanceAfter).to.eq.BN(balanceBefore.sub(new BN(REDUCTION)));
  });

  it('should fail to burn when balance is too low', async () => {
    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    const balanceBefore = await instance.balanceOf.call(owner);

    await expectThrow(instance.burn(balanceBefore.add(new BN(1))));
  });

  it('should not allow non-owner to burn tokens', async () => {
    const REDUCTION = 100;
    const requester = accounts[1];

    const instance = await CenfuraToken.deployed();
    const owner = await instance.owner.call();

    expect(requester).not.to.eql(owner);

    const totalSupplyBefore = await instance.totalSupply.call();

    // make sure requester has enough tokens to burn
    await instance.transfer(requester, REDUCTION, { from: accounts[0] });

    await expectThrow(instance.burn(REDUCTION, { from: requester }));
  });

});
