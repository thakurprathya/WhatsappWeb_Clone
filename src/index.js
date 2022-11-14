import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StateProvider } from './context/StateProvider';  //using context api, it is almost similar to redux, but implementation is much easier
import reducer, { initialState } from './context/reducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*wrapping the app in stateprovider, its the data layer which surrounds the app, we can push info to it, we can pull it from any component */}
    <StateProvider initialState={initialState} reducer={reducer}>  
      <App />
    </StateProvider>
  </React.StrictMode>
);
