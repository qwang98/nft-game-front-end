import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import './YourCharacters.css';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import openseaLogo from '../../assets/opensea-logo.svg';

const YourCharacters = ({characterNFT, setCharacterNFT, tokenId, currentAccount, page, setPage}) => {
  
  const [gameContract, setGameContract] = useState(null);

  // set up ethereum contract on first render
  useEffect(() => {
    const{ethereum} = window;
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

  const generateOpenseaLink = (index) => {
    const out = "https://testnets.opensea.io/assets/goerli/" + CONTRACT_ADDRESS +  "/" + tokenId[index];
    console.log(out);
    return out;
  }

  // render character NFT stats in a loop and display opensea link
  const renderCharacterNFT = () => 
    characterNFT.map((character, index) => (
      <div className="player">
        <div className="image-content">
          <h2>{character.name}</h2>
          <img
            src={character.imageURI}
            alt={`Character ${character.name}`}
          />
          <div className="health-bar">
            <progress value={character.hp} max={character.maxHp} />
            <p>{`${character.hp} / ${character.maxHp} HP`}</p>
          </div>
        </div>
        <div className="stats">
          <h4>{`⚔️ Attack Damage: ${character.attackDamage}`}</h4>
          <div className="footer-container">
            <img alt="OpenSea Logo" className="opensea-logo" src={openseaLogo} />
            <a 
              href={generateOpenseaLink(index)} 
              target="_blank"
            >
              <h4>View on OpenSea</h4>
            </a>
          </div>
        </div>
      </div>
    ));

  // helper anonymous functions that fire on click, to prevent infinite re-render in returned main object
  const fightBoss = () => setPage("arena");
  const mintCharacter = () => setPage("selectcharacter");

  return (
    <div className="arena-container">   
      <h2>Your Characters</h2>
      <div className="players-container">
        {renderCharacterNFT()}
      </div>
      <div className="button-container">
        <button className="cta-button" onClick={mintCharacter}>
          Mint More Characters!
        </button>
        <button className="cta-button" onClick={fightBoss}>
          Fight the Boss!
        </button>
      </div>
    </div>
  );
};

export default YourCharacters;
