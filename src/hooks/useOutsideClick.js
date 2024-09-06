import { useEffect, useRef } from "react";

export default function useOutsideClick(cb) {
    const ref = useRef()
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                cb()
            }
        }
        document.addEventListener('click', handleClick, true)
        return () => {
            document.removeEventListener('click', handleClick, true)
        }
    }, [])
    return ref
}