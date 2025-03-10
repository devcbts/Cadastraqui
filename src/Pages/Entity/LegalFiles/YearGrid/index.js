import { useMemo } from "react"

export default function YearGrid({
    count = 4,
    render = undefined,
    container = undefined // {onClick, style}
}) {
    const years = useMemo(() => {
        const currYear = new Date().getFullYear()
        return Array.from({ length: count }).map((_, i) => currYear - i)
    }, [])
    return (
        <div style={{
            marginTop: 24, display: "grid", gridTemplateColumns: `repeat(4,minmax(200px, 1fr))`, gap: 16
        }}>
            {
                years.map((year, i) => {
                    if (container !== undefined) {
                        return <div style={{
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
                            placeSelf: 'center',
                            cursor: container?.onClick ? 'pointer' : 'default',
                            ...container?.style ?? {}
                        }}
                            onClick={() => container?.onClick(year) ?? undefined}
                        >
                            {render(year)}
                        </div>

                    }
                    return render(year)
                })
            }
        </div>
    )

}