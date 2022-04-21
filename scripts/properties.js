/* eslint-disable no-process-exit */
const { utils } = require("ethers");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt(
    process.env.CONTRACT_NAME,
    process.env.CONTRACT_ADDRESS
  );
  console.log("Contract address:", contract.address);

  const baseTokenURI = await contract.baseTokenURI();
  console.log("baseTokenURI:", baseTokenURI.toString());

  const maxTotalSupply = await contract.maxTotalSupply();
  console.log("maxTotalSupply:", maxTotalSupply.toString());

  const totalSupply = await contract.totalSupply();
  console.log("totalSupply:", totalSupply.toString());

  const price = await contract.price();
  console.log("price:", price.toString());

  const amount = await contract.balanceOf(owner.address);
  console.log("Owner has tokens: ", amount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
