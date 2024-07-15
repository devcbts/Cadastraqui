import Profile from "Pages/Profile";
import { useEffect, useState } from "react";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import userServiceInstance from "services/user/userService";
import FormView from "./components/FormView";

export default function SocialAssistantProfile() {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await socialAssistantService.getAssistant()

                setData(information)
            } catch (err) {
            }
        }
        fetchData()
    }, [])
    const handleProfilePicture = async (e) => {
        const file = e.target.files?.[0]
        let url = null
        if (!file) { return }
        try {
            const formData = new FormData()
            formData.append('file', file)
            url = await userServiceInstance.uploadProfilePicture(formData)
            NotificationService.success({ text: 'Foto alterada' })
        } catch (err) {

            NotificationService.error({ text: 'Erro ao alterar foto de perfil' })
        }
        return url
    }
    return (
        <Profile onPictureChange={handleProfilePicture} dataForm={(onEdit) => <FormView data={data} onEdit={onEdit} />} />
    )
}