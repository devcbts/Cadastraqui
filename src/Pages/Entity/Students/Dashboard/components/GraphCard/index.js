export default function GraphCard({ title, children }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: "16px", flexGrow: '1',
            borderRadius: '12px', boxShadow: '1.2px 1.3px 1px .12px black', padding: '8px 16px',

        }}>
            <h4>{title}</h4>
            {children}
        </div>
    )
}