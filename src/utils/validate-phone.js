export default function validatePhone(phone) {
    if (!phone) return true
    const onlyPhoneDigits = phone.replace(/\D/g, '')
    const regex = new RegExp(/\d{10}\d?/)

    return regex.test(onlyPhoneDigits)
}