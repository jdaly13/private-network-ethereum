let fs = require('fs');
let solc = require('solc')
let Web3 = require('web3');

let contract = compileContract();
let web3 = createWeb3();
console.log('web3');


deployContract(web3, contract)
    .then(function () {
        console.log('Deployment finished')
    })
    .catch(function (error) {
        console.log(`Failed to deploy contract: ${error}`)
    })

function compileContract() {
    let compilerInput = {
        language: 'Solidity',
        sources: {
            'WWTtoken.sol': {
                content: fs.readFileSync('WWTtoken.sol', 'utf8')
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    };

    function findImports(path) {
        console.log('path', path);
        return {
            contents: fs.readFileSync(`node_modules/${path}`, 'utf-8')
        }
    }

    console.log('Compiling the contract')
    // Compile the contract
    let output = JSON.parse(
        solc.compile(JSON.stringify(compilerInput), {import: findImports})
    );
    console.log('output', output)
    // Get compiled contract
    let contract = output.contracts['WWTtoken.sol']['WWTtoken']

    // Save contract's ABI
    // let abi = contract.abi;
    fs.writeFileSync('token-abi.json', JSON.stringify(contract));
    fs.writeFileSync('../survey-app/src/token-abi.json', JSON.stringify(contract))

    return contract;
}

function createWeb3() {
    return new Web3('http://localhost:8545') //port you are using in network
}

async function deployContract(web3, contract) {
    let Token = new web3.eth.Contract(contract.abi);
    let bytecode = '0x' + contract.evm.bytecode.object;
    //let gasEstimate = await web3.eth.estimateGas({data: bytecode});
    let accounts = await web3.eth.getAccounts();

    // const nodeGasPrice = await web3.eth.getGasPrice();
    // console.log('gasprice',nodeGasPrice);


    const amount = (1e26).toLocaleString('fullwide', {useGrouping:false});
    console.log('initial supply', amount);
    console.log('accounts', accounts[0])


    const contractInstance = await Token.deploy({
        data: bytecode,
        arguments: [amount]
    })
    .send({
        from: accounts[0],
        gas: '3249054591'
    })
    .on('transactionHash', function(transactionHash) {
        console.log(`Transaction hash: ${transactionHash}`);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
        console.log(`Confirmation number: ${confirmationNumber} plus ${receipt.blockNumber}`);
        
    })
    .on('receipt', function(receipt){
        console.log(receipt.contractAddress) // contains the new contract address
        const address = receipt.contractAddress;
        const data = JSON.stringify(address);
        fs.writeFileSync('contract-address.json', data);
        fs.writeFileSync('../survey-app/src/contract-address.json', data);
     })
    .on('error', (error)=> {
        console.log('errrr', error)
    })

    console.log(`Contract address: ${contractInstance.options.address}`);
}