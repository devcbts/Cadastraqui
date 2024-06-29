import { Navigate, useParams } from "react-router";

export default function RedirectWithParams({ path }) {
    const params = useParams()
    return (
        <Navigate to={path} state={params} />
    )
}