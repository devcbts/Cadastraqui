import ButtonBase from "Components/ButtonBase";
import { AnimatePresence, motion } from "framer-motion";
import useOutsideClick from "hooks/useOutsideClick";
import { useEffect } from "react";
import Overlay from "../Overlay";
import Portal from "../Portal";
export default function Modal({ title, text, children, onCancel, onConfirm, open }) {
    useEffect(() => {
        window.document.body.style.overflow = "hidden"
        return () => {
            window.document.body.style.overflow = "unset"
        }
    }, [])
    const ref = useOutsideClick(() => {
        onCancel()
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
                                minHeight: "10%", minWidth: "20%",
                                padding: "16px 24px",
                                backgroundColor: "white", borderRadius: "8px", maxHeight: '600px', overflowY: 'auto',
                                display: "flex", flexDirection: "column", margin: '24px 16px'
                            }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                                <h1 style={{ textAlign: "center" }}>{title}</h1>
                                <h3 style={{ textAlign: "center" }}>{text}</h3>
                                {children}
                            </div>
                            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                                <ButtonBase onClick={onCancel}>Cancelar</ButtonBase>
                                <ButtonBase onClick={onConfirm}>Ok</ButtonBase>
                            </div>
                        </motion.div>
                    </Overlay>
                </Portal>}
        </AnimatePresence>)
}