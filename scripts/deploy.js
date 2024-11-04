const { ethers } = require('hardhat');

async function main() {
    const accounts = await ethers.getSigners();
  
    // Assuming you want to check the balance of the first account
    const deployer = accounts[0];
  
    // Get the balance using the provider
    const balance = await ethers.provider.getBalance(deployer.address);
    
    // Log the balance in Ether
    console.log("Balance:", balance, "Sepolia ETH");
  const Token = await ethers.getContractFactory('NFTMarketplace');
  const token = await Token.deploy();
  console.log('NFTMarketplace address:', token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });