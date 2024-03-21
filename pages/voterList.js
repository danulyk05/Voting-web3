import React, {useContext, useEffect, useState} from "react";

import { VotingContext } from "../context/Voter";
import VoterCard from "../components/VoterCard/voterCard";
import Style from "../styles/voterList.module.css";


const voterList = () => {
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
    getAllVoterData();
  }, [])
  console.log(voterArray);

  return (
    <div className={Style.voterList}>
        <VoterCard  voterArray={voterArray}/>
    </div>
  );
}
export default voterList;
