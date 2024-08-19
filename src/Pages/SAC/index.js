import { useSearchParams } from "react-router-dom"
import OpenCalls from "./components/OpenCalls"
import LinkedCalls from "./components/LinkedCalls"
import ButtonBase from "Components/ButtonBase"

export default function SAC() {
    const [filter, setFilter] = useSearchParams()
    const handleChangePage = () => {
        if (filter.get("filter") === "open") {
            setFilter({
                filter: 'mine'
            })
        } else {
            setFilter({
                filter: 'open'
            })
        }
    }
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'baseline' }}>
                <h1>SAC</h1>

                <ButtonBase label={filter.get("filter") === 'open' ? 'meus chamados' : 'chamados abertos'} onClick={handleChangePage} />
            </div>
            {
                filter.get("filter") === "open"
                    ? <OpenCalls />
                    : <LinkedCalls />
            }
        </>
    )
}