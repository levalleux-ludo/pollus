const Votus = artifacts.require("Votus.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Votus)
  const votus = await Votus.deployed()
};
