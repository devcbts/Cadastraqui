import styles from './styles.module.scss'
import Logo from '../../../../Assets/images/logo_primary.png'
import { ReactComponent as User } from '../../../../Assets/icons/user.svg'
import useLocalStorage from 'hooks/useLocalStorage'
export default function UserHeader() {
    const { get: profilePicture } = useLocalStorage("profilepic")
    return (
        <header className={styles.container}>
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div>
                {
                    profilePicture
                        ? <img className={styles.profilepicture} src={profilePicture} />
                        : <User className={styles.placeholder} />
                }


            </div>
        </header>
    )
}