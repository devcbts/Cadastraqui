import { useRecoilValue } from 'recoil'
import styles from './styles.module.scss'
import headerAtom from 'Components/Header/atoms/header-atom'
export default function SidebarRoot({ children }) {
    const { sidebar } = useRecoilValue(headerAtom)
    return (
        <div className={[styles.container, !sidebar && styles.hide].join(' ')}>
            {children}
        </div>
    )
}