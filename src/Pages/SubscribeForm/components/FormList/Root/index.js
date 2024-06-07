import Loader from "Components/Loader";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import styles from './styles.module.scss'
export default function Root({
    isLoading,
    title,
    text,
    children
}) {
    return (
        <div className={styles.container}>
            <Loader loading={isLoading} />
            <div className={commonStyles.title}>
                <h1>{title}</h1>
                {text && <p>{text}</p>}
            </div>
            {children}
        </div>
    )
}