import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ReactComponent as Lightbulb } from '../../Assets/icons/lightbulb.svg'
import styles from './styles.module.scss'
export default function Tooltip({ tooltip, Icon = Lightbulb, children }) {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(prev => !prev)
    }
    return (
        <div className={styles.container}>
            {children}
            <div className={styles.tooltipwrapper} >

                <AnimatePresence >
                    {show &&
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1.1, 1] }}
                            exit={{ scale: 0 }}
                            transition={{ duration: .2 }}
                        // className={styles.tooltip}
                        >
                            <div className={styles.tooltip}
                            >
                                {tooltip}
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>

                <Icon
                    onMouseEnter={handleShow} onMouseLeave={handleShow}
                    width={20} height={20} style={{ display: 'flex', flexGrow: '1' }} />
            </div>
        </div>
    )
}