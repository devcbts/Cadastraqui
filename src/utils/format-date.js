export default function formatDate(date = '', { showTime, utc } = { showTime: false, utc: true }) {
    // If showtime is true, it adds an offset of tz

    const formatter = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(showTime && {
            hour: '2-digit',
            minute: '2-digit',
        }),
        timeZone: utc ? "UTC" : "America/Sao_Paulo",
    });
    console.log('DATA', date)
    if (!date) return ''
    return formatter.format(new Date(date))
}