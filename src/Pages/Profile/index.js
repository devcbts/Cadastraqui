import LGPD from "Components/LGPD"
import useLocalStorage from "hooks/useLocalStorage"
import { useState } from "react"
import FormPassword from "./components/FormPassword"
import ProfilePhoto from "./components/ProfilePhoto"
import styles from './styles.module.scss'
export default function Profile({ onPictureChange, dataForm }) {
    const { get: profilePic } = useLocalStorage("profilepic")
    const [editMode, setEditMode] = useState(false)
    const handleEdit = () => {
        setEditMode(!editMode)
    }
    return (
        <div className={styles.container}>
            <ProfilePhoto onChange={onPictureChange} pictureUrl={profilePic} >
                <LGPD />
            </ProfilePhoto>
            <div className={styles.content}>
                {!editMode
                    ? dataForm(handleEdit)
                    : <FormPassword onCancel={handleEdit} />
                }

            </div>
        </div>
    )
}