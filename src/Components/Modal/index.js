import { ReactComponent as Close } from 'Assets/icons/close.svg';
import ButtonBase from "Components/ButtonBase";
import { AnimatePresence, motion } from "framer-motion";
import useOutsideClick from "hooks/useOutsideClick";
import { useEffect } from "react";
import Overlay from "../Overlay";
import Portal from "../Portal";
export default function Modal({ title, text, children, onDestructive, onConfirm, open,
    confirmText = 'Confirmar',
    destructiveText = 'Cancelar',
    onClose

}) {
    useEffect(() => {
        window.document.body.style.overflow = "hidden"
        return () => {
            window.document.body.style.overflow = "unset"
        }
    }, [])
    const ref = useOutsideClick(() => {
        onClose()
    })
    // if (!open) {
    //     return null
    // }
    return (
        <AnimatePresence>
            {open &&
                <Portal id="modal" >
                    <Overlay>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1, 1.05, 1], opacity: 1, }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: .3, ease: "backInOut" }}
                            ref={ref} style={{
                                minHeight: "10%", minWidth: "20%", padding: "16px 24px", backgroundColor: "white",
                                borderRadius: "16px", display: "flex", flexDirection: "column",
                                boxShadow: '1px 1.5px 15px 2px #666'
                            }}>
                            <Close style={{ verticalAlign: "center", display: 'flex', alignSelf: 'flex-end', cursor: 'pointer' }}
                                onClick={onClose} height={25} width={25} />
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '16px' }}>
                                <h1 style={{ textAlign: "center", }}>{title}</h1>
                                <h4 style={{ textAlign: "center" }}>{text}</h4>
                            </div>
                            {children}
                            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                                <ButtonBase onClick={onDestructive ?? onClose} danger>{destructiveText}</ButtonBase>
                                <ButtonBase onClick={onConfirm}>{confirmText}</ButtonBase>
                            </div>
                        </motion.div>
                    </Overlay>
                </Portal>}
        </AnimatePresence>)
}