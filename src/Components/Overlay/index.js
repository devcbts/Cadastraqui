export default function Overlay({ children }) {
    return (
        <div style={{ height: "100%", width: "100%", backgroundColor: "rgba(0,0,0,.5)", position: "fixed", top: 0, left: 0, display: "flex", zIndex: "999", justifyContent: "center", alignItems: "center" }}>
            {children}
        </div>
    )
}