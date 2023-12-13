import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

async function mintTokens(contractAddress: string, abi: [], mintData: []) {
  const [deployer] = await ethers.getSigners();

  // Read ABI from JSON file
  //   const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, abiFilePath), 'utf-8')).abi;

  // Create a new contract instance
  const contract = new Contract(contractAddress, abi, deployer);

  // Execute the mint function
  // Ensure that 'mintFunctionName' is replaced with your actual mint function name
  const mintTx = await contract['mint'](
    '0x4799200427aA99eEeff861418B48Ce2198bCD3B9', // recipient
    1, // amount
    true, // force sending to an EOA
    ethers.encodeBytes32String('minting your unique token'), // data
  );

  // Wait for the transaction to be mined
  await mintTx.wait();

  console.log(`Tokens minted successfully and transferred to your account! ${deployer.address}`);
}
const abiFilePath = '../artifacts/contracts/LPT.sol/LptLSP7.json';
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, abiFilePath), 'utf-8')).abi;

mintTokens('0xF014e9A17db70b1537dff0ACaDf286308B2fbAc0', abi, []).catch(console.error);
// console.log(abi);

// async function mintTokens() {
//   const accounts = await ethers.getSigners();
//   const deployer = accounts[0];

//   // The address of your already deployed contract
//   const deployedContractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

//   // Connect to the deployed contract
//   const nftCollection = LptLSP7__factory.connect(deployedContractAddress, deployer);

//   // Addresses and amounts for minting
//   const recipients = [
//     { address: '0xAddress1', amount: 50 },
//     { address: '0xAddress2', amount: 30 },
//     // Add more recipients as needed
//   ];

//   // Mint tokens to each recipient
//   for (const recipient of recipients) {
//     await nftCollection.mint(
//       recipient.address, // recipient address
//       recipient.amount, // amount to mint
//       true, // force sending to an EOA
//       ethers.utils.toUtf8Bytes('Minting tokens'), // data
//     );
//   }

//   console.log('Tokens minted successfully');
// }
// import { ethers } from 'hardhat';

// import { EventTicketsNFT, EventTicketsNFT__factory } from '../typechain-types';

// async function deployAndCreateTickets() {
//   const accounts = await ethers.getSigners();
//   const deployer = accounts[0];

//   const luksoMeetupTickets: EventTicketsNFT = await new EventTicketsNFT__factory(deployer).deploy(
//     'LUKSO Meetup #2',
//     'MUP2',
//     deployer.address,
//   );

//   // create 100 entry tickets.
//   // Give them to the deployer initially, who will distribute them afterwards.
//   await luksoMeetupTickets.mint(
//     deployer.address, // recipient
//     100, // amount
//     true, // force sending to an EOA
//     'minting 100 tickets', // data
//   );
// }

// deployAndCreateTickets().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
