import { ethers } from "hardhat";
import {
  Contract,
  encodeBytes32String,
  Wallet,
  solidityPacked,
  parseEther,
} from "ethers";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import LSP7Mintable from "@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json";
import { LSP25_VERSION } from "@lukso/lsp-smart-contracts";
import { EIP191Signer } from "@lukso/eip191-signer.js";

async function executeRelayCall() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const signerPK =
    "cb89144c1eac27439866763a599de0d1f9bae2dd0c641da7ee32f50e10d165ec";
  const universalProfileSender = "0x4E837Abe7aA876cA2cfE0D13869f41fc33e92dab";
  const universalProfileReceiver = "0x77347c1ED3321A435Ae005E6197DdBCA3fBE84e7";

  // setup the Universal Profile controller account
  const controllerPrivateKey =
    "0x95de8c526289984705b7a0876194895a21fb6e036244f5827e61a2551f3ba38f";

  // TODO: get from the config
  const controllerAccount = new ethers.Wallet(controllerPrivateKey).connect(
    deployer.provider
  );

  const universalProfile = new ethers.Contract(
    universalProfileSender,
    UniversalProfile.abi,
    controllerAccount
  );

  const keyManagerAddress = await universalProfile.owner();

  console.log("KeyManagerAddress received:", keyManagerAddress);

  const keyManager = new ethers.Contract(
    keyManagerAddress,
    KeyManagerContract.abi,
    controllerAccount
  );

  const channelId = 0;
  const nonce = await keyManager.getNonce(controllerAccount.address, channelId);

  const validityTimestamps = "0"; // no validity timestamp set
  const msgValue = 0; // Amount of native tokens to fund the UP with while calling

  const abiPayload = universalProfile.interface.encodeFunctionData("execute", [
    0, // Operation type: CALL
    universalProfileReceiver,
    parseEther("0.5"), // transfer 0.5 LYX to recipient
    encodeBytes32String("transferring LYX: Relay"), // Additional data
  ]);

  const { chainId } = await deployer.provider.getNetwork();

  // prettier-ignore
  let encodedMessage = solidityPacked(
  ['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes'],
  [
    LSP25_VERSION,       
    chainId,             
    nonce,              
    validityTimestamps, 
    msgValue,           
    abiPayload,         
  ],
);
  console.log("encodedMessage received:", encodedMessage);

  let eip191Signer = new EIP191Signer();

  let { signature } = await eip191Signer.signDataWithIntendedValidator(
    keyManagerAddress,
    encodedMessage,
    signerPK
  );
  console.log("signature received:", signature);

  const contract = keyManager.connect(controllerAccount);
  console.log("Connected to the key manager");

  // calling keyManager.executeRelayCall throws the same error
  await (contract as Contract).executeRelayCall(
    signature,
    nonce,
    validityTimestamps,
    abiPayload
  );
  // throws
  // ProviderError: execution reverted
  // without further details
}

// TODO: use later to transfer LSP7 token
const getLSP7AbiPayload = async (
  sender: string,
  eoaKey: string,
  receiver: string
) => {
  const lsp7TokenAddress = "0x18110cA95C83c9109b68e761f8055dD4c2175671";
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const owner = new Wallet(eoaKey, deployer.provider);

  const myToken = new Contract(lsp7TokenAddress, LSP7Mintable.abi, owner);
  const tokenCalldata = myToken.interface.encodeFunctionData("transfer", [
    sender,
    receiver,
    1, // Token amount
    false, // Force parameter
    encodeBytes32String("transferring token with relay server"), // Additional data
  ]);
  return tokenCalldata;
};

executeRelayCall().catch(console.error);
