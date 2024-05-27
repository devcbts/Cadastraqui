import Loader from "Components/Loader"
import useLocalStorage from "hooks/useLocalStorage"
import { jwtDecode } from "jwt-decode"
import { createContext, useEffect, useState } from "react"
import authService from "services/authentication/authService"
import { NotificationService } from "services/notification"
import userService from "services/user/userService"
export const AuthContext = createContext(null)
export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null)
    const { get, set, remove } = useLocalStorage()
    const [isLoading, setIsLoading] = useState(false)
    const login = async ({ email, password }) => {
        try {
            setIsLoading(true)
            const { token, user_role, refreshToken } = await authService.login({ email, password })
            console.log(token, user_role, refreshToken)
            set('token', token)
            set('refresh_token', refreshToken)
            const decodedToken = jwtDecode(token)
            setAuth(decodedToken)
            const profilePicUrl = await userService.getProfilePicture()
            set('profilepic', profilePicUrl)
        } catch (err) {
            NotificationService.error({ text: err.response?.data?.message })
        }
        setIsLoading(false)
    }
    const logout = async () => {
        try {
            remove('token')
            setAuth(null)
        } catch (err) { }
    }
    useEffect(() => {
        const token = get('token')
        if (token) {
            setAuth(jwtDecode(token))
        }
    }, [])
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            <Loader loading={isLoading} />
            {children}
        </AuthContext.Provider>
    )
}