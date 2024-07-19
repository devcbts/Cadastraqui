import { ReactComponent as Pencil } from 'Assets/icons/pencil.svg'
import { ReactComponent as User } from 'Assets/icons/user.svg'
import useLocalStorage from 'hooks/useLocalStorage'
import { useRef, useState } from 'react'
import styles from './styles.module.scss'

export default function ProfilePhoto({ onChange, pictureUrl, title = 'Dados Pessoais', children }) {
    const inputRef = useRef(null)
    const [show, setShow] = useState(false)
    const handleHover = () => {
        setShow((prev) => !prev)
    }
    const { set } = useLocalStorage("profilepic")
    const handleChange = async (e) => {
        const url = await onChange(e)
        if (url) {
            set(url)
        }
    }
    return (
        <div className={styles.header}>

            <div className={styles.titlewrapper}>
                <div style={{ cursor: 'pointer', position: 'relative', opacity: show && .8 }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleHover}
                    onClick={() => inputRef.current.click()}>
                    {pictureUrl
                        ? <img src={pictureUrl} alt='foto de Perfil' placeholder='Foto de Perfil' />
                        : <User width={100} height={100} />
                    }
                    <input type="file" accept="image/*" ref={inputRef} onChange={handleChange} hidden />
                    {show && <Pencil className={styles.edit} />}
                </div>
                <h1>{title}</h1>
            </div>
            <div className={styles.badge}>
                {children}
            </div>
        </div>
    )
}