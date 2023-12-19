
# LUKSO Transaction Test Repository

This is set up to allow the LUKSO team to conduct transaction tests and debug any issues that might arise.

## Prerequisites


- Node.js (v16.20.2)

## Running the Test Transaction

To run the test transaction script, use the following command:

```bash
npm run transferLyxRelayCall
```

This script uses relay call to execute a transaction on the LUKSO blockchain and is set up for testing purposes.


## What needs to happen

We have an Lukso EOA that should fund transfer transaction.
As input we have have Up1 that transfers LSP7 token to Up2.
This transaction is funded by Lukso EOA.

