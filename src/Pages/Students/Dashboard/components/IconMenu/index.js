export default function IconMenu({ Icon, text, onClick }) {
    const size = 50
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '4px',
            justifyContent: 'center', alignItems: 'center', maxWidth: '100px', cursor: 'pointer'
        }}
            onClick={onClick}
        >
            <Icon height={size} width={size} />
            <span style={{ textAlign: 'center', fontWeight: '600', textTransform: 'uppercase' }}>{text}</span>
        </div>
    )
}