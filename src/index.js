import AppRoutes from 'Components/Routes';
import AuthProvider from 'context/AuthProvider';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';
import 'Assets/theme/global.module.scss'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <RecoilRoot>
        <AppRoutes />
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
