import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';

const SelectCharacter = ({ setCharacterNFT, setTokenId, setPage }) => {
  
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [msg, setMsg] = useState("Mint Your Hero. Choose wisely.");

  const mintCharacterNFTAction = async(characterId) => {
    try {
      if(gameContract) {
        console.log('minting character in progress...');
        setMsg("Minting in progress... Do not exit this page.");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        setMsg("Hero minted! Check it out in your characters page.");
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };
  
  const renderCharacters = () => 
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  const fightBoss = () => setPage("arena");
  const viewCharacter = () => setPage("yourcharacters");

  
  useEffect(() => {
    const {ethereum} = window;
    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log('ethereum object not found');
    }
  }, []);

  // fires when contract object mounts
  useEffect(() => {
    // get default character metadata to display on page
    const getCharacters = async() => {
      try {
        console.log('getting contract characters to mint');
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);
        const characters = charactersTxn.map(
          (characterData) => transformCharacterData(characterData)
        ); 
        setCharacters(characters);
      } catch(error) {
        console.error("something went wrong fetching character:", error);
      }
    };

    // update NFT metadata on front end when new NFT minted
    const onCharacterMint = async(sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
      if(gameContract) {
        const txn = await gameContract.checkIfUserHasNFT();
        console.log('character nft:', txn.characterNFT);
        setCharacterNFT(txn.characterNFT.map((characterData) => transformCharacterData(characterData)));
        setTokenId(txn.tokenId.map((bigNumber) => bigNumber.toNumber()));
        console.log("token id:", tokenId);
      }
    };

    // pull default character metadata to front end when contract mounts
    // set up listener for new NFT mints
    if(gameContract) {
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      if(gameContract)  {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    }
    
  }, [gameContract]);

  // render default characters to mint and two buttons to navigate to other pages
  return (
    <div className="select-character-container">
      <h2>{msg}</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      <div className="button-container">
        <button className="cta-button" onClick={viewCharacter}>
          Back to Characters Page
        </button>
        <button className="cta-button" onClick={fightBoss}>
          Fight the Boss!
        </button>
      </div>
    </div>
  );
};

export default SelectCharacter;