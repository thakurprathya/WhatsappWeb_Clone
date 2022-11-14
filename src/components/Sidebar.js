import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import Avatar from '@mui/material/Avatar';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';  //its a different icon layer in which we wraps icon for motion
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import db from '../firebase'; //importing database from local firebase
import { useStateValue } from '../context/StateProvider';

function Sidebar() {
    const [rooms, setRooms]= useState([]); //creating an state initialized with empty array to store all the room info fetched from database
    const [{user}, dispatch]= useStateValue(); //pulling the user from datalayer, will use it to setup avatar
    useEffect(()=>{ //onsnapshot on rooms means taking pic of that collection & also is linked with changes to that picture, on making changes another snapshot is taken
        const connection= db.collection("rooms").onSnapshot(snapshot=>(
            setRooms(snapshot.docs.map(doc =>(  //docs refers to list of elements in the database, and mapping to each element and returning an object
                {
                    id: doc.id,
                    data: doc.data(),
                }
            )))
        ));
        return()=>{
            connection();  //it is a good practice as we wrap data fetching into a variable so that whenever require we can easily detach it
        }
    },[]); //it will run onlyonce everytime sidebar comp is loaded

    return (
        <div className='sidebar'>
            <div className="sidebar__header">
                <Avatar src={user?.photoURL}/> {/*if user defined fetching its photo from google */}
                <div className="sidebar__headerRight">
                    <IconButton><DonutLargeIcon /></IconButton>
                    <IconButton><ChatIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder='Search or Start new chat' />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat/>  {/*will render add new chat box instead of chatbox*/}
                {rooms.map((room)=>( 
                    <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                ))}  {/*will render all the chat boxes, as for every room we're calling the component*/}
            </div>
        </div>
    );
};

export default Sidebar;