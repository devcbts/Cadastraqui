import { useRef } from 'react'
import styles from './styles.module.scss'
import { ReactComponent as Pencil } from 'Assets/icons/pencil.svg'

export default function ProfilePhoto({ onChange, pictureUrl, title = 'Dados Pessoais', children }) {
    const inputRef = useRef(null)

    return (
        <div className={styles.header}>

            <div className={styles.titlewrapper}>
                <div onClick={() => inputRef.current.click()}>
                    <img src={pictureUrl} />
                    <input type="file" accept="image/*" ref={inputRef} onChange={onChange} hidden />
                    <Pencil className={styles.edit} />
                </div>
                <h1>{title}</h1>
            </div>
            <div className={styles.badge}>
                {children}
            </div>
        </div>
    )
}