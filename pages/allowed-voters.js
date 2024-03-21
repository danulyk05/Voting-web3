import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

// INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from '../styles/allowedVoter.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    position: '',
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

  //------------Voters image drop-----------//
  const onDrop = useCallback(async (acceptedFil) => {
    const url = await uploadToIPFS(acceptedFil[0]);

    setFileUrl(url);
  });

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  })

useEffect(() => {
  getAllVoterData();
}, [])
console.log(voterArray);


  //--------------JSX part--------------//

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image"/>
            <div className={Style.voterInfo__paragraph}>
              <p>
                Name: <span>&nbsp; {formInput.name}</span>
              </p>
              <p>
                Add: &nbsp; <span>{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Pos: &nbsp; <span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo__box}>
              <h4>Created candidate For Voting</h4>

              <p>
                Blockchain voting organization, provide ethereum blockchain eco system
              </p>

              <p className={Style.sideInfo__para}>
                Contract Candidate List
              </p>

              <div className={Style.card}>
                {voterArray.map((el, i) => (
                  <div key={i +1} className={Style.card__box}>
                    <div className={Style.image}>
                      <img src={el[4]} alt="Profile photo"/>
                    </div>

                    <div className={Style.card__info}>
                      <p>{el[1]}</p>
                      <p>Address: {el[3].slice(0, 10)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>

          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter__container__box__div__info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM MAX 10MB</p>

                  <div className={Style.voter__container__box__div__image}>
                    <Image 
                    src={images.upload}
                    width={150}
                    height={150}
                    objectFit="contain"
                    alt="File upload"
                    />

                    <p>Drag & Drop File</p>
                    <p>or Browse Media on your device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input 
            inputType="text" 
            title="Name"
            placeholder="Voter name"
            handleClick={(e) => setFormInput({...formInput, name: e.target.value})}
          />

          <Input 
            inputType="text" 
            title="Address"
            placeholder="Voter address"
            handleClick={(e) => setFormInput({...formInput, address: e.target.value})}
          />

          <Input 
            inputType="text" 
            title="Position"
            placeholder="Voter position"
            handleClick={(e) => setFormInput({...formInput, position: e.target.value})}
          />

          <div className={Style.Button}>
            <Button btnName="Authorized Voter" handleClick={() => createVoter(formInput, fileUrl, router)}/>
          </div>
        </div>
      </div>
      
      {/* ------------------------------------ */}
      
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={images.creator} alt="user Profile" />
          <p>Notice For User</p>
          <p>Organizer <span>0x9094853805...</span></p>
          <p>Only organizer of the voting contract can create voter</p>
        </div>
      </div>
    </div>
  )
}

export default allowedVoters;
