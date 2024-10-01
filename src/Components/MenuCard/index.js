import styles from './styles.module.scss'
export default function MenuCard({
    onClick,
    Icon,
    title,
    description,
    style
}) {
    return (
        <div style={style} className={styles.container}
            onClick={onClick}
        >
            <div className={styles.content}>
                {Icon && <Icon height={"40%"} width={"40%"} />}
                <h3 style={{ textAlign: 'center' }}>{title}</h3>
            </div>
            {!!description &&
                <div className={styles.description}>
                    {description}
                </div>
            }
        </div>
    )
}