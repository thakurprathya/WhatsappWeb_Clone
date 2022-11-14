import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import Avatar from '@mui/material/Avatar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import db from '../firebase';
import { Link } from 'react-router-dom';

//passing a prop addNewChat, we're going to render this component conditionally for prop addNewChat so that it contains some of the styling
const SidebarChat = ({id, name, addNewChat}) => {  
    const [seed, setSeed]= useState('');  //creating an empty state to be used for generating random avatar from the site
    const [messages, setMessages]= useState(''); //creating an empty state to store all the messages from the chat room
   
    useEffect(()=>{
        setSeed(Math.floor(Math.random() * 5000));  //generating a random no.
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
        if(roomName){  //if name exists then creating a new chat room by adding data to database
            db.collection("rooms").add({
                name: roomName
            });
        }
    };

    return !addNewChat ? (  //going to return depending upon prop addnewchat present or not
        <Link to={`/rooms/${id}`}>  {/*changing the link on clicking any chat, as it made everychat option a link to that chat*/}
            <div className='sidebarChat'>
                <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>  {/*using the prop */}
                    <p>{messages[0]?.message}</p> {/*pulling this message from our state which contain all the messages of that chat room, as we order messages by des first message will be last one  */}
                </div>
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
