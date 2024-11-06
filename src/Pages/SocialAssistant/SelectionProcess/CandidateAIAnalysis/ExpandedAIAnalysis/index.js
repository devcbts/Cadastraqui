import InputBase from 'Components/InputBase'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
export default function ExpandedAIAnalysis({ children }) {
    const ref = useRef()
    const animationDuration = 500
    useEffect(() => {
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