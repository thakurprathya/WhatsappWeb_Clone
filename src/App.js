import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useStateValue } from './context/StateProvider';
import { useEffect, useState } from 'react';

function App() {
    const [{user}]= useStateValue(); //pulling the user from datalayer, this method is not a persistent method(if site refresh user needs to login again) reason in usedTech

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        function handleResize() { setScreenWidth(window.innerWidth); }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app">
            {!user ?  //if user not exists/null then showing login page else showing component screen
                <Login />
            :
                (<div className="app__body">
                    <Router>
                        <Routes>
                            <Route path='/' element={[<Sidebar screenWidth={screenWidth} display='flex'/>, <div></div>]} />  {/*passing an array of objects to render multiple components */}
                            <Route path='/rooms' element={[<Sidebar screenWidth={screenWidth} display='none'/>]} />
                            <Route exact path='/rooms/:roomId' element={[<Sidebar screenWidth={screenWidth} display='none'/>, <Chat screenWidth={screenWidth}/>]} /> {/* :roomId is wildcard after /rooms/, wildcard could be anything will be used to fetch chats of particular room*/}
                        </Routes>
                    </Router>
                </div>)
            }
            
        </div>
    );
}

export default App;
