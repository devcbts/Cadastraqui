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
    const props = !!onChange
        ? {
            onMouseEnter: handleHover,
            onMouseLeave: handleHover
        }
        : {}
    return (
        <div className={styles.header}>

            <div className={styles.titlewrapper}>
                <div
                    style={{ cursor: 'pointer', position: 'relative', }}
                    {...props}
                    onClick={() => onChange ? inputRef.current.click() : null}>
                    <div style={{ opacity: show && .4, }}>
                        {pictureUrl
                            ? <img src={pictureUrl} alt='foto de Perfil' placeholder='Foto de Perfil' />
                            : <User width={100} height={100} />
                        }
                    </div>
                    <input type="file" accept="image/*" ref={inputRef} onChange={handleChange} hidden />
                    {show && <div className={styles.edit}>
                        <Pencil pointerEvents={'none'} />
                        <h4>Alterar</h4>
                    </div>}
                </div>
                <h1>{title}</h1>
            </div>
            <div className={styles.badge}>
                {children}
            </div>
        </div>
    )
}