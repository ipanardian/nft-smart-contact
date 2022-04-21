/* eslint-disable no-process-exit */
const { utils } = require("ethers");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt(
    process.env.CONTRACT_NAME,
    process.env.CONTRACT_ADDRESS
  );
  console.log("Contract address:", contract.address);

  try {
    const mintConfig = {
      amount: 1,
      price: "0.01",
    };

    const txn = await contract.mint(mintConfig.amount, {
      value: utils.parseEther(mintConfig.price),
    });
    await txn.wait();
    console.log("Successfully minted NFT", mintConfig);
  } catch (e) {
    console.log(e.message);
  }

  const amount = await contract.balanceOf(owner.address);
  console.log("Owner has tokens: ", amount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
