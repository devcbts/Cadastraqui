
import Swal from "sweetalert2";
import styles from './styles.module.scss'
import { toast } from "react-toastify";
class NotificationService {
    constructor() {
        this.styles = {
            confirmButton: styles.confirm,
            popup: styles.popup,
            icon: styles.icon,
            cancelButton: styles.cancel,
            title: styles.title,
            actions: styles.actions,
            closeButton: styles.close
        }
    }

    async success({ title = "Sucesso", text, type = "popup" }) {
        if (type === "popup") {

            return Swal.fire({
                showCloseButton: true,
                title,
                text,
                icon: "success",
                iconColor: "#499468",
                customClass: this.styles

            })
        } else if (type === "toast") {
            return toast.success(text, { autoClose: 1000 })
        }
    }

    async error({ title = "Erro", text, type = "popup" }) {
        if (type === "popup") {
            return Swal.fire({
                showCloseButton: true,
                title,
                text,
                icon: "error",
                iconColor: "#EF3E36",
                customClass: this.styles
            })
        }
        else if (type === "toast") {
            return toast.error(text, { autoClose: 1000 })
        }
    }
    async warn({ title = "Atenção", text }) {
        return Swal.fire({
            showCloseButton: true,
            title,
            text,
            icon: "warning",
            iconColor: "amber",
            customClass: this.styles
        })
    }

    async confirm({ title, text, cancel = "Cancelar", confirm = "Confirmar", onConfirm, onCancel = () => { } }) {
        const { isConfirmed, isDenied } = await Swal.fire({
            showCloseButton: true,
            title,
            text,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: confirm,
            cancelButtonText: cancel,
            customClass: this.styles
        })
        if (isConfirmed) {
            onConfirm()
        }
        if (isDenied) {
            onCancel()
        }
    }
}

const service = new NotificationService()
export { service as NotificationService }