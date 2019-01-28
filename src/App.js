import React, { Component } from 'react'
import BountyContract from '../build/contracts/BountyContract.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Jumbotron, Container, Button, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null
    }
    this.bountyContract = contract(BountyContract)
  }

  componentWillMount() {

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {

    this.bountyContract.setProvider(this.state.web3.currentProvider)
    // Declaring this for later so we can chain functions on bountyContract.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.bountyContract.deployed().then(() => {
        this.setState({ account: accounts[0] });
      })  
    })
    var ethAccount = this.state.web3.eth.accounts[0];
    var stateAccount = this.state.account;
    var accountInterval = setInterval(function() {
      if (ethAccount !== stateAccount) {
        document.getElementById("addressSpan").innerHTML = ethAccount;
      }
    }, 100);

  }

  render() {
    return (
      <div className="App">
        <div className="navbar-wrapper">
          <h1>Current ETH Address : <span id ='addressSpan' ></span> </h1>
          <br>
          </br>
          <br></br>
        </div>
        <Row>
          <Col lg="3">
            <h2 className="text-center">Create</h2>
            <p className="text-center" id="text-desc">Create a Bounty and assign a Reward.</p>
            <p className="text-center" ><Button size="lg" id="pure-button-primary"><Link to="/create" >Create</Link></Button></p>
          </Col>
          <Col lg="3">
            <h2 className="text-center">Browse</h2>
            <p className="text-center" id="text-desc">Check current Bounties and provide a solution to Bounty.</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/browse">Browse</Link></Button></p>
          </Col>
          <Col lg="3">
            <h2 className="text-center">Dashboard</h2>
            <p className="text-center" id="text-desc">Check Status,Solutions and Rewards</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/dashboard">Dashboard</Link></Button></p>
          </Col>
          <Col lg="3">
            <h2 className="text-center">Admin</h2>
            <p className="text-center" id="text-desc">Admin jobs-Pause contracts,Accept Solutions etc</p>
            <p className="text-center"><Button id="pure-button-primary" size="lg"><Link to="/admin">Admin</Link></Button></p>
          </Col>
        </Row>
      </div >
    );
  }
}

export default App
