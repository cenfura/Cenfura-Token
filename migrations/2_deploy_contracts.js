const CenfuraToken = artifacts.require('./CenfuraToken.sol');

module.exports = function(deployer) {
  deployer.deploy(CenfuraToken);
};
