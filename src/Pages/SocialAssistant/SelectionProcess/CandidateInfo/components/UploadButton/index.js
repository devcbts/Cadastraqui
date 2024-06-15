import { ReactComponent as Add } from 'Assets/icons/add-document.svg'
export default function UploadButton({ onClick }) {
    return (
        <Add style={{ cursor: "pointer" }} onClick={onClick} />
    )
}