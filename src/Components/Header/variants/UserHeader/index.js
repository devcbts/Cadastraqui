import styles from './styles.module.scss'
import Logo from 'Assets/images/logo_primary.png'
import { ReactComponent as User } from 'Assets/icons/user.svg'
import useLocalStorage from 'hooks/useLocalStorage'
import { useNavigate } from 'react-router'
import Tutorial from 'Components/Tutorial'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
export default function UserHeader() {
    const { get: profilePicture } = useLocalStorage("profilepic")
    const navigate = useNavigate()
    const [hover, setHover] = useState(false)
    const toggleHover = () => setHover(prev => !prev)
    return (
        <header className={styles.container}>
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Tutorial />
                <div className={styles.picture} onClick={() => navigate('profile')} >
                    {
                        profilePicture
                            ? <img onMouseEnter={toggleHover} onMouseLeave={toggleHover} className={styles.profilepicture} src={profilePicture} />
                            : <User onMouseEnter={toggleHover} onMouseLeave={toggleHover} className={styles.placeholder} />
                    }
                    <AnimatePresence>
                        {hover && <motion.div
                            className={styles.title}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            Perfil
                        </motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}