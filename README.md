# NFT Game (Front End)
Turn based NFT game similar to Axie Infinity. This repo contains the front end only. See the other repo for the contract back end. <i>Inspired by a Buildspace project.</i> 

## Try it out
The front end is hosted on Replit: https://nft-game-starter-project-11.qianwang10.repl.co/ <br/>
You need to have a MetaMask wallet and set up an account on the Goerli Testnet, where this project is launched on.

## User Interface
### Step 1
![image](https://user-images.githubusercontent.com/117886596/213135101-41bc36c9-624e-456d-a591-0cd944503c83.png)
User lands on the welcome page of the website, where a button prompts the MetaMask browser extension wallet to connect to the backend contract via the Goerli Testnet.

### Step 2
![image](https://user-images.githubusercontent.com/117886596/213135925-e9f2a30a-dedc-4b18-bc3f-3024bf4ff8c7.png)
If the Goerli account is connected the first time, users are directed to the mint NFT page, where the user can mint one of the three characters, each with different HP and attack points. <br/>
Each mint takes approx. 30 seconds to complete. The website text field will indicate once the NFT is minted. You can mint as many NFTs as you'd like. <br/>
Click on the `Back to Characters Page` button to browser the minted NFTs and their stats.

### Step 3
![image](https://user-images.githubusercontent.com/117886596/213136364-0c249ce6-d81f-46b4-8a7e-15ec42336c31.png)
On the characters page, the stats of each minted NFT is displayed. You can also click on the "View on OpenSea" button to view it on OpenSea. <br/>
Click on the `Fight the Boss!` button to start your battle.

### Step 4
![image](https://user-images.githubusercontent.com/117886596/213138852-b0faa601-7e38-4d39-94d5-51c576b0c979.png)
On the boss arena page, you need to click and select a character and then click on the `Attack {boss.name}` button to attack the boss. <br/>
The boss will play a shaking animation before boss hp is deducted by player attack damage. Player hp is also deducted by boss attack daamge. An attack can take up to 20 seconds. <br/>
All player stats are stored on-chain on Goerli Testnet and you can view them anytime on OpenSea.

### Step 5
You can navigate among the characters page, the boss arena page, and the minting page at any time while on the website. Multiple accounts can connect to the website to mint characters and fight the boss together.

## Next Steps
I plan to: 
- implement a user leaderboard to rank account addresses by total damage dealed;
- convert the website to an NFT smart contract launcher where the user can upload images via integrated API and set default characters stats;
- allow users to delete characters;
- create a character upgrade shop to upgrade attack damage or replenish hp by spending an in-game currency.
