import Loader from "Components/Loader"
import useLocalStorage from "hooks/useLocalStorage"
import { jwtDecode } from "jwt-decode"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import authService from "services/authentication/authService"
import { NotificationService } from "services/notification"
import userService from "services/user/userService"
export const AuthContext = createContext(null)
export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null)
    const navigate = useNavigate()
    const { get: getToken, set: setToken, remove } = useLocalStorage("token")
    const { set: setRefreshToken } = useLocalStorage("refresh_token")
    const { set: setPicture } = useLocalStorage("profilepic")
    const [isLoading, setIsLoading] = useState(false)
    const login = async ({ email, password }) => {
        try {
            setIsLoading(true)
            const { token, user_role, refreshToken } = await authService.login({ email, password })
            setToken(token)
            setRefreshToken(refreshToken)
            const decodedToken = jwtDecode(token)
            setAuth(decodedToken)
            userService.getProfilePicture({ role: user_role })
                .then((profilePic) => setPicture(profilePic))
                .catch(() => { })

            return true
        } catch (err) {
            NotificationService.error({ text: err.response?.data?.message })
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const logout = async () => {
        try {
            remove()
            navigate('/')
            setAuth(null)
        } catch (err) { }
    }
    useEffect(() => {
        console.log('renderizou')
        console.log(getToken)
        if (getToken) {
            setAuth(jwtDecode(getToken))
        }
    }, [])
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            <Loader loading={isLoading} />
            {children}
        </AuthContext.Provider>
    )
}