import useAuth from "hooks/useAuth"

export default function RoleRoutes({ role = "", children }) {
    const { auth } = useAuth()
    if (auth?.role?.toLowerCase() !== role.toLowerCase()) return null
    return (
        children
    )
}