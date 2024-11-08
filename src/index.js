import AppRoutes from 'Components/Routes';
import AuthProvider from 'context/AuthProvider';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';
import 'Assets/theme/global.module.scss'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from 'Components/Header';
import Layout from 'Components/Layout';
import { Font } from '@react-pdf/renderer';
import PoppinsNormal from './Assets/fonts/poppins/Poppins-Regular.ttf'
import PoppinsBold from './Assets/fonts/poppins/Poppins-Bold.ttf'
import PoppinsExtraBold from './Assets/fonts/poppins/Poppins-ExtraBold.ttf'
import PoppinsSemiBold from './Assets/fonts/poppins/Poppins-SemiBold.ttf'
import PoppinsLight from './Assets/fonts/poppins/Poppins-Light.ttf'
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
  <BrowserRouter>
    <AuthProvider>
      <RecoilRoot>
        <Layout />
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
