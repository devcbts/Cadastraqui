import useLocalStorage from "hooks/useLocalStorage"
import styles from './styles.module.scss'
import { useMemo, useRef, useState } from "react"
import FormPassword from "./components/FormPassword"
import LGPD from "Components/LGPD"
import ProfilePhoto from "./components/ProfilePhoto"
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