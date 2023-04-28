import React, {useState, useEffect} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './Chat.css';
import { Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import IconButton from '@mui/material/IconButton';  //its a different icon layer in which we wraps icon for motion
import { InsertEmoticon } from '@mui/icons-material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import db from '../firebase';
import { useStateValue } from '../context/StateProvider';

import firebase from 'firebase/compat/app';  //importing firebase 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function Chat({screenWidth}) {
    const [input, setInput]= useState('');  //creating an empty state to store the input message in the form input(footer)
    // const [seed, setSeed]= useState('');  //creating an empty state to be used for generating random avatar from the site
    const {roomId}= useParams();  //will going to use this hook to grab the link after /rooms/ to get room id (** name of var should match the wildcard entered in route of path)
    const [roomName, setRoomName]= useState('');  //creating a empty state to contain the info of current chatroom we're in
    const [messages, setMessages]= useState([]); //creating a state to store messages from a chat room, in db we created another collection messages inside chatrooms to store chat.
    const [{user}]= useStateValue(); //pulling the user from datalayer

    useEffect(()=>{
        // setSeed(Math.floor(Math.random() * 5000));  //generating a random no.
        if(roomId){  //if roomId exists
            db.collection('rooms').doc(roomId).onSnapshot(snapshot=>(  //checking the particular doc with that id in collection rooms
                setRoomName(snapshot.data().name)  //updating roomname to name in the database 
            ));
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot=>( //ordering the messages collection by timestamp in asending order and then storing messages in state.
                setMessages(snapshot.docs.map(doc=>(
                    doc.data()
                ))) //reaching each message and storing it in array messages
            ));
        }
    },[roomId]); //will run everytime roomId changes (wildcard changes. link changes)

    const sendMessage= (e)=>{
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({  //inserting a record in collection message
            message: input,  //it will come from input
            name: user.displayName,  //setting name = user.displayName which is coming from google auth
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),  //importing timestamp from firebase server, as it could be different for person in diff region (server time would be same for all)
        })
        setInput("");  //everytime after submiting the button setting input to empty string
    }

    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    useEffect(() => {
        setPathname(location.pathname);
    }, [location]);

    return (
        (screenWidth > 655 || (screenWidth <=655 && pathname === `/rooms/${roomId}`))?
            <div className='chat'>
                <div className="chat__header">
                    {/* <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} /> */}
                    <Avatar src={window.localStorage.getItem(`chatAvatar${roomId}`)} />
                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                        <p>  {/*will be retrieving it from the last chat of that room */}
                            {new Date( messages[messages.length-1]?.timestamp?.toDate() ).toString().slice(0, 33) } {/*use toUTC string to get standard time worldwide */}
                        </p>
                    </div>
                    <div className="chat__headerRight">
                        <IconButton><SearchOutlinedIcon /></IconButton>
                        <IconButton><AttachFileIcon /></IconButton>
                        <IconButton><MoreVertIcon /></IconButton>
                    </div>
                </div>
                <div className="chat__body">
                    {messages.map(message=>(  //traversing each message
                        <p className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
        {/*if message name = google name then will show green layout send by us layout else white layout, but this will raise error for persons with same name so it would be better if linked this command with ids rather than just names */}
                            <span className="chat__name">{message.name}</span>
                            {message.message}
                            <span className="chat__timestamp">
                                {new Date(message.timestamp?.toDate()).toString().slice(0, 25)} {/*converting timestamp to our required format */}
                            </span>
                        </p>
                    ))}
                </div>
                <div className="chat__footer">
                    <IconButton><InsertEmoticon /></IconButton>
                    <form >
                        <input type="text" placeholder='Type a Message' value={input} onChange={e=>setInput(e.target.value)}/>  {/*updating the state everytime input changes */}
                        <button type='submit' onClick={sendMessage}><SendIcon/></button> {/*sendmessage will be triggerd on enter */}
                    </form>
                    <IconButton><MicIcon /></IconButton>
                </div>
            </div>
        :
            <></>
    );
};

export default Chat;
