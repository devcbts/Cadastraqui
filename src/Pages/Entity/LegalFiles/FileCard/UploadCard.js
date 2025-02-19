import { useRef } from "react";
import FileCard from ".";
import styles from './styles.module.scss';
export default function UploadCard({
    onUpload,
    url,
    label
}) {
    const ref = useRef(null)
    return (<>
        <input
            hidden
            ref={ref}
            type="file"
            onChange={(e) => {
                const files = e.target.files
                onUpload(files)
            }}
            accept="application/pdf"
        />
        <FileCard label={label} url={url} onClick={() => ref.current.click()} className={styles.uploadCard} />
    </>)

}