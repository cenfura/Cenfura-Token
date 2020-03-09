# Development

### Requirements

* [node lts dubnium](https://nodejs.org/en/blog/release/v10.13.0/)

### Workflow

Start a local dev blockchain on `localhost:7545` by running `npm run ganache`.

compile contracts: `npm run compile`

test contracts: `npm run test`

deploy contracts to the local dev blockchain: `npm run migrate`


## Interaction with smart contracts on ganache

The ethereum javascript API web3 is used to interact with smart contracts. To interact with the locally deployed
smart contracts simply run `npm run console`. Make sure to `compile` and `migrate` the contracts.

Now you can send messages to smart smart contracts like this:

```
CenfuraToken.deployed().then(i => i.transferOwnership(web3.eth.accounts[2]))
```

# Deployment

## Deployment to ropsten test net

For the deployment of the contracts we are going to run a test node and run the truffle migrations on
the ropsten test network.

### Requirements

* [go-ethereum client](https://github.com/ethereum/go-ethereum) There is a docker image available as well: https://hub.docker.com/r/ethereum/client-go/

### Step-by-step guide

1. Create an account on the testnet: `geth --testnet account new` (this generates a pair of public and private keys)

2. Run the geth (go-ethereum) instance: `geth --testnet --cache=1024 --light --rpc --rpcapi eth,net,web3,personal` (this enables the http rpc server, so you can connect a console to it and interact with smart contracts, running this the first time takes a few hours since it needs to get synced with the testnet)

3. In an other terminal open the console: `geth attach http://127.0.0.1:8545`

4. In the console unlock your previously created account: `personal.unlockAccount(eth.accounts[0], 'password', 0)`

5. For deploying contracts you are going to have to pay the gas fee, this means you need some ether. Go to http://faucet.ropsten.be:3001/ and paste your account address to receive 1 ether for free on the testnet. (You can get the account address by typing `eth.accounts[0]` into your console. Wait for the transaction to complete.

6. In the root of the repo run `npm run compile && npm run migrate-ropsten` to deploy the smart contracts to ropsten. This usually takes 2-3 minutes. The account `eth.accounts[0]` is the owner of the **CenfuraToken** contracts and owns all 1.5b **XCF**.

## Deployment to the main net

### Requirements

* [go-ethereum client](https://github.com/ethereum/go-ethereum) There is a docker image available as well: https://hub.docker.com/r/ethereum/client-go/

### Step-by-step guide

1. Run the geth (go-ethereum) instance without the `testnet` flag: `geth --cache=1024 --light --rpc --rpcapi eth,net,web3,personal`

2. Same as deployment on testnet

## Interaction with smart contracts on ropsten/main net

All interaction with contracts on ropsten or the main can be done using the javascript API web3.

1. Start geth `geth --testnet --light --rpc --rpcapi eth,net,web3,personal` (ropsten) or `geth --testnet --light --rpc --rpcapi eth,net,web3,personal` (main-net)

2. In another window attach your console: `geth attach http://127.0.0.1:8545`

3. If you are going to interact with smart contracts, make sure to set the default account that signs the interactions (= transations). You can do this by assigning `eth.defaultAccount` like this: `eth.defaultAccount = eth.accounts[0]`

4. In order to interact with contracts without having the source code, we need to import the application binady interface (ABI) of our smart contract. Copy the content of the compiled smart contract `build/contracts/CenfuraToken.json` and paste it to the console in order to retrieve an instance of the deployed contract:

```javascript
contractInfo = { "contractName": "CenfuraToken", "abi": [.....] }
contractAbi = contractInfo.abi
contractInstance = eth.contract(contractAbi).at('0x0000000000000000000000000000000000000000')
```

Where `0x0000000000000000000000000000000000000000` is the address of the deployed contract.

```
contractInstance
> ....
  address: "0x0000000000000000000000000000000000000000",
  transactionHash: null,
  Approval: function(),
  OwnershipTransferred: function(),
  Transfer: function(),
  allEvents: function(),
  allowance: function(),
  approve: function(),
  balanceOf: function(),
  decimals: function(),
  decreaseApproval: function(),
  increaseApproval: function(),
  initialSupply: function(),
  name: function(),
  owner: function(),
  symbol: function(),
  totalSupply: function(),
  transfer: function(),
  transferFrom: function(),
  transferOwnership: function()
```

### Examples

You can query information about the contract:
```javascript
contractInstance.owner()
> "0x0000000000000000000000000000000000000001"
contract.totalSupply()
> 1500000000000000000000000000
```

Or you can change state (this requires payment of the transaction fees):
```javascript
contractInstance.transferOwnership("0x0000000000000000000000000000000000000002")
contractInstance.transfer("0x0000000000000000000000000000000000000002", 42)
```

Keep in mind that all addresses get checked with their checksum, this means addresses are case sensitive!
If you want to fix the casing of an address you can use etherscan: https://ropsten.etherscan.io/address/0x54Dc5d7e603a3A06D6f4844160c03D5A858a6c32

Just search for an address there and copy the correctly formatted address from the header.
