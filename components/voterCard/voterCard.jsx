import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../Card/Card.module.css";
import images from "../../assets";
import voterCardStyle from "./VoterCard.module.css";


const VoterCard = ({voterArray}) => {
  return (
    <div className={Style.card}>
      {voterArray.map((el, i) => (
        <div className={Style.card__box} key={i + 1}>
          <div className={Style.image}>
            <img src={el[4]} alt="Profile photo" />
          </div>

          <div className={Style.card__info}>
            <h2>
              {el[1]} #{el[0].toNumber()}
            </h2>

            <p>Address: {el[3].slice(0, 30)}...</p>

            <p>Details</p>
            <p className={voterCardStyle.voter__Status}>
              {el[6] == true ? "You Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterCard;
