import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export default function AIAnalysisIndicator({
    status
}) {
    const [color, description] = (() => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return ['#499468', 'Documentação aprovada']
            case 'declined':
                return ['#EF3E36', 'Documentação recusada']
            case 'pending':
                return ['#E7A60B', 'Documentação pendente']
            case 'forced':
                return ['#6C5CE7', 'Documentação enviada após confirmação do usuário']
            default:
                return []
        }
    })()
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow((prev) => !prev)
    }
    if (!status) {
        return null
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
                    initial={{ scale: 0, y: '-100%' }}
                    animate={{ scale: 1, y: '-150%' }}
                    exit={{ scale: 0, y: '-100%' }}
                    style={{
                        backgroundColor: '#C5C5C5',
                        position: 'absolute', left: '50%', x: '-50%', y: '-150%',
                        padding: '4px', borderRadius: '4px', fontSize: '12px'
                    }}>
                    <p>{description}</p>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}