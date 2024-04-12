/**
 * 
 * @param {*} expression boolean expression to enable or disable validation
 * @param {*} validation validation array or single validation builder
 * @returns 
 */
export default function ValidateIf(expression, validation) {
    if (!!expression) {
        return [...validation];
    } else {
        return []
    }
}