export default function findLabel(enumerator, value) {
    let returnValue;
    try {
        returnValue = enumerator.find(e => e.value === value)?.label
    } catch (err) {
        console.log(err)
        returnValue = ''
    }
    console.log('aaaa', enumerator, value)
    return returnValue
}