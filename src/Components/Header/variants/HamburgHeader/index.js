import { useState } from 'react'
import { ReactComponent as Hamburger } from 'Assets/icons/hamburger.svg'
import { ReactComponent as Close } from 'Assets/icons/close.svg'
import LogoWhite from '../../../../Assets/images/logo_white.png'
import styles from './styles.module.scss'
import useOutsideClick from 'hooks/useOutsideClick'
export default function HamburgHeader({ children }) {
    // TODO: control sidebar effect
    const [isMenuOpen, setMenuOpen] = useState(false)
    const handleMenuChange = () => {

        setMenuOpen((prev) => !prev)
    }
    const MenuIcon = isMenuOpen ? Close : Hamburger
    const label = isMenuOpen ? 'fechar menu lateral' : 'abrir menu lateral'
    const ref = useOutsideClick(() => handleMenuChange())
    return (
        <div>
            <header className={styles.container} popovertarget="sidebar">
                <MenuIcon role='button' tabIndex={0} className={styles.hamburger} alt='menu lateral' onClick={handleMenuChange}
                    aria-label={label}
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {

                            handleMenuChange()
                        }
                    }}
                ></MenuIcon>
                <img className={styles.logo} alt='logo' src={LogoWhite}></img>
            </header>
            {isMenuOpen && <div ref={ref}>{children}</div>}
        </div>
    )
} 