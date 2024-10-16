import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FilePickerBase from "Components/FilePickerBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useRef, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import ModeloAlunos from 'Assets/templates/Modelo_Alunos.xlsx'
export default function EntityRegisterStudents() {
    const inputRef = useRef()
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectFile = async (e) => {
        const { files } = e.target
        if (!files?.[0]) { return }
        const file = files[0]
        try {
            setIsLoading(true)
            const data = new FormData()
            data.append("file", file)
            const information = await entityService.registerNewStudents(data)
            setStudents(information)
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    return (
        <>
            <Loader loading={isLoading} text="Cadastrando alunos" />
            <BackPageTitle title={'Cadastrar alunos'} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '64px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                    <h3>Preencher por planilha</h3>
                    <a
                        download={'Modelo_novos_alunos'}
                        href={ModeloAlunos} >
                        <ButtonBase label={'baixar modelo'} />
                    </a>
                    <input type="file" accept=".csv" hidden ref={inputRef} onChange={handleSelectFile} />
                    <ButtonBase label={'enviar'} onClick={() => inputRef.current.click()} />
                </div>
                <div>
                    <h3>Confira a lista de alunos enviados</h3>
                    <Table.Root headers={['nome completo', 'período', 'curso']}>
                        {
                            students.map(e => (
                                <Table.Row>
                                    <Table.Cell>{e.Nome}</Table.Cell>
                                    <Table.Cell>{e.Periodo}</Table.Cell>
                                    <Table.Cell>{e.Curso}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                </div>
            </div>
        </>
    )
}