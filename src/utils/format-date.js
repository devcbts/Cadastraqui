export default function formatDate(date = '') {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC'
    });
    if (!date) return ''
    return formatter.format(new Date(date))
}