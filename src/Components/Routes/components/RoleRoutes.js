import useAuth from "hooks/useAuth"
import { memo, useMemo } from "react"

const RoleRoutes = ({ role, children }) => {
    const { auth } = useAuth()

    // verify if current role (auth) is the same as the role based route requested
    const sameRole = useMemo(() => {
        if (auth === undefined) {
            return false
        }
        // 
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

export default memo(RoleRoutes)