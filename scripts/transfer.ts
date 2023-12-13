import { ethers } from 'hardhat';
import { Contract, encodeBytes32String } from 'ethers';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

async function transferToken() {
  // Create a new contract instance
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const tokenAddress = '0x18110cA95C83c9109b68e761f8055dD4c2175671';

  const upAddressSender = '0x7a215f30587BbB6D98cd0DF8DFF44351b5fd1fC9';
  const upAddressReceiver = '0x77347c1ED3321A435Ae005E6197DdBCA3fBE84e7';

  const myToken = new Contract(tokenAddress, LSP7Mintable.abi, deployer);
  const myUniversalProfile = new Contract(upAddressSender, UniversalProfile.abi, deployer);

  try {
    // Generate the calldata to token transfer
    const tokenCalldata = myToken.interface.encodeFunctionData('transfer', [
      upAddressSender,
      upAddressReceiver,
      1, // Token amount
      false, // Force parameter
      encodeBytes32String('trnasfer token'), // Additional data
    ]);

    console.log('Calldata:', tokenCalldata);

    // Call the execute function of the profile to send the LYX transaction
    // Will forward to the LSP6 Key Manager to check permissions of the controller
    const transaction = await myUniversalProfile.execute(
      0, // Operation of type CALL
      upAddressReceiver, // Recipient address including profiles and vaults
      0, // Amount in LYX
      tokenCalldata, // Contract calldata, empty for regular transfer
      { gasLimit: 500000, from: deployer }, // Gas limit of the transaction and sender address
    );

    const txReceipt = await transaction.wait();
    console.log('Transaction hash:', txReceipt.transactionHash);
    console.log('Transaction successful.');
    console.log(`Tokenstransferred from your account! ${deployer.address}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

transferToken().catch(console.error);
