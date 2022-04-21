/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require("chai");
const { utils } = require("ethers");

describe("ExabytesNFT Smart Contract", function () {
  const maxTotalSupply = 100;
  const baseTokenURI = "ipfs://QmRxVaEfdNGFuvtfdfQtUsAURwoKGADY8MtNuRXhc2dRbK/";

  let Contract;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Contract = await ethers.getContractFactory("ExabytesNFT");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    contract = await Contract.deploy(maxTotalSupply, baseTokenURI);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the total supply", async function () {
      const _maxTotalSupply = await contract.maxTotalSupply();
      expect(_maxTotalSupply).to.equal(maxTotalSupply);
    });

    it("Should set the masking base token URI", async function () {
      const _baseTokenURI = await contract.baseTokenURI();
      expect(_baseTokenURI.toString()).to.equal(baseTokenURI);
    });
  });

  describe("Reserve", function () {
    it("Should success reserve NFTs for owner", async function () {
      const _amount = 10;
      const txn = await contract.reserve(_amount);
      await txn.wait();

      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
    });

    it("Should fail reserve NFTs if amount is higher than maxTotalSupply", async function () {
      const _amount = 101;

      expect(contract.reserve(_amount)).to.be.revertedWith(
        "ExabytesNFT: amount is higher than maxTotalSupply"
      );
    });
  });

  describe("Minting", function () {
    it("Should success minting", async function () {
      // Owner
      const _amountBefore = await contract.balanceOf(owner.address);
      txn = await contract.mint(1, { value: utils.parseEther("0.2") });
      await txn.wait();
      const _amountAfter = _amountBefore + 1;
      expect(await contract.balanceOf(owner.address)).to.equal(_amountAfter);

      // Other
      const _amountBefore2 = await contract.balanceOf(addr1.address);
      txn = await contract
        .connect(addr1)
        .mint(1, { value: utils.parseEther("0.2") });
      await txn.wait();
      const _amountAfter2 = _amountBefore2 + 1;
      expect(await contract.balanceOf(addr1.address)).to.equal(_amountAfter2);
    });

    it("Should fail minting if amount is zero", async function () {
      await expect(
        contract.mint(0, { value: utils.parseEther("0.1") })
      ).to.be.revertedWith(
        "ExabytesNFT: The amount of minted NFT must be more than 0."
      );
    });
  });

  describe("Withdraw Token", function () {
    it("Should success withdraw token", async function () {
      // Owner
      txn = await contract.mint(1, { value: utils.parseEther("0.1") });
      await txn.wait();

      expect(await contract.withdraw()).to.be.ok;
    });

    it("Should fail withdraw if not owner", async function () {
      await expect(contract.connect(addr1).withdraw()).to.be.reverted;
    });
  });
});
