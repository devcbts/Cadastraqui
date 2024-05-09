
import Swal from "sweetalert2";
import styles from './styles.module.scss'
class NotificationService {
    constructor() {
        this.styles = {
            confirmButton: styles.confirm,
            popup: styles.popup,
            icon: styles.icon,
            cancelButton: styles.cancel,
            title: styles.title
        }
    }

    success({ title = "Sucesso", text }) {
        return Swal.fire({
            title,
            text,
            icon: "success",
            iconColor: "#499468",
            customClass: this.styles

        })
    }

    error({ title = "Erro", text }) {
        return Swal.fire({
            title,
            text,
            icon: "error",
            iconColor: "#EF3E36",
            customClass: this.styles
        })
    }

}

const service = new NotificationService()
export { service as NotificationService }