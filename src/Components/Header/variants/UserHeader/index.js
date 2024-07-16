import styles from './styles.module.scss'
import Logo from '../../../../Assets/images/logo_primary.png'
import { ReactComponent as User } from '../../../../Assets/icons/user.svg'
import useLocalStorage from 'hooks/useLocalStorage'
import { useNavigate } from 'react-router'
export default function UserHeader() {
    const { get: profilePicture } = useLocalStorage("profilepic")
    const navigate = useNavigate()
    return (
        <header className={styles.container}>
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div className={styles.picture} onClick={() => navigate('profile')}>
                {
                    profilePicture
                        ? <img className={styles.profilepicture} src={profilePicture} />
                        : <User className={styles.placeholder} />
                }


            </div>
        </header>
    )
}