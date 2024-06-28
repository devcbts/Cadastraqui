import Profile from "Pages/Profile";
import FormView from "./components/FormView";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";

export default function EntityProfile() {
    const [data, setData] = useState(null)
    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        let url = null
        if (file) {

            try {
                const formData = new FormData();
                formData.append("file", file);
                url = await entityService.updateProfilePicture(formData)
                NotificationService.success({ text: 'Foto de perfil alterada' })
            } catch (err) {
                NotificationService.error({ text: 'Erro ao alterar foto de perfil' })
            }
            return url
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await entityService.getEntityInfo()
                setData(information)
            } catch (err) { }
        }
        fetchData()
    }, [])

    return (
        <>
            <Profile
                onPictureChange={handlePictureChange}
                dataForm={(onEdit) => <FormView data={data} onEdit={onEdit} />}
            />
        </>
    )
}