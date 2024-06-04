import { useNavigate } from "react-router"
import { ReactComponent as Arrow } from '../../Assets/icons/arrow.svg'
import styles from './styles.module.scss'
export default function BackPageTitle({ title, path, onClick }) {

    const navigate = useNavigate()
    const handleClick = () => {
        if (path) {
            navigate(path)
        } else {
            onClick()
        }
    }

    return (
        <div className={styles.title}>
            <Arrow height={15} style={{ transform: "rotateZ(180deg)" }} onClick={handleClick} />
            <h1>{title}</h1>
        </div>
    )
}