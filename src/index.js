import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SubscribeForm from './Pages/SubscribeForm';
import BasicInformation from './Pages/SubscribeForm/components/Form_BasicInformation';
import Loader from 'Components/Loader';
import HeaderWrapper from 'Components/Header';
import Sidebar from 'Components/Sidebar';
import { ReactComponent as Arrow } from './Assets/icons/arrow.svg'
import UserHeader from 'Components/Header/variants/UserHeader';
import HamburgHeader from 'Components/Header/variants/HamburgHeader';
import { ReactComponent as Hamburger } from './Assets/icons/hamburger.svg'
import AuthProvider from 'context/AuthProvider';
import { RecoilRoot } from 'recoil';
import AppRoutes from 'Components/Routes';
import { BrowserRouter } from 'react-router-dom';
import HabitationDeclarationPDF from 'Pages/SubscribeForm/components/Form_Habitation/components/HabitationDeclarationPDF';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <RecoilRoot>
        <HeaderWrapper >
          <AppRoutes />
        </HeaderWrapper>
      </RecoilRoot>
    </AuthProvider>
  </BrowserRouter>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
