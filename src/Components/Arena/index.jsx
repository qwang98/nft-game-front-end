import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import './Arena.css';
import {CONTRACT_ADDRESS, transformCharacterData, transformBossData} from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';

const Arena = ({characterNFT, setCharacterNFT, tokenId, currentAccount, page, setPage}) => {
  
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState(''); 
  const [player, setPlayer] = useState(0); // player is the selected character to attack boss

  // attack boss using the selected character
  const runAttackAction = async () => {
    try {
      if(gameContract) {
        setAttackState('attacking');
        console.log('attacking boss...');
        const attackTxn = await gameContract.attackBoss(player);
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');
      }
    } catch(error) {
      console.error("error attacking boss:", error);
      setAttackState('');
    }
  };

  const viewCharacter = () => setPage("yourcharacters");
  const mintCharacter = () => setPage("selectcharacter");

  const onCharacterClick = (index) => {
    setPlayer(tokenId[index]);
    console.log("Player with tokenId ", player, " is selected");
  }

  // render div "player" in focused state when clicked (unique tabIndex required)
  // update player state variable when a character is clicked
  const renderCharacterNFT = () => 
    characterNFT.map((character, index) => 
      <div className="player" tabIndex={index} onClick={() => onCharacterClick(index)}>
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
        </div>
      </div>
    );

  // create contract object on first render
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

  useEffect(() => {
    // set boss data on front end
    const fetchBoss = async() => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformBossData(bossTxn));
    };
    // update boss and player data on front end 
    const onAttackComplete = async (from, newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      const sender = from.toString();
      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);
      if(currentAccount === sender.toLowerCase()) {
        setBoss((prevState) => {
          return{...prevState, hp:bossHp};
        });
        const txn = await gameContract.checkIfUserHasNFT(); 
        // player data update might delay as data is pulled from on chain
        setCharacterNFT(txn.characterNFT.map((characterData) => transformCharacterData(characterData))); 
      } else {
        setBoss((prevState) => {
          return{...prevState, hp:bossHp};
        });
      }
    }

    if(gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
      if(gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
      }
    }
  }, [gameContract]);

  return (
    <div className="arena-container">
      
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
        </div>
      )}
  
      {characterNFT && (
        <h2>Your Characters</h2>
      )}
  
      {characterNFT && (
        <div className="players-container">
          {renderCharacterNFT()}
        </div>
      )}  
  
      <div className="button-container">
        <button className="cta-button" onClick={viewCharacter}>
          Back to Characters Page
        </button>
        <button className="cta-button" onClick={mintCharacter}>
          Mint More Characters!
        </button>
      </div>
      
    </div>
  );
};

export default Arena;