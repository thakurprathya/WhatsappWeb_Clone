import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from './context/StateProvider';

function App() {
    const [{user}, dispatch]= useStateValue(); //pulling the user from datalayer, this method is not a persistent method(if site refresh user needs to login again) reason in usedTech
    return (
        <div className="app">
            {!user ?  //if user not exists/null then showing login page else showing component screen
                <Login />
            :
                (<div className="app__body">
                    <Router>
                        <Routes>
                            <Route path='/' element={[<Sidebar/>, <h1>Landing Page</h1>]} />  {/*passing an array of objects to render multiple components */}
                            <Route path='/rooms' element={[<Sidebar/>]} />
                            <Route exact path='/rooms/:roomId' element={[<Sidebar/>, <Chat/>]} /> {/* :roomId is wildcard after /rooms/, wildcard could be anything will be used to fetch chats of particular room*/}
                        </Routes>
                    </Router>
                </div>)
            }
            
        </div>
    );
}

export default App;
