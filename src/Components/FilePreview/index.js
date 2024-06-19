import { Link } from "react-router-dom";
import styles from './styles.module.scss'
export default function FilePreview({
    file,
    url,
    text
}) {
    if (!file && !url) return null
    return (
        <div className={styles.container}>
            {file
                ? <Link to={URL.createObjectURL(file)} target="_blank">{text}</Link>
                : <Link to={url} target="_blank">{text}</Link>}
        </div>
    )
}