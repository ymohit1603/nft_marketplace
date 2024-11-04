const fs = require("fs");
require("dotenv").config({ path: '.env.local' });
require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.PRIVATE_KEY

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337, 
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_IPFS_PROJECT_ID}`,
      accounts: [privateKey], 
    },
  },
  solidity: "0.8.27", 
};