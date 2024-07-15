import { useState } from 'react'
import { ReactComponent as Hamburger } from 'Assets/icons/hamburger.svg'
import { ReactComponent as Close } from 'Assets/icons/close.svg'
import LogoWhite from '../../../../Assets/images/logo_white.png'
import styles from './styles.module.scss'
export default function HamburgHeader({ children }) {
    // TODO: control sidebar effect
    const [isMenuOpen, setMenuOpen] = useState(false)
    const handleMenuChange = () => {

        setMenuOpen((prev) => !prev)
    }
    const MenuIcon = isMenuOpen ? Close : Hamburger
    return (
        <div>
            <header className={styles.container}>
                <MenuIcon className={styles.hamburger} alt='menu' onClick={handleMenuChange}></MenuIcon>
                <img className={styles.logo} alt='logo' src={LogoWhite}></img>
            </header>
            {isMenuOpen && children}
        </div>
    )
} 