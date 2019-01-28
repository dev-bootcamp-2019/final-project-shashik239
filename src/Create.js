import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import BountyContract from '../build/contracts/BountyContract.json'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { Button, Form, FormGroup, Label, Input, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, Collapse, Col } from 'reactstrap'
import { Link } from 'react-router-dom'


class Create extends Component {

    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            account: null,
            isStopped: false
        }
        this.bountyContract = contract(BountyContract)
        this.createBounty = this.createBounty.bind(this)
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
            }).then(() => this.isPaused())
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

    isPaused() {
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.isStopped({ from: this.state.account })
        }).then((value) => {
            this.setState({ isStopped: value })
        })
    }

    createBounty() {
        var bountyDesc = document.getElementById("bountyProblem").value;
        var bountyReward = document.getElementById("bountyReward").value;
        var bountyRewardInWei = this.state.web3.toWei(bountyReward, "ether")
        var bountyContractInstance;
        this.bountyContract.deployed().then((instance) => {
            bountyContractInstance = instance;
            return bountyContractInstance.createBounty(bountyDesc, bountyRewardInWei, { from: this.state.account })
        }).then((value) => {
            console.log(value.valueOf());
            document.getElementById("message").innerHTML = "Success"
            document.getElementById("bountyProblem").value = ""
            document.getElementById("bountyReward").value = ""
        }).catch((error) => {
            console.log(error)
        })
    }


    render() {
        return (
            <div className="Create">
                <div className="navbar-wrapper">
                <NavbarBrand href="./" className="mr-xl-5 h-25" id="navbar-header">Home</NavbarBrand>
                </div>
                <br></br>
                <br></br>
                <div className="navbar-wrapper">
          <h1>Current ETH Address : <span id ='addressSpan' ></span> </h1>
          <br>
          </br>
          <br></br>
        </div>
                <h1 className="m-md-5">Create Bounty</h1>
                <div>
                    <Form>
                        <FormGroup row>
                            <Col sm={1}>
                                <Label for="bountyProblem" sm={1} size="lg">Bounty Information</Label>
                            </Col>
                            <Col sm={8}>
                                <Input type="textarea" name="text" id="bountyProblem" placeholder="Enter Problem Statement for Bounty Program" bsSize="lg" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={1}>
                                <Label for="bountyReward" sm={1} size="lg">Reward in ETH</Label>
                            </Col>
                            <Col sm={8}>
                                <Input type="reward" name="reward" id="bountyReward" placeholder="Enter Bounty Reward in ETH" bsSize="lg" />
                            </Col>
                        </FormGroup>
                        <p className="m-md-5"><Button size="lg" onClick={() => this.createBounty()} disabled={this.state.isStopped}>Submit</Button></p>
                        <p className="p" id="message"></p>
                    </Form>
                </div>
            </div >
        );
    }
}

export default Create
