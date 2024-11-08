import InputBase from 'Components/InputBase'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
export default function ExpandableTableContent({ children, focus = true }) {
    const ref = useRef()
    const animationDuration = 500
    useEffect(() => {
        if (!focus) { return }
        const timeoutId = setTimeout(() => {
            if (ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, animationDuration * .8)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])
    return (
        <motion.div
            ref={ref}
            layout="size"
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            exit={{ height: 0 }}
            transition={{ duration: animationDuration / 1000, when: 'beforeChildren' }}
            style={{ overflow: 'hidden' }}
        >
            {children}
        </motion.div>
    )
}