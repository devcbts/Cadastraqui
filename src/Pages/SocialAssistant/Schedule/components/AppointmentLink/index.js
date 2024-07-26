import { useState } from "react"
import { ReactComponent as Pencil } from 'Assets/icons/edit.svg'
import { ReactComponent as Save } from 'Assets/icons/save.svg'
import { ReactComponent as Close } from 'Assets/icons/close.svg'
export default function AppointmentLink({ link, onSave }) {
    const [editing, setEditing] = useState(false)
    const [currentLink, setCurrentLink] = useState(link)
    const handleSave = () => {
        onSave && onSave()
        handleEditMode()
    }
    const handleEdit = (e) => {
        setCurrentLink(e.target.value)
    }
    const handleCancel = () => {
        handleEditMode()
        setCurrentLink(link)
    }
    const handleEditMode = () => {
        setEditing(prev => !prev)
    }
    return (
        <div style={{
            width: '100%', backgroundColor: '#1F4B73', padding: '8px 16px',
            borderRadius: '8px', color: 'white', display: 'flex', flexDirection: 'row',
            justifyContent: 'space-around', height: '40px', alignItems: 'center'
        }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                <span>Link da reunião:</span>
                {editing
                    ? <input defaultValue={currentLink} onChange={handleEdit} />
                    : <a href={currentLink} target="_blank" style={{ color: 'white' }}>{currentLink}</a>
                }
            </div>
            <div>
                {editing
                    ? <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'inherit' }}>
                        <Close style={{ color: 'white', cursor: 'pointer' }} height={20} width={20} onClick={handleCancel} />
                        <Save style={{ color: 'white', cursor: 'pointer' }} height={20} width={20} onClick={handleSave} />
                    </div>
                    : <Pencil style={{ color: 'white', cursor: 'pointer' }} height={20} width={20} onClick={handleEditMode} />
                }
            </div>
        </div>
    )
}