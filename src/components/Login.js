import React from 'react';
import './Login.css'
import Button from '@mui/material/Button';
import { auth, provider } from '../firebase';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const Login = () => {
    //pulling the data from data layer (context api), calling our created hook, we can destructure the data by entering the particular value into curly braces but pulling whole layer
    // eslint-disable-next-line
    const [{}, dispatch]= useStateValue();  //dispatch will used to update the data layer
    const signIn =()=>{  //creating a singin function with firebase (google authentication)
        auth.signInWithPopup(provider)  //this is the basic main command for authentication
        .then((result) => {
            // console.log(result.user);
            dispatch({  //this  command will dispatch the user into data layer
                type: actionTypes.SET_USER,  //setting the type to exact same name as we created in reducer.js
                user: result.user,  //setting user= data recieved from google authentication
            });
            dispatch({
                type: actionTypes.SET_SESSION,
                uid: result.user.uid,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            });
        })
        .catch((err) => alert(err.message));
    };

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/225px-WhatsApp.svg.png"
                alt="whatsapp" />
                <div className="login__text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button onClick={signIn}>Sign In with Google</Button>
            </div>
        </div>
    );
};

export default Login;
