import FilePreview from "Components/FilePreview";

export default function FileCard({
    label,
    url,
    ...props
}) {
    return (
        <div style={{
            backgroundColor: '#fff',
            width: 'min(100%,380px)',
            minHeight: '60px',
            borderRadius: '8px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: "center",
            justifyContent: 'space-between',
            marginBottom: '8px',
            flexDirection: 'column',
            placeSelf: 'center'
        }}
            {...props}
        >
            <strong>{label}</strong>
            <FilePreview url={url} text={'Visualizar'} />
        </div>
    )
}