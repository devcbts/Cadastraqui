import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import ModeloAlunos from 'Assets/templates/Modelo_Alunos.xlsx'
import studentService from "services/student/studentService";
import SHIFT from "utils/enums/shift-types";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import EDUCATION_STYLES from "utils/enums/education-style-types";
import EDUCATION_TYPE from "utils/enums/education-type";
import SCHOOL_LEVELS from "utils/enums/school-levels";
import OFFERED_COURSES_TYPE from "utils/enums/offered-courses";

const HEADER_ORDER = [
    "Nome",
    "Email",
    "CPF",
    "Tipo",
    "Curso",
    "Turno",
    "Periodo",
    "isPartial",
    "ScholarshipType",
    "ModalityType",
    "Nascimento",
    "CNPJ",
    "RName",
    "RCPF",
    "REmail",
    "RBirthDate",
    "hasResponsible",
    "CourseType"
];

const REQUIRED_HEADERS = [
    "Nome",
    "Email",
    "CPF",
    "Tipo",
    "Curso",
    "Turno",
    "Nascimento",
    "CNPJ",
    "isPartial",
    "ScholarshipType",
    "ModalityType"
];

const headerAliases = {
    nome: "Nome",
    curso: "Curso",
    tipo: "Tipo",
    tipodecurso: "Tipo",
    coursetype: "CourseType",
    tipoeducacao: "CourseType",
    tipodeeducacao: "CourseType",
    email: "Email",
    cpf: "CPF",
    periodo: "Periodo",
    periodoletivo: "Periodo",
    nascimento: "Nascimento",
    datanascimento: "Nascimento",
    cnpj: "CNPJ",
    ispartial: "isPartial",
    bolsa: "isPartial",
    parcial: "isPartial",
    turno: "Turno",
    scholarshiptype: "ScholarshipType",
    tipobolsa: "ScholarshipType",
    tipodebolsa: "ScholarshipType",
    modalitytype: "ModalityType",
    modalidade: "ModalityType",
    rname: "RName",
    nomedoresponsavel: "RName",
    rcpf: "RCPF",
    cpfdoresponsavel: "RCPF",
    rbirthdate: "RBirthDate",
    rdatadenascimento: "RBirthDate",
    datadenascimentodoresponsavel: "RBirthDate",
    remail: "REmail",
    emaildoresponsavel: "REmail",
    hasresponsible: "hasResponsible",
    possuiresponsavel: "hasResponsible",
    responsavel: "hasResponsible"
};

const toNormalizedKey = (value) => {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
};

const toDigitString = (value) => String(value ?? "").replace(/\D+/g, "");

const toBooleanFlag = (value) => {
    const normalized = toNormalizedKey(value);
    if (["1", "true", "sim", "yes", "parcial", "partial"].includes(normalized)) {
        return "1";
    }
    if (["0", "false", "nao", "no", "integral", "full"].includes(normalized)) {
        return "0";
    }
    return "";
};

const toEnumValue = (value, options) => {
    if (!value) {
        return "";
    }
    const normalized = toNormalizedKey(value);
    const byValue = options.find((option) => toNormalizedKey(option.value) === normalized);
    if (byValue) {
        return byValue.value;
    }
    const byLabel = options.find((option) => toNormalizedKey(option.label) === normalized);
    return byLabel ? byLabel.value : "";
};

const formatDateToCsv = (value) => {
    if (!value) {
        return "";
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
        const day = String(value.getDate()).padStart(2, "0");
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const year = String(value.getFullYear());
        return `${day}/${month}/${year}`;
    }
    if (typeof value === "number") {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (parsed) {
            const day = String(parsed.d).padStart(2, "0");
            const month = String(parsed.m).padStart(2, "0");
            const year = String(parsed.y);
            return `${day}/${month}/${year}`;
        }
    }
    const text = String(value).trim();
    const match = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (match) {
        const day = match[1].padStart(2, "0");
        const month = match[2].padStart(2, "0");
        const year = match[3].length === 2 ? `20${match[3]}` : match[3];
        return `${day}/${month}/${year}`;
    }
    return "";
};

const createCsvText = (rows, delimiter = ";") => {
    const escapeValue = (value) => {
        const stringValue = String(value ?? "");
        if (stringValue.includes('"') || stringValue.includes(delimiter) || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };
    const headerLine = HEADER_ORDER.join(delimiter);
    const lines = rows.map((row) => {
        return HEADER_ORDER.map((header) => escapeValue(row[header])).join(delimiter);
    });
    return [headerLine, ...lines].join("\n");
};

export default function RegisterStudents() {
    const inputRef = useRef()
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isParsing, setIsParsing] = useState(false)
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)
    const [isLoadingItems, setIsLoadingItems] = useState(false)
    const [entityCnpjs, setEntityCnpjs] = useState([])
    const [parseResult, setParseResult] = useState({
        fileName: "",
        validRows: [],
        invalidRows: [],
        headerErrors: []
    })
    const [importStatusFilter, setImportStatusFilter] = useState("")
    const [importBatches, setImportBatches] = useState([])
    const [selectedBatchId, setSelectedBatchId] = useState(null)
    const [batchItems, setBatchItems] = useState([])
    const [onlyErrors, setOnlyErrors] = useState(false)
    const [batchPagination, setBatchPagination] = useState({ page: 1, size: 20, total: 0, totalPages: 1 })
    const [itemPagination, setItemPagination] = useState({ page: 1, size: 50, total: 0, totalPages: 1 })

    const enumMaps = useMemo(() => {
        return {
            courseType: EDUCATION_TYPE,
            type: SCHOOL_LEVELS.concat(OFFERED_COURSES_TYPE),
            shift: SHIFT,
            scholarship: SCHOLARSHIP_TYPE.concat(SCHOLARSHIP_OFFER),
            modality: EDUCATION_STYLES
        }
    }, [])

    const importStatuses = useMemo(() => ([
        { value: "", label: "Todos" },
        { value: "PROCESSING", label: "Processando" },
        { value: "SUCCESS", label: "Concluído" },
        { value: "PARTIAL", label: "Concluído (com erros)" },
        { value: "FAILED", label: "Falhou" }
    ]), [])

    const BATCH_STATUS_LABEL = {
        PROCESSING: 'Processando',
        SUCCESS: 'Concluído',
        PARTIAL: 'Concluído (com erros)',
        FAILED: 'Falhou'
    }

    const ITEM_STATUS_LABEL = {
        CREATED: 'Criado',
        SKIPPED: 'Ignorado',
        ERROR: 'Erro'
    }

    useEffect(() => {
        let isMounted = true
        const loadEntity = async () => {
            try {
                const entity = await entityService.getEntityInfo()
                if (!isMounted) {
                    return
                }
                const cnpjs = [entity?.CNPJ, ...(entity?.EntitySubsidiary ?? []).map((item) => item.CNPJ)]
                    .filter(Boolean)
                    .map((cnpj) => toDigitString(cnpj))
                setEntityCnpjs(cnpjs)
            } catch (err) {
                NotificationService.error({ text: "Nao foi possivel carregar os dados da entidade." })
            }
        }
        loadEntity()
        return () => {
            isMounted = false
        }
    }, [])

    const loadImportBatches = async ({ page = 1, size = batchPagination.size, status = importStatusFilter } = {}) => {
        try {
            setIsLoadingHistory(true)
            const response = await studentService.getImportBatches({ page, size, status: status || undefined })
            setImportBatches(response?.batches ?? [])
            setBatchPagination({
                page: response?.page ?? page,
                size: response?.size ?? size,
                total: response?.total ?? 0,
                totalPages: response?.totalPages ?? 1
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message ?? "Erro ao carregar histórico de importações." })
        } finally {
            setIsLoadingHistory(false)
        }
    }

    const loadBatchItems = async ({ batchId = selectedBatchId, page = 1, size = itemPagination.size, onlyErrorItems = onlyErrors } = {}) => {
        if (!batchId) {
            setBatchItems([])
            return
        }
        try {
            setIsLoadingItems(true)
            const response = await studentService.getImportBatchItems(batchId, {
                page,
                size,
                onlyErrors: onlyErrorItems
            })
            setBatchItems(response?.items ?? [])
            setItemPagination({
                page: response?.page ?? page,
                size: response?.size ?? size,
                total: response?.total ?? 0,
                totalPages: response?.totalPages ?? 1
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message ?? "Erro ao carregar itens do lote." })
        } finally {
            setIsLoadingItems(false)
        }
    }

    useEffect(() => {
        loadImportBatches({ page: 1 })
    }, [])

    useEffect(() => {
        loadImportBatches({ page: 1, status: importStatusFilter })
    }, [importStatusFilter])

    useEffect(() => {
        setItemPagination((prev) => ({ ...prev, page: 1 }))
        loadBatchItems({ batchId: selectedBatchId, page: 1, onlyErrorItems: onlyErrors })
    }, [selectedBatchId, onlyErrors])

    const validateRow = (row, rowIndex) => {
        const errors = []
        const tipoValue = toEnumValue(row.Tipo, enumMaps.type)
        const courseTypeValue = toEnumValue(row.CourseType, enumMaps.type)
            || (SCHOOL_LEVELS.some((option) => option.value === tipoValue) ? "BasicEducation" : "")
            || (OFFERED_COURSES_TYPE.some((option) => option.value === tipoValue) ? "HigherEducation" : "")
        const normalized = {
            Nome: String(row.Nome ?? "").trim(),
            Curso: String(row.Curso ?? "").trim(),
            Tipo: tipoValue || String(row.Tipo ?? "").trim(),
            CourseType: courseTypeValue,
            Email: String(row.Email ?? "").trim(),
            CPF: toDigitString(row.CPF),
            Periodo: String(row.Periodo ?? "").trim(),
            Nascimento: formatDateToCsv(row.Nascimento),
            CNPJ: toDigitString(row.CNPJ),
            isPartial: toBooleanFlag(row.isPartial),
            Turno: String(row.Turno ?? "").trim(),
            ScholarshipType: toEnumValue(row.ScholarshipType, enumMaps.scholarship),
            ModalityType: toEnumValue(row.ModalityType, enumMaps.modality),
            RName: String(row.RName ?? "").trim(),
            RCPF: toDigitString(row.RCPF),
            RBirthDate: formatDateToCsv(row.RBirthDate),
            REmail: String(row.REmail ?? "").trim(),
            hasResponsible: toBooleanFlag(row.hasResponsible)
        }

        const isEmpty = Object.values(normalized).every((value) => !String(value ?? "").trim())
        if (isEmpty) {
            return null
        }

        REQUIRED_HEADERS.forEach((header) => {
            if (!normalized[header]) {
                errors.push(`Campo obrigatorio: ${header}`)
            }
        })

        if (normalized.Email && !/^\S+@\S+\.\S+$/.test(normalized.Email)) {
            errors.push("Email invalido")
        }

        if (normalized.CPF && normalized.CPF.length !== 11) {
            errors.push("CPF invalido")
        }

        if (normalized.CNPJ && normalized.CNPJ.length !== 14) {
            errors.push("CNPJ invalido")
        }

        if (entityCnpjs.length > 0 && normalized.CNPJ && !entityCnpjs.includes(normalized.CNPJ)) {
            errors.push("CNPJ nao pertence a entidade/filial")
        }

        if (normalized.Periodo && isNaN(Number(normalized.Periodo))) {
            errors.push("Periodo invalido")
        }

        if (!normalized.CourseType) {
            errors.push("CourseType invalido")
        }
        if (!tipoValue) {
            errors.push("Tipo invalido")
        }
        if (!normalized.Turno) {
            errors.push("Turno invalido")
        }
        if (!normalized.ScholarshipType) {
            errors.push("ScholarshipType invalido")
        }
        if (!normalized.ModalityType) {
            errors.push("ModalityType invalido")
        }

        if (normalized.hasResponsible === "1") {
            if (!normalized.RName || !normalized.RCPF || !normalized.RBirthDate || !normalized.REmail) {
                errors.push("Dados do responsavel incompletos")
            }
            if (normalized.RCPF && normalized.RCPF.length !== 11) {
                errors.push("CPF do responsavel invalido")
            }
            if (normalized.REmail && !/^\S+@\S+\.\S+$/.test(normalized.REmail)) {
                errors.push("Email do responsavel invalido")
            }
        } else {
            normalized.RName = ""
            normalized.RCPF = ""
            normalized.RBirthDate = ""
            normalized.REmail = ""
            normalized.hasResponsible = "0"
        }

        return {
            rowIndex,
            normalized,
            errors
        }
    }

    const parseSpreadsheet = async (file) => {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: "array", cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false })

        const headerKeys = rows[0] ? Object.keys(rows[0]) : []
        const headerMap = headerKeys.reduce((acc, header) => {
            const normalized = toNormalizedKey(header)
            const canonical = headerAliases[normalized]
            if (canonical) {
                acc[header] = canonical
            }
            return acc
        }, {})

        const headerErrors = REQUIRED_HEADERS.filter((required) => {
            return !Object.values(headerMap).includes(required)
        }).map((missing) => `Coluna obrigatoria ausente: ${missing}`)

        if (headerErrors.length > 0) {
            return { validRows: [], invalidRows: [], headerErrors }
        }

        const validRows = []
        const invalidRows = []

        rows.forEach((row, index) => {
            const mapped = Object.entries(row).reduce((acc, [key, value]) => {
                const canonical = headerMap[key]
                if (canonical) {
                    acc[canonical] = value
                }
                return acc
            }, {})

            const result = validateRow(mapped, index + 2)
            if (!result) {
                return
            }
            if (result.errors.length > 0) {
                invalidRows.push({
                    line: result.rowIndex,
                    errors: result.errors,
                    preview: result.normalized
                })
            } else {
                validRows.push(result.normalized)
            }
        })

        return { validRows, invalidRows, headerErrors: [] }
    }

    const handleSelectFile = async (e) => {
        const { files } = e.target
        if (!files?.[0]) { return }
        const file = files[0]
        try {
            if (entityCnpjs.length === 0) {
                NotificationService.error({ text: "Carregando dados da entidade. Tente novamente em instantes." })
                return
            }
            setIsParsing(true)
            const result = await parseSpreadsheet(file)
            if (result.headerErrors.length > 0) {
                NotificationService.error({ text: result.headerErrors.join("; ") })
            }
            setParseResult({
                fileName: file.name,
                validRows: result.validRows,
                invalidRows: result.invalidRows,
                headerErrors: result.headerErrors
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        } finally {
            setIsParsing(false)
        }
        e.target.value = ""
    }

    const handleSubmitValidRows = async () => {
        if (parseResult.validRows.length === 0) {
            NotificationService.error({ text: "Nao ha linhas validas para enviar." })
            return
        }
        try {
            setIsLoading(true)
            const csvText = createCsvText(parseResult.validRows)
            const csvFile = new File([csvText], "alunos.csv", { type: "text/csv" })
            const data = new FormData()
            data.append("file", csvFile)
            const information = await studentService.registerNewStudents(data)
            setStudents(information)
            NotificationService.success({ text: `${information?.length ?? 0} alunos adicionados com sucesso` })
            setParseResult({ fileName: "", validRows: [], invalidRows: [], headerErrors: [] })
            await loadImportBatches({ page: 1, status: importStatusFilter })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPreview = () => {
        setParseResult({ fileName: "", validRows: [], invalidRows: [], headerErrors: [] })
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
                    <input type="file" accept=".xlsx,.csv" hidden ref={inputRef} onChange={handleSelectFile} />
                    <ButtonBase label={isParsing ? 'lendo...' : 'enviar'} onClick={() => inputRef.current.click()} />
                </div>
                {parseResult.fileName && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3>Pré-visualizacao da importacao</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                            <span>Arquivo: {parseResult.fileName}</span>
                            <span>Validas: {parseResult.validRows.length}</span>
                            <span>Invalidas: {parseResult.invalidRows.length}</span>
                            <ButtonBase label={'limpar'} onClick={handleResetPreview} />
                            <ButtonBase
                                label={'confirmar envio'}
                                onClick={handleSubmitValidRows}
                                disabled={parseResult.invalidRows.length > 0 || parseResult.validRows.length === 0}
                            />
                        </div>
                        {parseResult.invalidRows.length > 0 && (
                            <Table.Root headers={['linha', 'erros', 'nome', 'cpf', 'email']}>
                                {parseResult.invalidRows.map((row) => (
                                    <Table.Row key={`invalid-${row.line}`}>
                                        <Table.Cell>{row.line}</Table.Cell>
                                        <Table.Cell>{row.errors.join('; ')}</Table.Cell>
                                        <Table.Cell>{row.preview.Nome}</Table.Cell>
                                        <Table.Cell>{row.preview.CPF}</Table.Cell>
                                        <Table.Cell>{row.preview.Email}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Root>
                        )}
                        {parseResult.validRows.length > 0 && (
                            <Table.Root headers={['nome completo', 'periodo', 'curso']}>
                                {parseResult.validRows.slice(0, 10).map((row, index) => (
                                    <Table.Row key={`valid-${index}`}>
                                        <Table.Cell>{row.Nome}</Table.Cell>
                                        <Table.Cell>{row.Periodo}</Table.Cell>
                                        <Table.Cell>{row.Curso}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Root>
                        )}
                    </div>
                )}
                <div>
                    <h3>Confira a lista de alunos enviados</h3>
                    <Table.Root headers={['nome completo', 'período', 'curso']}>
                        {
                            students.map(e => (
                                <Table.Row key={`${e.CPF}-${e.Periodo}-${e.Curso}`}>
                                    <Table.Cell>{e.Nome}</Table.Cell>
                                    <Table.Cell>{e.Periodo}</Table.Cell>
                                    <Table.Cell>{e.Curso}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        <h3>Histórico de importações (.csv)</h3>
                        <select
                            value={importStatusFilter}
                            onChange={(e) => setImportStatusFilter(e.target.value)}
                            style={{ height: '36px' }}
                        >
                            {importStatuses.map((status) => (
                                <option key={status.value || 'all'} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                        <ButtonBase label={'atualizar'} onClick={() => loadImportBatches({ page: batchPagination.page, status: importStatusFilter })} disabled={isLoadingHistory} />
                    </div>
                    {isLoadingHistory && <Loader loading={isLoadingHistory} text={"Carregando histórico de importações"} />}
                    <Table.Root headers={['arquivo', 'status', 'linhas', 'sucesso', 'erro', 'criado em', 'ação']}>
                        {(importBatches.length === 0 && !isLoadingHistory) && (
                            <Table.Row>
                                <Table.Cell>Sem importações registradas</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                            </Table.Row>
                        )}
                        {importBatches.map((batch) => (
                            <Table.Row key={batch.id}>
                                <Table.Cell>{batch.fileName}</Table.Cell>
                                <Table.Cell>{BATCH_STATUS_LABEL[batch.status] ?? batch.status}</Table.Cell>
                                <Table.Cell>{batch.totalRows ?? 0}</Table.Cell>
                                <Table.Cell>{batch.successRows ?? 0}</Table.Cell>
                                <Table.Cell>{batch.errorRows ?? 0}</Table.Cell>
                                <Table.Cell>{batch.createdAt ? new Date(batch.createdAt).toLocaleString('pt-BR') : '-'}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase
                                        label={selectedBatchId === batch.id ? 'selecionado' : 'ver itens'}
                                        onClick={() => setSelectedBatchId(batch.id)}
                                        disabled={selectedBatchId === batch.id}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Root>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                        <ButtonBase
                            label={'anterior'}
                            onClick={() => loadImportBatches({ page: Math.max(1, batchPagination.page - 1), status: importStatusFilter })}
                            disabled={batchPagination.page <= 1 || isLoadingHistory}
                        />
                        <span>Página {batchPagination.page} de {batchPagination.totalPages}</span>
                        <ButtonBase
                            label={'próxima'}
                            onClick={() => loadImportBatches({ page: Math.min(batchPagination.totalPages, batchPagination.page + 1), status: importStatusFilter })}
                            disabled={batchPagination.page >= batchPagination.totalPages || isLoadingHistory}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        <h3>Itens do lote selecionado</h3>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={onlyErrors}
                                onChange={(e) => setOnlyErrors(e.target.checked)}
                            />
                            Somente erros
                        </label>
                        <ButtonBase
                            label={'atualizar itens'}
                            onClick={() => loadBatchItems({ batchId: selectedBatchId, page: itemPagination.page, onlyErrorItems: onlyErrors })}
                            disabled={!selectedBatchId || isLoadingItems}
                        />
                    </div>
                    {!selectedBatchId && <span>Selecione um lote para visualizar os itens.</span>}
                    {isLoadingItems && selectedBatchId && <Loader loading={isLoadingItems} text={"Carregando itens do lote"} />}
                    <Table.Root headers={['linha', 'status', 'erro', 'cpf', 'email']}>
                        {(selectedBatchId && batchItems.length === 0 && !isLoadingItems) && (
                            <Table.Row>
                                <Table.Cell>Nenhum item encontrado</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                                <Table.Cell>-</Table.Cell>
                            </Table.Row>
                        )}
                        {batchItems.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.lineNumber}</Table.Cell>
                                <Table.Cell>{ITEM_STATUS_LABEL[item.status] ?? item.status}</Table.Cell>
                                <Table.Cell>{item.errorMessage || '-'}</Table.Cell>
                                <Table.Cell>{item.candidateCpf || '-'}</Table.Cell>
                                <Table.Cell>{item.candidateEmail || '-'}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Root>
                    {selectedBatchId && (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                            <ButtonBase
                                label={'anterior'}
                                onClick={() => loadBatchItems({ batchId: selectedBatchId, page: Math.max(1, itemPagination.page - 1), onlyErrorItems: onlyErrors })}
                                disabled={itemPagination.page <= 1 || isLoadingItems}
                            />
                            <span>Página {itemPagination.page} de {itemPagination.totalPages}</span>
                            <ButtonBase
                                label={'próxima'}
                                onClick={() => loadBatchItems({ batchId: selectedBatchId, page: Math.min(itemPagination.totalPages, itemPagination.page + 1), onlyErrorItems: onlyErrors })}
                                disabled={itemPagination.page >= itemPagination.totalPages || isLoadingItems}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}