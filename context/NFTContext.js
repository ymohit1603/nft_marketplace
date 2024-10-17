import React, { useSatte, useEffect } from 'react';
import web3Modal from "web3Modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { MarketAddress, MarketAddressABI } from "./constants";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress,MarketAddressABI,signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
    const nftCurrency = "ETH";
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) {
          alert('Please install MetaMask extension...');
          return;
        }
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
        } else {
          console.log('No accounts found');
        }
      };
    
      useEffect(() => {
        checkIfWalletIsConnected();
      }, []);
    
      const connectWallet = async () => {
        if (!window.ethereum) {
          alert('Please install MetaMask extension...');
          return;
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        window.location.reload();
      };
    
    const uploadToIPFS = async (file, setFileUrl) => {
        try {
            const added = await client.add({ content: file });

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            return url;
        }
        catch (error) {
            console.log(error);
        }
    };

    const createNFT = async (formInput,fileUrl,router) => {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;

        const data = JSON.stringify({ name, description, image: fileUrl })
        
        try {
            const added = await client.add(data);

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            await createSale(url, price);
            
            router.push('/');

        } catch (error) {
            console.log(error);
        }
    }

    const createSale = async (url,formInputPrice,isReselling,id) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.web3Provider(connection);
        const signer = provider.getSigner();

        const price = ethers.utils.parseUnits(formInputPrice, 'ether');

        const contract = fetchContract(signer);
        const listingPrice = await contract.getListingPrice();

        const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });

        await transaction.wait();
    }


    const fetchNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const data = await contract.fetchMarketItems();

        const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformatedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const { data: { image, name, description } } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformatedPrice.toString(), 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
            };
        }));

        return items;
        
    }


    
    return (
        <NFTContext.Provider value={{ nftCurrency,connectWallet, currentAccount,uploadToIPFS }}>{children}</NFTContext.Provider>
    )
}