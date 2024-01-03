import { ethers } from "hardhat";
import { Contract, encodeBytes32String, Wallet, parseEther } from "ethers";
import { LSPFactory } from "@lukso/lsp-factory.js";
import LSP7Mintable from "@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json";

const networkUrl = "https://rpc.testnet.lukso.network";
const chainId = 4201;

// paste here the address which is logged after successeful deployment
const lsp7MintableContractAddress =
  "0xe80845dda69829E0012690852ff8d4AfB71Bc865";

const UNIVERSAL_PROFILE_ADDRESS = "0x4E837Abe7aA876cA2cfE0D13869f41fc33e92dab";

const deployUsingLSPFactory = async () => {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log("Creating wallet with lukso EOA ");
  const controllerPrivateKey = process.env.PRIVATE_KEY || "";
  const controllerAccount = new ethers.Wallet(
    controllerPrivateKey,
    deployer.provider
  );
  console.log(controllerAccount.address, "future owner");

  const lspFactory = new LSPFactory(networkUrl, {
    deployKey: controllerPrivateKey,
    chainId,
  });
  let deployment;
  try {
    deployment = await lspFactory.LSP7DigitalAsset.deploy({
      // controllerAddress: '0x7209d269163d83832Fa22ABF059603E35BA86A0F',
      controllerAddress: controllerAccount.address,
      isNFT: true,
      name: "LPT MYTOKEN1",
      symbol: "DEMOLPT1Factory_1_1_1",
      creators: ["0x4E837Abe7aA876cA2cfE0D13869f41fc33e92dab"],
      digitalAssetMetadata: {
        description: "My NFT 2.0",
        // images: [
        //   [
        //     {
        //       width: 500,
        //       height: 500,
        //       verification: {
        //         method: 'keccak256(bytes)',
        //         data: '0xfdafad027ecfe57eb4ad044b938805d1dec209d6e9f960fc320d7b9b11cced14',
        //       },
        //       url: 'ipfs://QmPLqMFDxiUgYAom3Zg4SiwoxDaFcZpHXpCmiDzxrajSGp',
        //     },
        //     // Multiple sizes of the image should be included
        //   ],
        //   // Multiple images may be included
        // ],
      },
    });
    // await lspFactory.LSP7DigitalAsse
    console.log(deployment);
    console.log(
      `Digital asset address: ${deployment.LSP7DigitalAsset.address}`
    );
  } catch (e) {
    console.log("deployment unseccessefull");
    console.log(e);
  }
  console.log("Deployment Successefull");
  return deployment?.LSP7DigitalAsset.address;
};

const mintToken = async (toAddress: string) => {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Createing wallet with lukso EOA ");
  const controllerPrivateKey = process.env.PRIVATE_KEY || "";
  console.log(`Signer: ${controllerPrivateKey}`);
  console.log(`Signer address: ${deployer.address}`);

  console.log(`Provider: ${deployer.provider}`);

  const controllerAccount = new Wallet(controllerPrivateKey, deployer.provider);

  const abi = LSP7Mintable.abi;

  const lsp7Contract = new Contract(
    lsp7MintableContractAddress,
    abi,
    controllerAccount
  );

  console.log("Minting LSP7 mintable token ");
  // Mint the token

  let res;
  try {
    const mintingTokens = await lsp7Contract.mint(
      toAddress, // recipient
      "1", // amount
      false, // force sending to an EOA
      encodeBytes32String("minting your unique token"), // data
      { gasLimit: 500000, from: controllerAccount }
    );
    // Wait for the transaction to be mined
    console.log("Tokens are minting ... ");
    console.log(mintingTokens.hash);
    res = await mintingTokens.wait();
  } catch (e) {
    console.log("Minting LSP7 mintable failed ");
    console.log(e);
    return;
  }

  console.log("Minting LSP7 mintable was a success!");
  console.log(res);
};

// deployUsingLSPFactory()
mintToken(UNIVERSAL_PROFILE_ADDRESS)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
