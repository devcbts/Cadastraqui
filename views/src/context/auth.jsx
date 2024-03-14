import { createContext, useContext } from "react";
import { api } from "../services/axios";
import { useState } from "react";
import Cookies from 'js-cookie'
import { handleAuthError } from "../ErrorHandling/handleError";


export const AuthContext = createContext({})

function AuthProvider({children}) {
  const [data,setData] = useState({})
  
  async function SignIn({email, password}) {
    try {
      const response = await api.post('/session', {email, password})
      const { token, user_role, refreshToken } = response.data

      setData({user_role})

      api.defaults.headers.authorization = `Bearer ${token}`
      localStorage.setItem('token', token);
      localStorage.setItem('role', user_role);
      
      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        sameSite: true,
        path: '/',
      })

      return user_role
    } catch(err) {
      if(err.code === "ERR_NETWORK") {
        alert('Erro de conexão.')
      }
      else if(err ) {
        handleAuthError(err)
      } else {
        alert('Não foi possível entrar')
      }
    }
  }


  return(
    <AuthContext.Provider value={{ SignIn, user: data }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export {AuthProvider, useAuth}