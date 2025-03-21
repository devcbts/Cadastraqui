import { useEffect, useRef } from "react";

export default function useOutsideClick(cb) {
    const ref = useRef()
    useEffect(() => {
        const handleClick = (e) => {
            const isInsideSwal = e.target.closest('.swal2-container');
            if (ref.current && !ref.current.contains(e.target) && !isInsideSwal) {
                e.stopPropagation()
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