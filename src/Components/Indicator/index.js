import { useState } from "react"

export default function Indicator({
    status = "ok",
    description = "atualizado"
}) {
    const color = status === "ok" ? "green" : "red"
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow((prev) => !prev)
    }
    return (
        <div style={{ height: 20, width: 20, backgroundColor: color, borderRadius: '4px', position: 'relative' }} onMouseEnter={handleShow} onMouseLeave={handleShow} >
            {show && <div style={{ backgroundColor: '#cfcfcf', position: 'absolute', transform: "translateY(-150%)", padding: '4px', borderRadius: '4px', fontSize: '12px' }}>
                <span>{description}</span>
            </div>}
        </div>
    )
}