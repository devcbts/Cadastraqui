import { useRecoilState, useRecoilValue } from 'recoil'
import Logo from '../../Assets/images/logo_primary.png'
import headerAtom from './atoms/header-atom'
import HamburgHeader from './variants/HamburgHeader'
import UserHeader from './variants/UserHeader'
import useAuth from 'hooks/useAuth'
import { Fragment, memo, useEffect, useMemo } from 'react'
import useLocalStorage from 'hooks/useLocalStorage'
import CandidateSidebar from 'Components/Candidate/Sidebar'
import styles from './styles.module.scss'
import SocialAssistantSidebar from 'Components/SocialAssistant/Sidebar'
import EntitySidebar from 'Components/Entity/Sidebar'
import AdminSidebar from 'Components/Admin/Sidebar'
const HeaderWrapper = ({ children }) => {
    const [header, setHeader] = useRecoilState(headerAtom)
    const { sidebar } = header
    const { auth, login, logout } = useAuth()
    const Sidebar = useMemo(() => {
        switch (auth?.role) {
            case "CANDIDATE":
            case "RESPONSIBLE":
                return CandidateSidebar
            case "ASSISTANT":
                return SocialAssistantSidebar
            case "ENTITY":
                return EntitySidebar
            case "ADMIN":
                return AdminSidebar
            default:
                return Fragment
        }
    }, [auth])
    return (
        <div style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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

export default memo(HeaderWrapper)