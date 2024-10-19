const fs = require("fs");
require("dotenv").config({ path: '.env.local' });
require("@nomicfoundation/hardhat-toolbox");

const privateKey = fs.readFileSync('.secret').toString().trim();
const { NEXT_PUBLIC_IPFS_PROJECT_ID } = process.env;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337, 
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_IPFS_PROJECT_ID}`,
      accounts: [privateKey], 
      gas: 2100000, 
      gasPrice: 5000000000
    },
  },
  solidity: "0.8.27", 
};