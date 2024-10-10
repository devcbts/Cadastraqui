import { useState } from "react"

export default function Indicator({
    status = null,
    description
}) {

    const color = status === null ? "#EF3E36" : (status ? "#499468" : "#ffbf00")
    const defaultDescription = status === null ? "Incompleto" : (status ? "Atualizado" : "Desatualizado")
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow((prev) => !prev)
    }
    return (
        <div style={{
            cursor: "help", height: 20, width: 20, backgroundColor: color, borderRadius: '4px', position: 'relative',
            boxShadow: '.8px 1.2px .5px .5px #cfcfcf'
        }}
            onMouseEnter={handleShow}
            onMouseLeave={handleShow} >
            {show && <div style={{ backgroundColor: '#cfcfcf', position: 'absolute', transform: "translateY(-150%)", padding: '4px', borderRadius: '4px', fontSize: '12px' }}>
                <span>{description ?? defaultDescription}</span>
            </div>}
        </div>
    )
}