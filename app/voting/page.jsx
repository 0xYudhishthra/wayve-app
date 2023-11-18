'use client'
import ApplicationLogo from "../components/ApplicationLogo"
import MainTitle from "../components/MainTitle"
import Desc from "../components/Desc"
import Card from "../components/Card"
import { FieldSet, RadioButton } from '@ensdomains/thorin'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function Voting() {

  const [checked, setChecked] = useState()
  const [foor, setFoor] = useState(0)
  const [against, setAgainst] = useState(0)


  // contract and provider

  const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/bacf8ec5ca9e45a48cd54424d47e2811")
  const wallet = new ethers.Wallet("0cd14d6fe492bb127068b07a599fac4aee83d023049a76b597ef80d6d8074cb9", provider)

  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "proposals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "forCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "againstCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [

      ],
      "name": "propose",
      "outputs": [

      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "decision",
          "type": "bool"
        }
      ],
      "name": "vote",
      "outputs": [

      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const contract = new ethers.Contract("0x9c376ecff687e22adde574330278ef626181567a", abi, wallet)

  // get current votes

  const getVotes = async () => {

    const proposals = await contract.proposals(0)

    setFoor(proposals.forCount.toString())
    setAgainst(proposals.againstCount.toString())

  }

  // submit an on chain vote

  const submitVote = async (checked) => {

    console.log(`casting vote on chain`)
    const vote = await contract.vote(0, checked)
    console.log(vote)

  }

  useEffect(() => {
    getVotes()
  }, [checked])

  return (
    <div>
      <ApplicationLogo />
      <div className="mb-12 space-y-4">
        <div className="max-w-xl">
          <MainTitle text="Vote" />
          <Desc text="Have a say for what's best for your community." />
        </div>

        <div className="p-4 w-full rounded-2xl bg-cover flex flex-col justify-between" style={{ backgroundImage: `url("pexels-5.jpg")`, aspectRatio: '16 / 9' }}>
          <div className="text-white font-medium text-xl">ESG #0</div>
          <div className="flex justify-between items-end">
            <div className="text-white">{`${foor} For | ${against} Against`}</div>
            <div className="text-white">01 days 11 hours</div>
          </div>
        </div>

        <div>
          <h3 className="font-medium">A Quick Note:</h3>
          <Desc text="Vote for your ESG option. Once you've confirmed your vote, it is final and irreversible." />

          <FieldSet>
            <RadioButton label="For" name="RadioButtonGroup" value="for" onChange={() => setChecked(true)} />
            <RadioButton label="Against" name="RadioButtonGroup" value="against" onChange={() => setChecked(false)} />
          </FieldSet>
        </div>
      </div>

      <button
        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-primary hover:opacity-80 px-4 py-2 text-base font-medium text-white focus:outline-none md:w-auto mt-8"
        onClick={() => submitVote(checked)}
      >
        Vote
      </button>
    </div>
  )
}