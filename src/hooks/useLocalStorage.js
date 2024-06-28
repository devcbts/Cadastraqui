import { useEffect, useState } from "react"

// if you pass a key, the value will always track the localStorage value as well
export default function useLocalStorage(key, defaultValue = null) {
    const [get, set] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? item : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    })

    const setItem = (value) => {
        localStorage.setItem(key, value)
        window.dispatchEvent(new StorageEvent(`update-storage-${key}`));
    }
    const remove = (key = null) => {
        if (key === null) {
            localStorage.clear()
            return
        }
        localStorage.removeItem(key)
    }
    useEffect(() => {
        const handleStorageChange = () => {
            set(localStorage.getItem(key));
        }
        window.addEventListener(`update-storage-${key}`, handleStorageChange)
        return () => {
            window.removeEventListener(`update-storage-${key}`, handleStorageChange)
        }
    }, [key])

    return {
        get,
        set: setItem,
        remove
    }
}