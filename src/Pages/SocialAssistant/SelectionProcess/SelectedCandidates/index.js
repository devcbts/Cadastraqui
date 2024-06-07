import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
export default function SelectedCandidates() {
    return (
        <div>
            <BackPageTitle title={'processo de seleção'} path={'/home/selecao/1234'} />
            <h2>Lista de Candidatos Selecionados: Edital XYZ</h2>
            <div>
                <div>
                    <span>Instituição: Unifei</span>
                    <span>Tipo de Educação: Superior</span>
                    <span>Vagas: 4</span>
                    <span>Inscritos: 100</span>
                </div>
                <span>Endereço: Rua das Flores, 123. Jardim Florido, São Paulo/SP</span>
                <div>
                    <span>Ciclo/Ano/Série/Semestre/Curso: G1 - (1 ano)</span>
                    <span>Tipo de Bolsa: Bolsa Lei 187 Integral</span>
                </div>
                <span>Critério do Rank / desempate: Cad. Único, Menor renda, Doença grave</span>
            </div>
            <Table.Root headers={['rank', 'candidato', 'renda bruta média', 'condição', 'pendências', 'ficha', 'ação']}>
                <Table.Row>
                    <Table.Cell divider>1</Table.Cell>
                    <Table.Cell >Gabriel</Table.Cell>
                    <Table.Cell >R$1230,00</Table.Cell>
                    <Table.Cell >Titular</Table.Cell>
                    <Table.Cell >0</Table.Cell>
                    <Table.Cell >Em análise</Table.Cell>
                    <Table.Cell >
                        <ButtonBase >
                            <Magnifier width={14} height={14} />
                        </ButtonBase>
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}