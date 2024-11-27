import { useState } from "react"
import { AnimatePresence, motion } from 'framer-motion'
export default function Indicator({
    status = null,
    description
}) {

    const color = status === null ? "#EF3E36" : (status ? "#499468" : "#ffbf00")
    const defaultDescription = status === null ? "Incompleto" : (status ? "Atualizado" : "Desatualizado")
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow((prev) => !prev)
    }
    return (
        <div style={{
            cursor: "help", height: 20, width: 20, backgroundColor: color, borderRadius: '4px', position: 'relative',
            boxShadow: '0px 0px 6px -2px #5C5C5C'
        }}
            onMouseEnter={handleShow}
            onMouseLeave={handleShow} >
            <AnimatePresence>

                {show && <motion.div
                    initial={{ scale: 0, }}
                    animate={{ scale: 1, }}
                    exit={{ scale: 0 }}
                    style={{
                        backgroundColor: '#C5C5C5',
                        position: 'absolute', left: '50%', transform: "translateY(-150%) translateX(-50%)",
                        padding: '4px', borderRadius: '4px', fontSize: '12px'
                    }}>
                    <p>{description ?? defaultDescription}</p>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}