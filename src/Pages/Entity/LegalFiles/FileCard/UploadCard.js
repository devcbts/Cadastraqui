import FileCard from ".";
import styles from './styles.module.scss';
export default function UploadCard({
    onClick,
    url,
    label
}) {
    return <div onClick={onClick} className={styles.uploadCard}>
        <FileCard label={label} url={url} />
    </div>
}