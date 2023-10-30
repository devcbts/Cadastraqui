import { createContext, useContext } from "react";
import { api } from "../services/axios";
import { useState } from "react";


export const AuthContext = createContext({})

function AuthProvider({children}) {
  const [data,setData] = useState({})
  
  async function SignIn({email, password}) {
    try {
      const response = await api.post('/session', {email, password})
      const { token, user_id, user_role } = response.data

      setData({user_id, user_role})

      //api.defaults.headers.authorization = `Bearer ${token}`

      localStorage.setItem('token', token);
      localStorage.setItem('role', user_role);
      return user_role
    } catch(err) {
      if(err.response.status === 500) {
        console.log(err.response)
        alert('Não foi possível entrar')
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