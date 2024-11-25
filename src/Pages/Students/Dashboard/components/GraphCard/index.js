export default function GraphCard({ title, children, ...props }) {
    const { style = {}, ...otherProps } = props
    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: "16px", flexGrow: '1',
            borderRadius: '12px', boxShadow: '0px 0px 12px -2px #C5C5C5', padding: '8px 16px',
            ...style
        }}
            {...otherProps}
        >
            <h4>{title}</h4>
            {children}
        </div>
    )
}