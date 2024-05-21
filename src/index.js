import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SubscribeForm from './Pages/SubscribeForm';
import BasicInformation from './Pages/SubscribeForm/components/Form_BasicInformation';
import Loader from 'Components/Loader';
import Header from 'Components/Header';
import Sidebar from 'Components/Sidebar';
import { ReactComponent as Arrow } from './Assets/icons/arrow.svg'
import UserHeader from 'Components/Header/variants/UserHeader';
import HamburgHeader from 'Components/Header/variants/HamburgHeader';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <HamburgHeader />
    <SubscribeForm />
  </>

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
