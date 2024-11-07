import { ReactComponent as ChevIcon } from 'Assets/icons/chevron.svg'
import { useState } from 'react'
import styles from './styles.module.scss'
import { CSSTransition } from 'react-transition-group'
import { AnimatePresence, motion } from 'framer-motion'
export default function Accordion({
    title,
    defaultOpen,
    children,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
    const handleToggle = () => {
        setIsOpen(prev => !prev)
    }
    const [hovered, setHovered] = useState(false)
    const hoverOrOpen = hovered || isOpen
    return (
        <div className={styles.container} >
            <motion.div className={styles.header} onClick={handleToggle}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
            >
                <span style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, gap: '24px', alignItems: 'center', color: hoverOrOpen ? 'white' : '' }}>{title}</span>
                <ChevIcon
                    style={{
                        marginLeft: 24,
                        transform: isOpen ? "rotateZ(180deg)" : 'rotateZ(360deg)',
                        transition: 'all .3s',
                        color: hoverOrOpen ? 'white' : '',

                    }}
                />
                <AnimatePresence >

                    {hoverOrOpen && <motion.div
                        className={styles.headerHovered}
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        exit={{ height: 0 }}
                        transition={{ duration: .15 }}
                    />}
                </AnimatePresence>
            </motion.div>
            <AnimatePresence >
                {isOpen && <motion.div
                    className={styles.content}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: .20 }}
                >
                    {/** add padding here to prevent non-linear animation (framer motion bug) */}
                    <div style={{ padding: '16px' }}>
                        {children}
                    </div>
                </motion.div>}
            </AnimatePresence>
        </div >
    )
}