
import Swal from "sweetalert2";
import styles from './styles.module.scss'
class NotificationService {
    success({ title = "Sucesso", text }) {
        return Swal.fire({
            title,
            text,
            icon: "success",
            iconColor: "#499468",
            customClass: {
                confirmButton: styles.confirm,
                popup: styles.popup,
                icon: styles.icon,
                cancelButton: styles.cancel,
                title: styles.title
            }
        })
    }

    error({ title = "Erro", text }) {
        return Swal.fire({
            title,
            text,
            icon: "error",
            iconColor: "#EF3E36"
        })
    }

}

const service = new NotificationService()
export { service as NotificationService }