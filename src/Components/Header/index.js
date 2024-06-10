import { useRecoilState, useRecoilValue } from 'recoil'
import Logo from '../../Assets/images/logo_primary.png'
import headerAtom from './atoms/header-atom'
import HamburgHeader from './variants/HamburgHeader'
import UserHeader from './variants/UserHeader'
import useAuth from 'hooks/useAuth'
import { Fragment, useEffect, useMemo } from 'react'
import useLocalStorage from 'hooks/useLocalStorage'
import CandidateSidebar from 'Components/Candidate/Sidebar'
import styles from './styles.module.scss'
import SocialAssistantSidebar from 'Components/SocialAssistant/Sidebar'
export default function HeaderWrapper({ children }) {
    const [header, setHeader] = useRecoilState(headerAtom)
    const { sidebar } = header
    const { auth, login, logout } = useAuth()
    const { set } = useLocalStorage()
    const Sidebar = useMemo(() => {
        switch (auth?.role) {
            case "CANDIDATE":
                return CandidateSidebar
            case "ASSISTANT":
                return SocialAssistantSidebar
            default:
                return Fragment
        }
    }, [auth])
    return (
        <div style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span>{JSON.stringify(auth)}</span>
            <button onClick={async () => await login({ email: 'a@b.com', password: '123456' })} />
            <button onClick={async () => set('profilepic', null)} />

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