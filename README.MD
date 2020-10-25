# Setting up a Private Ethereum network and deploying and interacting with a smart contract    

[Please see Proposal file for more info](Proposal.md)  

## Prerequisites  
GO Ethereum (Geth)  
Node/NPM  
Metamask Chrome Extension  

setting up ethereum network first create an etherum folder in main directory   
Instructions and setup initially done on MAC adjust accordingly  
`cd ~`  
`mkdir ethereum`   
`cd ethereum`    

Create some ether accounts  
`geth account new --datadir data/node-1`  
should output an address like `0xccb91Cf4495E16d067477cA007553F39CD75700c`    
`geth account new --datadir data/node-2`  
should output an address like `0x07547f39B8586Ff177108d35a92D234883596395`  
`geth account new --datadir data/node-3`  
should output an address like `0x7b2f82d749cfafDB126362e14a0334be5B1b41f2`    


create genesis file in data directory - Example template link below  
https://gist.github.com/jdaly13/9176c4f0ce02fe26df110a35994c8913  
Make sure your alloc field in the file matches the address you created in accounts remove 0x from beginning  

In a terminal tab
initialize genesis block 
Make sure you update genesis.json to add your accounts and change network ID   
`geth --datadir data/node-1 init data/genesis.json`  

Once initiliazed you can run the node  
`geth --datadir data/node-1 --networkid 8572054696  --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*"  --port 30303 --rpcapi admin,debug,eth,miner,net,personal,txpool,web3 --ipcdisable --nodiscover --allow-insecure-unlock`  

Explanation of flags below  
--datdir {data directory}  
--networkid {how others can find you should be same as chain ID in genesis file}  
--rpc{http}  
--rpcaddr interface 0.0.0.0 allows all incoming connections  
--port {network port}  
--rpcapi {apis associated with http that you can use in javascript console }  
--ipcdisable {default server unix domain socket we use http instead }  
--nodiscover {means you manually add peers instead of built in find mechanism}  
--allow-insecure-unlock allows you to unlock accounts via http   

whenn above command is run succesfully you should see output to the console like  
```
INFO [09-03|12:18:46.920] Allocated cache and file handles         database=/Users/jdaly/ethereum/data/node-1/geth/chaindata cache=512.00MiB handles=5120
INFO [09-03|12:18:47.072] Opened ancient database                  database=/Users/jdaly/ethereum/data/node-1/geth/chaindata/ancient
INFO [09-03|12:18:47.074] Initialised chain configuration          config="{ChainID: 8572054695 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: 0 EIP155: 0 EIP158: 0 Byzantium: 0 Constantinople: 0 Petersburg: 0 Istanbul: <nil>, Muir Glacier: <nil>, YOLO v1: <nil>, Engine: ethash}"
INFO [09-03|12:18:47.074] Disk storage enabled for ethash caches   dir=/Users/jdaly/ethereum/data/node1/geth/ethash count=3
INFO [09-03|12:18:47.074] Disk storage enabled for ethash DAGs     dir=/Users/jdaly/Library/Ethash count=2
INFO [09-03|12:18:47.074] Initialising Ethereum protocol           versions="[65 64 63]" network=8572054695 dbversion=<nil>
WARN [09-03|12:18:47.074] Upgrade blockchain database version      from=<nil> to=8
INFO [09-03|12:18:47.078] Loaded most recent local header          number=0 hash="169996…e9c61e" td=1 age=51y4mo4w
INFO [09-03|12:18:47.078] Loaded most recent local full block      number=0 hash="169996…e9c61e" td=1 age=51y4mo4w
INFO [09-03|12:18:47.078] Loaded most recent local fast block      number=0 hash="169996…e9c61e" td=1 age=51y4mo4w
INFO [09-03|12:18:47.079] Regenerated local transaction journal    transactions=0 accounts=0
INFO [09-03|12:18:47.090] Allocated fast sync bloom                size=512.00MiB
INFO [09-03|12:18:47.091] Initialized fast sync bloom              items=4 errorrate=0.000 elapsed="271.202µs"
INFO [09-03|12:18:47.091] Starting peer-to-peer node               instance=Geth/v1.9.20-stable/darwin-amd64/go1.15
INFO [09-03|12:18:47.132] New local node record                    seq=1 id=fe1300dba05b839e ip=127.0.0.1 udp=0 tcp=30301
INFO [09-03|12:18:47.132] Started P2P networking                   self="enode://294ea3783e96cb2b17de38fb1d574dab85246b63a949bcc5fc291d7b4df2a4a16b1f55fd4e14656e8bb337116c43e86a8e71db4d36b7856106f205ea342cf90b@127.0.0.1:30301?discport=0"
INFO [09-03|12:18:47.133] HTTP server started                      endpoint=127.0.0.1:8545 cors= vhosts=localhost
INFO [09-03|12:18:47.142] Mapped network port                      proto=tcp extport=30301 intport=30301 interface=NAT-PMP(192.168.1.1)  
``` 

notice this line  
`INFO [09-03|12:18:47.132] Started P2P networking                   self="enode://294ea3783e96cb2b17de38fb1d574dab85246b63a949bcc5fc291d7b4df2a4a16b1f55fd4e14656e8bb337116c43e86a8e71db4d36b7856106f205ea342cf90b@127.0.0.1:30301?discport=0"`  
and the enode address  
in seperate tab (tab2) attach the javascript console  
`geth attach http://localhost:8545`   
Notice if we don't set --rpcport or rpcaddress it defaults to localhost:8545  
the console should appear run  
`admin.nodeInfo.enode`  
will output something different than above and notice IP address difference from one above  
`enode://294ea3783e96cb2b17de38fb1d574dab85246b63a949bcc5fc291d7b4df2a4a16b1f55fd4e14656e8bb337116c43e86a8e71db4d36b7856106f205ea342cf90b@68.184.194.48:30301?discport=0`  

## NODE 2
initialize second node with same genesis file  
Run this in a 3rd terminal tab  
`geth --datadir data/node-2 init data/genesis.json`  

Run the second node  
`geth --datadir data/node-2 --networkid 8572054696  --rpc --rpcport 8000 --rpccorsdomain "*"  --port 30302 --rpcapi admin,debug,eth,miner,net,personal,txpool,web3 --ipcdisable --nodiscover --allow-insecure-unlock`  
should see output like  
```
INFO [09-03|12:25:05.394] Started P2P networking                   self="enode://490fd34b6d9c4c82066ab65041244b539afe9aaf93de54cb21b5d15f80382dbb70695a0d274f864648e69eacfb700e82a5c79f450167dd9499a9ffeefe1e7b00@127.0.0.1:30302?discport=0"  
```  

in seperate tab fourth tab - attach javascript console notice port we set above of 8000  
`geth attach http://localhost:8000`  
then run  
`admin.nodeInfo`  
make sure info matches like enode and genesis block should output address below notice the IP is the public address and not localhost but same nodekey  
`enode://490fd34b6d9c4c82066ab65041244b539afe9aaf93de54cb21b5d15f80382dbb70695a0d274f864648e69eacfb700e82a5c79f450167dd9499a9ffeefe1e7b00@68.184.194.48:30302?discport=0`  

## Adding Peers  
In the same tab Run    
`admin.peers`  
should return empty array []  
Now add the first node as a peer you will use the enode address but use the localhost IP instead of public  
`admin.addPeer("${enode from first node}")`  
based on this readme value would be - Adjust yours accordingly  
`enode://294ea3783e96cb2b17de38fb1d574dab85246b63a949bcc5fc291d7b4df2a4a16b1f55fd4e14656e8bb337116c43e86a8e71db4d36b7856106f205ea342cf90b@127.0.0.1:30301?discport=0`  
should return true but need to actually test if was added run  
`admin.peers`  
should output an array with an object  
```
[{
    caps: ["eth/63", "eth/64", "eth/65"],
    enode: "enode://1f18cab668b97045d19eb7d4674cf89fd9f62a54d10ab4458e2f67038aece4c45fef7c8d3c7a33dd505e9feadb257969e692381c1e44f4597c4af7fe2e51c4a0@127.0.0.1:30303?discport=0",
    id: "9ac659ea2b866cb8c752f3f6f05b5ef083f1174a8088f6c5b4d3b54b2d12261c",
    name: "Geth/v1.9.12-stable/darwin-amd64/go1.14",
    network: {
      inbound: false,
      localAddress: "127.0.0.1:50476",
      remoteAddress: "127.0.0.1:30303",
      static: true,
      trusted: false
    },
    protocols: {
      eth: {
        difficulty: 1,
        head: "0x1699961eea62df74c0c5fe76d5e35cd972b55187f5508042f8c8010781e9c61e",
        version: 65
      }
    }
}]
```

### start mining  
we need a miner to mine the transaction to the block in tab 4  
`miner.start(1)`  
the 1 is the miner is the cpu threads param  
we need to be able to mine transactions if we are to deploy smart contracts  
make sure you unlock account before you deploy  
in geth console for node (tab2) for which you are deploying node-1  
`personal.unlockAccount(personal.listAccounts[0])`  
will prompt for password  
`eth.getBlock("latest")`  
will output something like  
```
{
  difficulty: 135464,
  extraData: "0xd78301090c846765746886676f312e31348664617277696e",
  gasLimit: 4007125504,
  gasUsed: 0,
  hash: "0x4d2b1641a7b21c755c17b71767db3a418f2b16cf676d85483042d1c21421ea32",
  logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  miner: "0x07547f39b8586ff177108d35a92d234883596395",
  mixHash: "0x69fece8f56cf802270f5c95d21dcabd57de11c8db7419c1804d599185aa2c034",
  nonce: "0x0584c58bb8782acf",
  number: 71,
  parentHash: "0xbaaeb67fa2ed1f2f5e6c85ec9c86bdcc3674da944078cbcc1ebe03004ca551e3",
  receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
  sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  size: 536,
  stateRoot: "0x66b7f5a2dc0c3d0bbca0a9ccfa38b7cc14edd271f43d4a76629ca69a1ca1dc0a",
  timestamp: 1600268417,
  totalDifficulty: 9460801,
  transactions: [],
  transactionsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
  uncles: []
}
```

look at gaslimit value make sure you use value below that for your gas limit in your deploy script -  We need enough gas to be mined but not too much to be over limit  
so if gasLimit was 3948826961 use a number lower but not too low e.g. 2948826961  
 
## Deploy Smart Contract  
Create a fifth tab  
`cd smart_contracts`  
Install dependencies  
`npm i`

Open deploy.js in your favorite editor at ~line 84 change gas amount to lower one above  
Change any other values as needed e.g. if you started on different port  
Now Deploy contract  
`node deploy`  
It should log out a contract address and block number which it was mined  
It should create two files one is token-abi.json the other is contract-address.json  
Both files will be written to smart contracts and survey-app/src directory for later use     

in the log you can see which block contract deployed from then in node 1 js terminal  
in either geth terminal    
`eth.getBlock({number})`  
The transactions array should not be empty  

in node2 js tab run  
`personal.unlockAccount(personal.listAccounts[0])`  

Before we run interaction script go into interaction.js and update account values  
now in same tab you ran node deploy now run  
`node interaction`  
should return some logs and something like this when a purchase is completed  
Essentially a purchase is an exchange ethereum for tokens  
```
{
  blockHash: '0x794f331443399b5e9a186ff52dfa0e3ab895d0199185a0ccc5e4e93dcdb897f4',
  blockNumber: 798,
  contractAddress: null,
  cumulativeGasUsed: 52504,
  from: '0x07547f39b8586ff177108d35a92d234883596395',
  gasUsed: 52504,
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000080000000000000000000800000000000020000000000000000000000000000000000000000000000008000008000000000000000000000000000000000000000000000800000000000000000800000000000000000000000110000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000010000000000000000000000000010000000000000000000002000000100000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000',
  status: true,
  to: '0x097932275c20b0675e4a3e9e44ea44d2c1283320',
  transactionHash: '0x720700c9be73b3738da302dbebcd59417e6f50426493d8266245095054905cfb',
  transactionIndex: 0,
  events: {
    Transfer: {
      address: '0x097932275c20B0675E4a3E9E44eA44d2C1283320',
      blockNumber: 798,
      transactionHash: '0x720700c9be73b3738da302dbebcd59417e6f50426493d8266245095054905cfb',
      transactionIndex: 0,
      blockHash: '0x794f331443399b5e9a186ff52dfa0e3ab895d0199185a0ccc5e4e93dcdb897f4',
      logIndex: 0,
      removed: false,
      id: 'log_bccd14a5',
      returnValues: [Result],
      event: 'Transfer',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      raw: [Object]
    },
    Bought: {
      address: '0x097932275c20B0675E4a3E9E44eA44d2C1283320',
      blockNumber: 798,
      transactionHash: '0x720700c9be73b3738da302dbebcd59417e6f50426493d8266245095054905cfb',
      transactionIndex: 0,
      blockHash: '0x794f331443399b5e9a186ff52dfa0e3ab895d0199185a0ccc5e4e93dcdb897f4',
      logIndex: 1,
      removed: false,
      id: 'log_1840c938',
      returnValues: [Result],
      event: 'Bought',
      signature: '0x4e08ba899977cf7d4c2964bce71c6b9a7ef76ee5166a4c1249a1e08016e33ef1',
      raw: [Object]
    }
  }
}
```

## Survey React application  
When you complete a survey you get a small amount of tokens  

### Prerequistes 
Make sure you have meta mask installed and configure it to connect to the same network in which smart contract was deployed which should be localhost:8545  
create meta mask account and make sure you are connected to localhost:8545  
once that is created you need to import you accounts from geth  
goto settings -> import account -> select json from dropdown and import the file from your keystore  for instance directory node-1/keystore/ and also enter password  
You may have to expand view in browser it may take a second or two  
Once you imported your ether address you can then add token  
Under account should be add token button  
choose custom token and paste in token address from contract-address.json  

## Run Application
in seperate tab fifth tab  
`cd survey-app && npm i`  
then run the Survey application
`npm run start`  
When the browser opens click to connect the app to metamask  
Complete survey and earn WWT tokens   

## BONUS - Adding Peers within a local network   
on the machine you have two local nodes running run
`ifconfig|grep netmask|awk '{print $2}'`  
This will output your local IP address something like `192.168.1.190`  
On another machine within your network run a new node  
You'll need to follow steps as above and have a genesis block initialize it and run the node  
create the file structure and within ethereum directory run  
`geth --datadir data/node1 init data/genesis.json`  

`geth --datadir data/node1 --networkid 8572054696  --rpc --rpcport 8001  --port 30305 --rpcapi admin,debug,eth,miner,net,personal,txpool,web3 --ipcdisable --nodiscover --rpccorsdomain "*"`  

In second terminal tab run  
`geth attach http://localhost:8001`  
Then add your peer you will need enode from your first node   
`admin.addPeer("enode://06674435ab583830edb43da0d01f3594c663eacf0e9be770b84c67f29a8cd0b02a10e4bb440f3e598d6911bdb97de21d6a37d499003966c7ab07a80271d5ae56@192.168.1.190:30303?discport=0")`  
Notice the IP address is not your public IP or 127.0.0.1/localhost but your local IP  
Once this done - this node can interact with smart contracts deployed on the blockchain  
To confirm get the number block of your smart contract or any block number and run on each node  
`eth.getBlock(47)`  
You should get the same result for each something like  
```
{
  difficulty: 134030,
  extraData: "0xd78301090c846765746886676f312e31348664617277696e",
  gasLimit: 4102198687,
  gasUsed: 1578948,
  hash: "0x2dea49c515532922cfaf3a1aeb46788d1826a06e872d86072c4b9128f4680ff6",
  logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000008000008000000000000000000000000000000000000000000020000000000000000000800000000000000000000000110000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000010000000000000000000002000000000000000000000000000000000000000000000000000020000000000000000000000000002000000000000000000000000000000000000000",
  miner: "0x07547f39b8586ff177108d35a92d234883596395",
  mixHash: "0xe621fdf0d2f5d6af3cae535a45ead18acd0cd63e06e9134da5e1670e7c832275",
  nonce: "0x7f446627226877a5",
  number: 47,
  parentHash: "0x9345144b9864c53af366f7f5c066cc59d0f968c65bcd7aea918bdd0540a67208",
  receiptsRoot: "0x5384ad97cb769a3692b3418da425fa6f3308b69327d2ccc588b73e28c7143b91",
  sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  size: 6918,
  stateRoot: "0xea487e79b609da8ab3f6acc80ddcfa0695df8b70c8bbfbcad17b8e6038424901",
  timestamp: 1600286675,
  totalDifficulty: 6229674,
  transactions: ["0x899a7f4fb0cc1cc2c3b25a441b6ef470eae208c483af8c720c28ba62b95be21f"],
  transactionsRoot: "0xaa773597fbc75050d0260d6c63d02be5c2810dee41f1874999d704ef0709e8c3",
  uncles: []
}
```    

## TroubleShooting  
Mining  
https://ethereum.stackexchange.com/questions/80145/error-transaction-was-not-mined-within-750-seconds-please-make-sure-your-trans  

Genesis block  
https://ethereum.stackexchange.com/questions/17202/fatal-failed-to-write-genesis-block-wrong-genesis-block-in-database  

Make sure everyone connects using networkid that should be same as genesis block  