import Web3 from 'web3'
import data from '../token-abi.json';
import address from '../contract-address.json';

const {abi} = data;

export const web3 = new Web3(window.ethereum);

export function createContract() {
     return new web3.eth.Contract(abi, address)
}