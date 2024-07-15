import styles from './styles.module.scss'
import { ReactComponent as Lightbulb } from '../../Assets/icons/lightbulb.svg'
import { useState } from 'react'
export default function Tooltip({ tooltip, icon = "lightbulb", children }) {
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(prev => !prev)
    }
    return (
        <div className={styles.container}>
            {children}
            <div className={styles.tooltipwrapper} onMouseEnter={handleShow} onMouseLeave={handleShow}>
                {show &&
                    <div className={styles.tooltip}>
                        {tooltip}
                    </div>
                }

                <Lightbulb height={20} width={20} />
            </div>
        </div>
    )
}