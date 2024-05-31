import { useRecoilValue } from 'recoil'
import Logo from '../../Assets/images/logo_primary.png'
import headerAtom from './atoms/header-atom'
import HamburgHeader from './variants/HamburgHeader'
import UserHeader from './variants/UserHeader'
import useAuth from 'hooks/useAuth'
import { Fragment } from 'react'
import useLocalStorage from 'hooks/useLocalStorage'
import CandidateSidebar from 'Components/Candidate/Sidebar'
import styles from './styles.module.scss'
export default function HeaderWrapper({ children }) {
    const { sidebar } = useRecoilValue(headerAtom)
    const { auth, login, logout } = useAuth()
    const { set } = useLocalStorage()
    const Sidebar = auth?.role?.toLowerCase() === 'candidate' ? CandidateSidebar : Fragment
    return (
        <div style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span>{JSON.stringify(auth)}</span>
            <button onClick={async () => await login({ email: 'gab@teste.com', password: '123456' })} />
            <button onClick={logout} />

            {sidebar ? (
                <>
                    <UserHeader />
                    <div className={styles.inlinecontent}>
                        <Sidebar />
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </>
            )
                :
                (
                    <>
                        <HamburgHeader >
                            <Sidebar />
                        </HamburgHeader>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </>
                )
            }
        </div >

    )
}