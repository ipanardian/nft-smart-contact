/* eslint-disable no-process-exit */
const { utils } = require("ethers");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const maxTotalSupply = process.env.TOTAL_SUPPLY;
  const baseTokenURI = process.env.BASE_TOKEN_URI;

  // Get contract that we want to deploy
  const contractFactory = await hre.ethers.getContractFactory(
    process.env.CONTRACT_NAME
  );

  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy(maxTotalSupply, baseTokenURI);

  try {
    // Wait for this transaction to be mined
    await contract.deployed();
  } catch (e) {
    console.log(e.message);
  }

  // Get contract address
  console.log("Contract deployed to :", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
