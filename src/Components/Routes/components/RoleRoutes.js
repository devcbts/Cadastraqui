import useAuth from "hooks/useAuth"
import { useMemo } from "react"

export default function RoleRoutes({ role, children }) {
    const { auth } = useAuth()
    console.log('aiuth', auth)
    // verify if current role (auth) is the same as the role based route requested
    const sameRole = useMemo(() => {
        if (auth === undefined) {
            return false
        }
        // console.log(role, auth, role === auth?.role, '')
        // in case it's a string or 'null'
        if (typeof role === "string" || role === null) {
            return auth?.role?.toLowerCase() === role?.toLowerCase()
        } else {
            return role?.map((e) => e.toLowerCase()).includes(auth?.role?.toLowerCase())
        }
    }, [auth])
    if (!sameRole) return null
    return (
        children
    )
}