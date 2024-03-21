import React, { useEffect, useState } from 'react';
import Web3Model from "web3modal";
import { ethers } from 'ethers';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
// import {} from '@pinata/sdk';
import axios from 'axios';
import { useRouter } from 'next/router';

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from './constants';

// const client = ipfsHttpClient('https://api.pinata.cloud/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = 'My first smart contract app';
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);

    //--------------END OF CANDIDATE DATA---------------//

    const [error, setError] = useState('');
    const highestVote = [];

    //--------------VOTER SECTION---------------//

    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);

    //--------------CONNECTING METAMASK---------------//

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError('Please Install MetaMask');

        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0]);
        } else {
            setError('Please Install MetaMask & Connect, Reload');
        }
    }

    //---------------CONNECT WALLET--------------//

    const connectWallet = async () => {
        if (!window.ethereum) return setError('Please Install MetaMask');

        const account = await window.ethereum.request({ method: "eth_requestAccounts" });

        setCurrentAccount(account[0]);
    }

    //-------------UPLOAD TO IPFS VOTER IMAGE-------------//
    const uploadToIPFS = async (file) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: 'eafb7c07bdb5bf839d72',
                        pinata_secret_api_key: `6c73f5699d72d98dc060687ebcf14a9c3ee1e47100407d1d7125430a70075110`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

                return ImgHash;
            } catch (error) {
                console.log('Unable to upload image to Pinata')
            }
        }
    }

    //-----------------Create Voter--------------//

    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;

            if (!name || !address || !position) return setError("Input data is missing");

            //Connecting smart contract section

            const we3Model = new Web3Model();

            const connection = await we3Model.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();

            const contract = fetchContract(signer);

            const data = JSON.stringify({ name, address, position, image: fileUrl });

            const response = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    pinata_api_key: 'eafb7c07bdb5bf839d72',
                    pinata_secret_api_key: `6c73f5699d72d98dc060687ebcf14a9c3ee1e47100407d1d7125430a70075110`,
                    "Content-Type": "application/json",
                },
            });

            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

            const voter = await contract.voterRight(address, name, url, fileUrl);
            voter.wait();

            console.log(voter);

            router.push("/voterList");

        } catch (error) {
            setError("Something wrong creating voter")
        }
    }

    //------------------Get voter data-------------//

    const getAllVoterData = async () => {

        try {
            //Connecting smart contract section

            const we3Model = new Web3Model();
            const connection = await we3Model.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            // Voter List

            const voterListData = await contract.getVoterList();
            setVoterAddress(voterListData);

            voterListData.map(async (el) => {
                const singleVoterData = await contract.getVoterData(el);
                pushVoter.push(singleVoterData)
            })

            //Voter Length

            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());
        } catch (error) {
            setError("Something went wrong fetching data");
        }

    }

    //----------------Give Vote--------------//
    const giveVote = async (id) => {
        try {
            const voterAddress = id.address;
            const voterId = id.id;
            //Connecting smart contract section

            const we3Model = new Web3Model();
            const connection = await we3Model.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const voteredList = await contract.vote(voterAddress, voterId);
            console.log(voteredList);;
        } catch (error) {

        }
    }

    //----------------Set Candidate-------------//

    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;

            if (!name || !address || !age) return setError("Input data is missing");

            //Connecting smart contract section

            const we3Model = new Web3Model();
            const connection = await we3Model.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            console.log(address);

            const data = JSON.stringify({ name, address, image: fileUrl, age });
            const response = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    pinata_api_key: 'eafb7c07bdb5bf839d72',
                    pinata_secret_api_key: `6c73f5699d72d98dc060687ebcf14a9c3ee1e47100407d1d7125430a70075110`,
                    "Content-Type": "application/json",
                },
            });

            const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

            const candidate = await contract.setCandidate(address, age, name, fileUrl, ipfs);
            candidate.wait();

            console.log(candidate);

            router.push("/");

        } catch (error) {
            setError("Something wrong creating voter")
        }
    }

    //-------------Get Candidate data------------//

    const getNewCandidate = async () => {
        try {
            //Connecting smart contract section

            const we3Model = new Web3Model();
            const connection = await we3Model.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            //-----------All Candidate----------//

            const allCandidate = await contract.getCandidate();


            allCandidate.map(async (el) => {
                const singleCandidateData = await contract.getCandidateData(el);

                pushCandidate.push(singleCandidateData);
                candidateIndex.push(singleCandidateData[2].toNumber());
            });

            //------------Candidate Length-----------//

            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());
        } catch (error) {

        }
    }

    return (
        <VotingContext.Provider value={{
            votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            error,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
            candidateIndex
        }}>
            {children}
        </VotingContext.Provider>
    )
}

