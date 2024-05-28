import useLocalStorage from "hooks/useLocalStorage"
import { ReactComponent as Pencil } from '../../Assets/icons/pencil.svg'
import styles from './styles.module.scss'
import { useRef, useState } from "react"
import FormPassword from "./components/FormPassword"
import FormView from "./components/FormView"
import LGPD from "Components/LGPD"
export default function Profile({ data, onPictureChange }) {
    const { get } = useLocalStorage()
    const profilePic = get('profilepic')
    const inputRef = useRef(null)

    const [editMode, setEditMode] = useState(false)
    const handleEdit = () => {
        setEditMode(!editMode)
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titlewrapper}>
                    <div>
                        <img src={profilePic} />
                        <input type="file" accept="image/*" ref={inputRef} onChange={onPictureChange} hidden />
                        <Pencil className={styles.edit} onClick={() => inputRef.current.click()} />
                    </div>
                    <h1>Dados Pessoais</h1>
                </div>
                <LGPD />
            </div>
            <div className={styles.content}>
                {!editMode
                    ? <FormView data={data} onEdit={handleEdit} />
                    : <FormPassword onCancel={handleEdit} />
                }

            </div>
        </div>
    )
}