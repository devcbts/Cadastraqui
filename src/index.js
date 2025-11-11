import { Font } from '@react-pdf/renderer';
import { Analytics } from '@vercel/analytics/react';
import 'Assets/theme/global.module.scss';
import Layout from 'Components/Layout';
import AuthProvider from 'context/AuthProvider';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot } from 'recoil';
import PoppinsBold from './Assets/fonts/poppins/Poppins-Bold.ttf';
import PoppinsExtraBold from './Assets/fonts/poppins/Poppins-ExtraBold.ttf';
import PoppinsLight from './Assets/fonts/poppins/Poppins-Light.ttf';
import PoppinsNormal from './Assets/fonts/poppins/Poppins-Regular.ttf';
import PoppinsSemiBold from './Assets/fonts/poppins/Poppins-SemiBold.ttf';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));
Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: PoppinsNormal,
      fontWeight: "normal",
    },
    {
      src: PoppinsBold,
      fontWeight: "bold",
    },
    {
      src: PoppinsExtraBold,
      fontWeight: "heavy",
    },
    {
      src: PoppinsSemiBold,
      fontWeight: "semibold",
    },
    {
      src: PoppinsLight,
      fontWeight: "light",
    },
  ]
})
root.render(
  <BrowserRouter basename='/portal' >
    <AuthProvider>
      <RecoilRoot>
        <Layout />
        <Analytics />
      </RecoilRoot>
    </AuthProvider>
    <ToastContainer position='bottom-right' />
  </BrowserRouter>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
