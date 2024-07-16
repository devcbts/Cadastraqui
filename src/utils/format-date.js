export default function formatDate(date = '') {
    return new Date(date.split('-')).toLocaleDateString('pt-br')
}