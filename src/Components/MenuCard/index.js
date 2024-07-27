export default function MenuCard({
    onClick,
    Icon,
    title,
    description,
    style
}) {
    return (
        <div style={{
            height: '180px', width: 'min(80%,180px)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', backgroundColor: '#1F4B73', borderRadius: '8px',
            color: 'white', padding: '16px', justifyContent: 'space-between', alignItems: 'center', ...style
        }}
            onClick={onClick}
        >
            {Icon && <Icon style={{ color: 'white' }} height={"40%"} width={"40%"} />}
            <div>
                <h3 style={{ textAlign: 'center' }}>{title}</h3>
                {description && <span style={{ fontSize: '12px' }}>{description}</span>}
            </div>
        </div>
    )
}