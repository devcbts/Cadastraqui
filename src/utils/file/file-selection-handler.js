import { NotificationService } from "services/notification"
const MAX_FILE_SIZE = 10 * 1024 * 1024
export const fileSelectionHandler = (e) => {
    const files = e.target.files
    if (!files.length === 0) {
        return
    }

    for (const item of files) {
        if (item.size >= 10 * 1024 * 1024) {
            NotificationService.error({ text: 'Arquivo deve ser menor que 10MB' })
            return
        }
    }
}