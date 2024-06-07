export default function useLocalStorage() {
    // TODO : add side effect when user updates an entry on localStorage
    const get = (key) => {
        return localStorage.getItem(key)
    }
    const set = (key, value) => {
        localStorage.setItem(key, value)
    }
    const remove = (key = null) => {
        if (key === null) {
            localStorage.clear()
            return
        }
        localStorage.removeItem(key)
    }
    return {
        get,
        set,
        remove
    }
}