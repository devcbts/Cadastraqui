import { pdf } from "@react-pdf/renderer";
import { ReactComponent as Error } from 'Assets/icons/error.svg';
import ButtonBase from "Components/ButtonBase";
import DataTable from "Components/DataTable";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import Tooltip from "Components/Tooltip";
import useControlForm from "hooks/useControlForm";
import { useEffect, useMemo, useState } from "react";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import { formatCPF } from "utils/format-cpf";
import { formatCurrency } from "utils/format-currency";
import { z } from "zod";
import MonthlyReportPdf from "./MonthlyReportPdf";
export default function PreMonthlyReportPdf({
    docFields = [],
    onSign = async ({ year, month, blob }) => { }
}) {
    const currentYear = new Date().getFullYear()
    const [data, setData] = useState({
        scholarships: [],
        entity: {},
        socialAssistant: {}
    })
    const { control, watch, getValues, reset, handleSubmit } = useControlForm({
        schema: z.object({
            period: z.object({
                year: z.string().refine(v => (/^\d+$/.test(v.trim()) && Number(v) <= currentYear), `Não pode ser maior que ${currentYear}`)
                    .transform(Number),
                month: z.string()
                    .refine(v => (/^\d+$/.test(v.trim()) && Number(v) <= 12 && Number(v) >= 1), 'Deve estar entre 1 e 12')
                    .transform(Number)
            }),
            scholarships: z.array(z.object({
                familiarGroup: z.string().default(""),
                scholarship: z.string().default(""),
                newScholarshipStatus: z.string().default("")
            }).passthrough().superRefine((data, ctx) => {
                if (data.scholarship && !data.newScholarshipStatus) {
                    ctx.addIssue({
                        message: 'Obrigatório',
                        path: ['newScholarshipStatus']
                    })
                }
            }).transform(data => ({
                ...data,
                newScholarshipStatus: !!data.scholarship ? data.newScholarshipStatus : ""
            })))
        }),
        defaultValues: { period: { year: "", month: "" }, scholarships: [] }
    })

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await entityService.getLegalMonthlyReportResume()
                setData(response)
            } catch (err) {
                NotificationService.error({
                    text: err?.response?.data?.message
                })
            }
        }
        fetch()
    }, [])
    useEffect(() => {
        const initialData = localStorage.getItem('monthly-report')
        let merge = initialData ? JSON.parse(initialData) : {}
        if (!merge.scholarships) {
            merge.scholarships = data?.scholarships
            console.log(merge)
        } else {
            data.scholarships.forEach(e => {
                if (!merge?.scholarships.some(x => x.id === e.id)) {
                    merge?.scholarships.push(e)
                }
            })
        }
        reset({ ...merge })

        const id = setInterval(() => {
            localStorage.setItem('monthly-report', JSON.stringify(getValues()))
        }, 5000)
        return () => {
            clearInterval(id)
        }
    }, [data.scholarships])
    const generateFile = async () => {
        const period = getValues("period")
        const scholarships = getValues("scholarships")
        const blob = await pdf(<MonthlyReportPdf
            period={period}
            scholarships={scholarships}
            entity={data.entity}
            socialAssistant={data.socialAssistant}
        />).toBlob()
        const url = URL.createObjectURL(blob)
        return { url, blob }
    }
    const handleGenerate = async () => {
        const { url } = await generateFile()
        window.open(url, '_blank')
    }
    const handleSign = async (v) => {
        const { period } = v
        const { blob } = await generateFile()
        await onSign({
            ...period,
            blob
        })

    }
    const columns = useMemo(() => [
        { accessorKey: 'candidateCPF', header: 'CPF do bolsista', cell: (info) => <strong>{formatCPF(info.getValue())}</strong> },
        { accessorKey: 'ScholarshipCode', header: 'Código do bolsista no censo', cell: (info) => <strong>{info.getValue()}</strong> },
        { accessorKey: 'perCapita', header: 'Renda mensal per capita apurada neste mês', cell: (info) => <strong>{formatCurrency(info.getValue())}</strong> },
        {
            id: 'familiarGroup', header: 'Houve alteração quantitativa no grupo familiar?', cell: ({ row }) => {
                return <InputForm
                    control={control}
                    show={["border"]}
                    name={`scholarships.${row.index}.familiarGroup`}
                />
            }
        },
        {
            id: 'scholarship', header: 'Houve alteração no enquadramento da bolsa de estudo?', cell: ({ row }) => {
                return <InputForm
                    control={control}
                    show={["border"]}
                    name={`scholarships.${row.index}.scholarship`}
                />
            }
        },
        {
            id: 'newScholarshipStatus', header: 'Novo percentual de bolsa de estudo (se necessário)', cell: ({ row }) => {
                const value = watch(`scholarships.${row.index}.scholarship`)

                if (!value) {
                    return null
                }
                return <FormSelect
                    value={watch(`scholarships.${row.index}.newScholarshipStatus`)}
                    options={['50%', '100%'].map(x => ({ value: x, label: x }))}
                    type="text-area"
                    control={control}
                    show="border"
                    name={`scholarships.${row.index}.newScholarshipStatus`}
                />
            }
        },
    ], [])
    const [docAlreadyExist, setDocAlreadyExist] = useState(false)
    useEffect(() => {
        const { unsubscribe } = watch(({ period }) => {
            const x = docFields.some(x => x.year === period.year && x.month === period.month)
            setDocAlreadyExist(x)

        })
        return () => unsubscribe()
    }, [watch])

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignContent: 'center' }}>
        <div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ display: 'flex' }}>Aferição (mês/ano)</strong>
                <div style={{ maxWidth: '300px', display: "inherit", gap: 4 }}>
                    <InputForm control={control} name={"period.month"} type="number" show="border" />
                    <InputForm control={control} name={"period.year"} type="number" show="border" />

                </div>
                {docAlreadyExist && <Tooltip
                    Icon={Error}
                    size={30}
                    tooltip={'Existe um documento associado à esse período. Caso deseje assinar, o antigo será sobrescrito'}
                />}
            </div>
            <DataTable
                serverSide
                data={watch("scholarships")}
                columns={columns}
            />
        </div>
        <div style={{ display: 'flex', gap: 16, }}>
            <ButtonBase label={'Ver documento'} onClick={handleSubmit(handleGenerate)} />
            <ButtonBase label={'Assinar'} onClick={handleSubmit(handleSign)} />
        </div>
    </div>
}