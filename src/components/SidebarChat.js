import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import Avatar from '@mui/material/Avatar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import db from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

import firebase from 'firebase/compat/app';  //importing firebase 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//passing a prop addNewChat, we're going to render this component conditionally for prop addNewChat so that it contains some of the styling
const SidebarChat = ({id, name, addNewChat}) => {  
    const [dp, setDp] = useState('');
    const [messages, setMessages]= useState(''); //creating an empty state to store all the messages from the chat room
    const navigate= useNavigate();
    
    // avatar combinations
    const baseColor = ["00acc1", "1e88e5", "5e35b1", "6d4c41", "7cb342", "8e24aa", "546e7a", "3949ab", "fdd835", "d81b60"];
    const eyes = ["bulging", "dizzy", "eva", "frame1", "frame2", "glow", "happy", "robocop", "round", "shade01"];
    const face = ["round01", "round02", "square01", "square02", "square03", "square04"];
    const mouth = ["bite", "diagram", "grill01", "grill02", "grill03", "smile01", "smile02", "square01", "square02"];
    const sides = ["antenna01", "antenna02", "cables01", "cables02", "round", "square", "squareAssymetric"];
    const top = ["antenna", "bulb01", "horns", "radar", "pyramid"];

    useEffect(()=>{
        setDp(`https://api.dicebear.com/8.x/bottts/svg?baseColor=${getRamdomIndexFromArray(baseColor)}&eyes=${getRamdomIndexFromArray(eyes)}&face=${getRamdomIndexFromArray(face)}&mouth=${getRamdomIndexFromArray(mouth)}&sides=${getRamdomIndexFromArray(sides)}&top=${getRamdomIndexFromArray(top)}`);
    },[]) //will run only whenver sidebarchat loads

    useEffect(()=>{
        if(id){ //if we pass id
            db.collection('rooms').doc(id).collection('messages').orderBy('timestamp','desc').onSnapshot(snapshot=>(  //ordering messages in desending order by time stamp and retrieving the last message
                setMessages(snapshot.docs.map(doc=>(
                    doc.data()
                ))) //reaching each message and storing it in array messages
            ));
        }
    },[id]); //will run everytime id changes

    const createChat= ()=>{
        const roomName= prompt("Please Enter Name for Chat Room");
        if(roomName && roomName.length>=20){
            return alert('enter a shorter name for the room');
        }
        if(roomName){  //if name exists then creating a new chat room by adding data to database
            db.collection("rooms").add({
                name: roomName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    };

    const deleteChat =(e)=>{  //function to delete a chat room
        e.preventDefault();
        const passwordVerify = prompt('Enter Admin Password to delete Room');
        if(passwordVerify === process.env.REACT_APP_ROOMDELPASS){
            db.collection("rooms").doc(id).delete().then(function() {
                navigate("/");
                // alert("Room successfully deleted!"); 
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

        }else{
            alert('You are not authorised to delete rooms');
        }
    }

    const getRamdomIndexFromArray = (array)=>{
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    window.localStorage.setItem(`chatAvatar${id}`, dp);

    return !addNewChat ? (  //going to return depending upon prop addnewchat present or not
        <Link to={`/rooms/${id}`}>  {/*changing the link on clicking any chat, as it made everychat option a link to that chat*/}
            <div className='sidebarChat'>
                <div className='sidebarHead'>
                    {/* <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`}/> */}
                    <Avatar src={window.localStorage.getItem(`chatAvatar${id}`)} />
                    <div className="sidebarChat__info">
                        <h2>{name}</h2>  {/*using the prop */}
                        <p>{messages[0]?.message.slice(0, 35) + (messages[0]?.message.length > 35 ? "..." : "")}</p> {/*pulling this message from our state which contain all the messages of that chat room, as we order messages by des first message will be last one  */}
                    </div>
                </div>
                <div className="sidebarChat__delete" onClick={deleteChat}><DeleteForeverIcon/></div>
            </div>
        </Link>
    ):
    (
        <div className="sidebarChat addNewChat" onClick={createChat}>
            <h2>Add New Chat</h2>
            <AddBoxIcon fontSize='large'/>
        </div>
    );
};

export default SidebarChat;
