import Profile from "Pages/Profile";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import FormView from "./components/FormView";

export default function SocialAssistantProfile() {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await socialAssistantService.getAssistant()
                //console.log(information)
                setData(information)
            } catch (err) {
            }
        }
        fetchData()
    }, [])
    const handleProfilePicture = () => { }
    return (
        <Profile onPictureChange={handleProfilePicture} dataForm={(onEdit) => <FormView data={data} onEdit={onEdit} />} />
    )
}