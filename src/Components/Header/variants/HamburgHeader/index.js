import { useState } from 'react'
import { ReactComponent as Hamburger } from 'Assets/icons/hamburger.svg'
import { ReactComponent as Close } from 'Assets/icons/close.svg'
import LogoWhite from '../../../../Assets/images/logo_white.png'
import styles from './styles.module.scss'
import useOutsideClick from 'hooks/useOutsideClick'
import Tutorial from 'Components/Tutorial'
import SidebarSelection from 'Components/Sidebar/SidebarSelection'
import { AnimatePresence, motion } from 'framer-motion'
export default function HamburgHeader() {
    // TODO: control sidebar effect
    const [isMenuOpen, setMenuOpen] = useState(false)
    const handleMenuChange = () => {

        setMenuOpen((prev) => !prev)
    }
    const MenuIcon = isMenuOpen ? Close : Hamburger
    const label = isMenuOpen ? 'fechar menu lateral' : 'abrir menu lateral'
    const ref = useOutsideClick(() => handleMenuChange())
    return (
        <>
            <header className={styles.container} style={{ height: '80px' }}>
                <motion.i
                    role='button'
                    tabIndex={0}
                    alt='menu lateral'
                    onClick={handleMenuChange}
                    aria-label={label}
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            handleMenuChange()
                        }
                    }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                >
                    <MenuIcon className={styles.hamburger}></MenuIcon>
                </motion.i>
                <img className={styles.logo} alt='logo' src={LogoWhite}></img>
                <Tutorial />
                <AnimatePresence>
                    {isMenuOpen && <motion.div
                        initial={{ transform: 'translateX(-100%)' }}
                        animate={{ transform: 'translateX(0)', }}
                        exit={{ transform: 'translateX(-100%)' }}
                        transition={{ duration: .3, ease: "easeInOut" }}
                        style={{ top: '82px', left: 0, position: 'absolute', zIndex: 999, height: 'calc(100vh - 80px)', display: 'flex' }}
                        ref={ref}>
                        <SidebarSelection />
                    </motion.div>}
                </AnimatePresence>
            </header>
        </>
    )
} 