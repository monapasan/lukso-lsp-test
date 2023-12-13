import { ethers } from 'hardhat';
import {
  LptLSP7,
  LptLSP7__factory,
  EventTicketsNFT,
  EventTicketsNFT__factory,
} from '../typechain-types';

async function deployLPT() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log(deployer.address);

  //   const { maxFeePerGas, maxPriorityFeePerGas } = await ethers.provider.getFeeData();

  //   const customToken = await ethers.getContractFactory('LptLSP7');

  const Token = await customToken.deploy({
    maxFeePerGas,
    maxPriorityFeePerGas,
    type: 2,
  });
  const token = await Token.waitForDeployment();
  const CustomTokenAddress = await token.getAddress();
  // without dynamic fee handling
  const nftCollection: LptLSP7 = await new LptLSP7__factory(deployer).deploy();

  await nftCollection.waitForDeployment();
  const CustomTokenAddress = await nftCollection.getAddress();
  console.log(nftCollection.getAddress());

  console.log('\x1b[32m%s\x1b[0m', `📄 Contract deployed at: ${CustomTokenAddress}\n`);
  console.log('\x1b[32m%s\x1b[0m', `📄 Deployer Address: ${deployer.address}\n`);

  // create 100 entry tickets.
  // Give them to the deployer initially, who will distribute them afterwards.
  //   await nftCollection.mint(
  //     deployer.address, // recipient
  //     100, // amount
  //     true, // force sending to an EOA
  //     // data
  //     ethers.encodeBytes32String('minting 100 tickets'),
  //   );
}

deployLPT().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
