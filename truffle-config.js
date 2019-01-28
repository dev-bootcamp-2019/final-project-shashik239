// Allows us to use ES6 in our migrations and tests.
require('babel-register')
const path = require("path");
let HDWalletProvider = require("truffle-hdwallet-provider")
let secrets = require('./secret.js');
const MNEMONIC = secrets.MNEMONIC;
const infuraKey = secrets.infuraKey;



module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
    compilers: {
      solc: {
        version: "0.4.24"
    }
  },  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(MNEMONIC, infuraKey)
      },
      network_id: 4
    }
  }
};