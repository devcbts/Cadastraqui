export default function removeObjectFileExtension(obj = {}) {
    const getFiles = Object.keys(obj)?.[0]
    const newEntries = Object.keys(obj[getFiles])
    const newObj = newEntries.reduce((acc, key) => {
        const splitKey = key.split('.')[0]
        acc[splitKey] = obj[getFiles][key]
        return acc

    }, {})
    return newObj
}