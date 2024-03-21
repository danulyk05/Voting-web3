import React, { useState, useEffect, useContext } from "react";
import Image from 'next/image';
import Countdown from 'react-countdown';

//INTERNAL IMPORT 
import { VotingContext } from "../context/Voter";
import Style from '../styles/index.module.css';
import Card from '../components/Card/Card';
import image from '../assets/candidate-1.jpg';

const index = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    currentAccount,
    candidateLength,
    voterLength,
    voterArray,
    getAllVoterData
  } = useContext(VotingContext);

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllVoterData();
    getNewCandidate();
  }, [])


  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner__info}>
            <div className={Style.candidate__list}>
              <p>
                No Candidate: <span>{candidateLength}</span>
              </p>
            </div>

            <div className={Style.candidate__list}>
              <p>
                No Voter: <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner__message}>
            <small>
              <Countdown date={Date.now() + 100000000} />
            </small>
          </div>
        </div>
      )}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  )
};

export default index;
