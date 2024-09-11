import { useEffect } from "react";
import Portal from "../Portal";
import Overlay from "../Overlay";
import ButtonBase from "Components/ButtonBase";
import useOutsideClick from "hooks/useOutsideClick";

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
    if (!open) {
        return null
    }
    return <Portal id="modal" >
        <Overlay>
            <div ref={ref} style={{ minHeight: "10%", minWidth: "20%", padding: "16px 24px", backgroundColor: "white", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h1 style={{ textAlign: "center" }}>{title}</h1>
                    <h3 style={{ textAlign: "center" }}>{text}</h3>
                    {children}
                </div>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <ButtonBase onClick={onCancel}>Cancelar</ButtonBase>
                    <ButtonBase onClick={onConfirm}>Ok</ButtonBase>
                </div>
            </div>
        </Overlay>
    </Portal>
}