const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
const expect = chai.use(bnChai(BN)).expect;

const expectThrow = require('./helpers/expectThrow.js');
const CenfuraToken = artifacts.require('./CenfuraToken.sol');

const ONE_AND_A_HALF_BILLION = 1.5 * 10 ** 9;

contract('CenfuraToken', accounts => {
  it('should have a totalSupply of 1.5b tokens', async () => {
    const instance = await CenfuraToken.deployed();
    const totalSupply = await instance.totalSupply();
    const decimals = await instance.decimals();

    const expected = new BN(ONE_AND_A_HALF_BILLION).mul(new BN(10).pow(decimals));

    expect(totalSupply).to.eq.BN(expected);
  });

  it('should transfer tokens correctly', async () => {
    const AMOUNT_TO_TRANSFER = 42;
    const instance = await CenfuraToken.deployed();

    const decimals = await instance.decimals();
    const balanceBefore1 = await instance.balanceOf(accounts[0]);

    expect(balanceBefore1).to.eq.BN(new BN(ONE_AND_A_HALF_BILLION).mul(new BN(10).pow(decimals)));

    const balanceBefore2 = await instance.balanceOf(accounts[1]);

    expect(balanceBefore2).to.eq.BN(0)

    await instance.transfer(accounts[1], AMOUNT_TO_TRANSFER);

    const balanceAfter1 = await instance.balanceOf(accounts[0]);
    const balanceAfter2 = await instance.balanceOf(accounts[1]);

    expect(balanceBefore1.add(balanceBefore2)).to.eq.BN(balanceAfter1.add(balanceAfter2));
    expect(balanceAfter2).to.eq.BN(new BN(AMOUNT_TO_TRANSFER));
  });

  it('should transfer contract ownership correctly', async () => {
    const targetOwner = accounts[3];

    const instance = await CenfuraToken.deployed();
    const ownerBefore = await instance.owner.call();

    expect(ownerBefore).to.eql(accounts[0]);

    await instance.transferOwnership(targetOwner);

    const ownerAfter = await instance.owner.call();

    expect(ownerAfter).to.eql(targetOwner),

    // can not reclaim token ownership
    await expectThrow(instance.transferOwnership(ownerBefore));
  });

});
