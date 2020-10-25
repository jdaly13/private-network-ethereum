let fs = require('fs');
let Web3 = require('web3');

var web3 = new Web3('http://localhost:8000')


let file = fs.readFileSync('token-abi.json', 'utf8');
let json = JSON.parse(file);
let abi = json.abi;


const addressFile = fs.readFileSync('contract-address.json', 'utf8');
const contractAddress = JSON.parse(addressFile);


/***** UPDATE THESE VALUES **********/
const contractOwnerAkaNode1 = "0xccb91Cf4495E16d067477cA007553F39CD75700c";
const node2Address = "0x07547f39B8586Ff177108d35a92D234883596395";

let wwt_token = new web3.eth.Contract(abi, contractAddress);



async function sendTransaction() {
    console.log("get totatl supply");
    const totalSupply = await wwt_token.methods.totalSupply().call();
    console.log('total supply', totalSupply);

    console.log("get balance of owner");
    //address that deployed the account
    const ownerAmount = await wwt_token.methods.balanceOf(contractOwnerAkaNode1).call(); 
    console.log('owner amount', ownerAmount);

    console.log("get balance of node 2");
    var balance = await web3.eth.getBalance(node2address); 
    console.log('balance node 2', balance);

    let accounts = await web3.eth.getAccounts();
    console.log(accounts[0] === node2address); //should be true

    console.log('buy tokens');
    var purchase = await wwt_token.methods.buy(accounts[0]).send({
        from: accounts[0],
        value: 10041557045158
    });
    console.log('return value of purchase ', purchase);

    console.log('get balance of node 2 tokens');
    const nodeTwoAmount = await wwt_token.methods.balanceOf(accounts[0]).call(); 
    console.log('node 2', nodeTwoAmount );

    console.log('get balance of owner tokens');
    const ownerAmount2 = await wwt_token.methods.balanceOf(contractOwnerAkaNode1).call(); 
    console.log('owner amount should be less', ownerAmount2 );

}

sendTransaction()
    .then(function() {
        console.log("Done");
    })
    .catch(function(error) {
        console.log(error);
    })