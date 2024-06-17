import Profile from "Pages/Profile";
import { NotificationService } from "services/notification";
import FormView from "./components/FormView";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function SocialAssistantProfile() {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await socialAssistantService.getAssistant()
                console.log(information)
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