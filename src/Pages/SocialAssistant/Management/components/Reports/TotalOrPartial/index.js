import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
export default function TotalOrPartialReport() {
    return (
        <div style={{ padding: '32px 24px 0px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ textAlign: 'center' }}>Processo seletivo XYZ -  Resultado final</h3>
            <label>Instituição Universidade teste - CNPJ cnpj</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ textAlign: 'center' }}>Relatório geral</h2>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px' }}>
                    <ButtonBase >
                        <Excel width={30} height={30} />
                    </ButtonBase>
                    <ButtonBase >
                        <PDF width={30} height={30} />
                    </ButtonBase>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h2 style={{ textAlign: 'center' }}>Relatório parcial</h2>
                    <div style={{
                        padding: '0px 24px 4px 24px',
                        display: 'flex', flexWrap: 'wrap',
                        flexDirection: 'row', borderBottom: '2px solid #1F4B73',
                        width: 'max(60%,400px)',
                        justifyContent: 'space-between', alignItems: 'center', placeSelf: 'center'
                    }}>
                        <label>Instituição XYZ - CNPJ cnpj</label>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px' }}>
                            <ButtonBase >
                                <Excel width={20} height={20} />
                            </ButtonBase>
                            <ButtonBase >
                                <PDF width={20} height={20} />
                            </ButtonBase>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}