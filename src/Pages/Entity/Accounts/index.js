import Table from "Components/Table";
import Members from "./components/Members";
import Subsidiaries from "./components/Subsidiaries";

export default function EntityAccounts() {
    return (
        <div>
            <h1>Contas</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '24px' }}>
                <Members />
                <Subsidiaries />
            </div>
        </div>
    )
}