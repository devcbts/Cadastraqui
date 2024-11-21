import { useState } from 'react'
import styles from './styles.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
export default function MenuCard({
    onClick,
    Icon,
    title,
    description,
    style
}) {
    const [showDetails, setShowDetails] = useState(false)
    const toggleDetails = () => !!description ? setShowDetails(prev => !prev) : null
    return (
        <motion.div
            style={style}
            className={styles.container}
            onHoverStart={toggleDetails}
            onHoverEnd={toggleDetails}
            onClick={onClick}
        >
            <motion.div
                style={{ display: 'flex', flexDirection: showDetails ? 'row' : 'column', flexGrow: showDetails ? 0 : '1', alignItems: 'center' }}
                layout
                className={styles.content}
            >
                {Icon &&
                    <motion.div
                        layout
                        style={{ height: showDetails ? '20px' : '40%', width: showDetails ? '20px' : '40%' }}
                    >
                        <Icon style={{ height: '100%', width: '100%' }} />
                    </motion.div>
                }
                <motion.h3 layout style={{ textAlign: 'center' }}>{title}</motion.h3>
            </motion.div>
            {!!description &&
                <AnimatePresence>
                    {showDetails &&
                        <motion.div
                            style={{ position: 'absolute', bottom: 0 }}
                            initial={{ height: 0 }}
                            animate={{ height: '60%' }}
                            exit={{ height: 0 }}
                        >
                            <div className={styles.description}>
                                {description}
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            }
        </motion.div>
    )
}