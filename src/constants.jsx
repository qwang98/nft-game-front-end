const CONTRACT_ADDRESS = '0x45D3817c10192F95575B2C13077D022277D1d090'; // deployed on Goerli Testnet

const transformCharacterData = (characterData) => {
  return {
    index: characterData.characterIndex.toNumber(),
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

const transformBossData = (bossData) => {
  return {
    name: bossData.name,
    imageURI: bossData.imageURI,
    hp: bossData.hp.toNumber(),
    maxHp: bossData.maxHp.toNumber(),
    attackDamage: bossData.attackDamage.toNumber(),
  };
}

export {CONTRACT_ADDRESS, transformCharacterData, transformBossData};

