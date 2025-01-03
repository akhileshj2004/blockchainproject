const Registration = artifacts.require("Registration");

module.exports = async function(deployer) {
  try {
    await deployer.deploy(Registration);
    console.log("Contract deployed successfully");
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};