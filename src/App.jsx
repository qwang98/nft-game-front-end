import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import YourCharacters from './Components/YourCharacters';
import {CONTRACT_ADDRESS, transformCharacterData} from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import {ethers} from 'ethers';

// main function
const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [page, setPage] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' }); // Check if we're authorized to access the user's wallet
        if (accounts.length !== 0) { // User can have multiple authorized accounts, we grab the first one if its there!
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    /*
     * Scenario #1: land in connect wallet page
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2: if account has NFT, go to "your characters" page by default
       * user can then choose to go to "arena" or "select character" page using buttons on the pages
       */
    } else if (currentAccount && characterNFT.length > 0) {
      if(page==="arena") {
        return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} tokenId={tokenId} currentAccount={currentAccount} page={page} setPage={setPage}/>;
      } else if(page==="selectcharacter") {
        return <SelectCharacter setCharacterNFT={setCharacterNFT} setTokenId={setTokenId} setPage={setPage} />;
      } else { 
        return <YourCharacters characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} tokenId={tokenId} currentAccount={currentAccount} page={page} setPage={setPage}/>;
      }
      /*
       * Scenario #3: if account has no NFT, go to "select character" page to mint new NFT
       */
    } else if (currentAccount && characterNFT.length === 0) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} setTokenId={setTokenId} setPage={setPage}/>;
    }
  };

  const connectWalletAction = async() => {
    try {
      const{ethereum} = window;
      if(!ethereum) {
        console.log("Get MetaMask!");
        return;
      } else {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch(error) {
      console.log(error);
    }
  };

  const checkNetwork = async() => {
    try {
      if(window.ethereum.networkVersion !== '5') {
        alert("Please select Goerli test network in your wallet!");
      }
    } catch(error) {
        console.log(error);
    }
  };

  // check wallet connection and network on first render
  useEffect(() => {
    checkIfWalletIsConnected();
    checkNetwork();
  }, []);

  // pull NFT metadata when new account is connected
  useEffect(() => {
    const fetchNFTMetadata = async() => {
      console.log('checking for character nft on address:', currentAccount);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      console.log(txn);
      console.log(
        txn.characterNFT.map((characterData) => transformCharacterData(characterData))
      );
      if(txn.characterNFT.length > 0) {
        console.log('User has character nft'); 
        setCharacterNFT(txn.characterNFT.map((characterData) => transformCharacterData(characterData)));
        setTokenId(txn.tokenId.map((bigNumber) => bigNumber.toNumber()));
        console.log("txn.tokenid: ", txn.tokenId);
        console.log("converted txn.tokenid: ", txn.tokenId.map((bigNumber) => bigNumber.toNumber()));
        console.log("tokenid: ", tokenId);
      } else {
        console.log('no character nft found');
      }
    }

    if(currentAccount) {
      console.log('currentaccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  // Check if state hooks are properly set when new account is connected
  // useEffect(() => {console.log(characterNFT)}, [characterNFT]);
  // useEffect(() => {console.log("tokenId: ", tokenId)}, [tokenId]);

  // render main page
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;