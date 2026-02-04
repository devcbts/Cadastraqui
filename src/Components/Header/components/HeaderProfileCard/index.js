import { useNavigate } from 'react-router'
import useAuth from 'hooks/useAuth'
import useLocalStorage from 'hooks/useLocalStorage'
import ROLES from 'utils/enums/role-types'
import { ReactComponent as User } from 'Assets/icons/user.svg'
import styles from './styles.module.scss'

export default function HeaderProfileCard({ variant = 'default' }) {
    const { auth } = useAuth()
    const { get: profilePicture } = useLocalStorage("profilepic")
    const navigate = useNavigate()
    const profileLabel = ROLES[auth?.role] ?? 'Perfil'

    return (
        <div
            className={`${styles.card} ${variant === 'dark' ? styles.cardDark : ''}`}
            onClick={() => navigate('profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.code === 'Enter' && navigate('profile')}
        >
            <div className={styles.avatar}>
                {profilePicture
                    ? <img className={styles.profilepicture} src={profilePicture} alt="" />
                    : <User className={styles.placeholder} />}
            </div>
            <span className={styles.label}>{profileLabel}</span>
        </div>
    )
}
