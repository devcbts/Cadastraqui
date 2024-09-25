export default function MenuCard({
    onClick,
    Icon,
    title,
    description,
    style
}) {
    return (
        <div style={{
            height: '160px', width: 'min(80%,180px)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', backgroundColor: '#1F4B73', borderRadius: '8px',
            color: 'white', padding: '16px', justifyContent: 'space-between', alignItems: 'center', ...style
        }}
            onClick={onClick}
        >
            {Icon && <Icon style={{ color: 'white', flex: 1, height: '60px', width: '60px' }} />}
            <div >
                <h4 style={{ textAlign: 'center', textTransform: 'uppercase' }}>{title}</h4>
                {description && <span style={{ fontSize: '12px' }}>{description}</span>}
            </div>
        </div>
    )
}