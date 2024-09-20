import UnauthenticatedHeader from 'Components/Header/variants/UnauthenticatedHeader'
import styles from './styles.module.scss'
export default function UnauthenticatedPage({ children }) {
    return (
        <>
            <UnauthenticatedHeader />
            <div className={styles.content}>
                {children}
            </div>
        </>
    )
}