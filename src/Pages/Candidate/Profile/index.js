import Loader from "Components/Loader";
import Profile from "Pages/Profile";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import FormView from "./components/FormView";

export default function ProfileCandidate() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getBasicInfo()
                setData(information)
                console.log(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const handlePictureChange = async (e) => {
        const { files } = e.target
        const img = files[0]
        const formData = new FormData()
        formData.append('file', img)
        let url = null;
        try {
            url = await candidateService.uploadProfilePicture(formData)
            NotificationService.success({ text: 'Foto de perfil alterada' })
        } catch (err) {
            NotificationService.success({ text: 'Erro ao alterar foto de perfil' })
        }
        return url
    }
    return (
        <>
            <Loader loading={isLoading} />
            <Profile
                dataForm={(onEdit) => <FormView data={data} onEdit={onEdit} />}
                onPictureChange={handlePictureChange}
            />
        </>
    )
}