export const initialState = {  //this is the initial state (how the data looks initially)
    // user: "null", //this is a simple trick which help in prevent reloginin on reloading site good for production but comment it
    user: null,
    uid: null,
    togglerState: 1,
    photoURL: "",
};
  
export const actionTypes = {  //this command helps in pushing data into data layer
    SET_USER: "SET_USER",
    SET_SESSION: "SET_SESSION",
    SET_TOGGLER: "SET_TOGGLER",
};
  
const reducer = (state, action) => {  //when action get dispatched into data layer we listen to it in switch
    // console.log(action);
    switch (action.type) {
      case actionTypes.SET_USER:  //if dispatched setusers this block will run changing the data layer
        return {
          ...state,  //keeping everything in that state
          user: action.user,  //changing the user to dispatched user
        };
      case actionTypes.SET_SESSION:
        localStorage.setItem("uid", action.uid);
        localStorage.setItem("displayName", action.displayName);
        localStorage.setItem("photoURL", action.photoURL);
        console.log("session added to storage");
        return {
          ...state,
          uid: action.uid,
          displayName: action.displayName,
          photoURL: action.photoURL,
        };
      case actionTypes.SET_TOGGLER:
        return {
          ...state,
          togglerState: action.togglerState,
        };
  
      default:  //if dispatched data didn't match default runs
        return state;
    }
};
  
export default reducer;