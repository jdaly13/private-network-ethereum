import React, { useState } from 'react';
import * as Survey from "survey-react";
import "survey-react/survey.css";
import { json } from "./survey-json.js";
import { web3, createContract } from './ethereum';
import './App.css';

function App() {
  const model = new Survey.Model(json);
  const [contract, setContract] = useState(false);

  function enableMetaMask() {
    if (window.ethereum) {
      setContract(createContract());
      window.ethereum.enable();
    }
  }
  async function onComplete(survey, options) {
    console.log("Survey results: " + JSON.stringify(survey.data));


    if (contract) {
      let accounts = await web3.eth.getAccounts();

      const totalSupply = await contract.methods.totalSupply().call();
      console.log('total supply', totalSupply);

      const test = await contract.methods.earn(accounts[0]).send({
        from: accounts[0]
      });

      console.log('test went through', test);
  }

   }
  return (
    <div className="App">
      <h1>Survey with web3 example Earn WWT Tokens</h1>
      <button className="sv_main" onClick={enableMetaMask}>Enable Metamask</button>
      <Survey.Survey model={model} onComplete={onComplete}/>
    </div>
  );
}

export default App;
