import Loader from "Components/Loader";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'

export default function Root({
    isLoading,
    title,
    text,
    children
}) {
    return (
        <>
            <Loader loading={isLoading} />
            <div>
                <h1 className={commonStyles.title}>{title}</h1>
                <p>{text}</p>
            </div>
            {children}
        </>
    )
}