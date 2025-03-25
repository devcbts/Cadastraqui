import React, { useMemo } from "react"

/**
 * 
 * @param {Object} props
 * @param {any[]} props.documents 
 * @param {(docs: {url:string,path:string,id:string,metadata:any,fields:any,group:string}[], group: string,docType: ENTITY_GROUP_TYPE, index:number)=> React.JSX.Element} props.render 
 * @param {boolean | React.JSX.Element} [props.separator] 
 * @param {ENTITY_GROUP_TYPE[]} props.order 
 * @param {(fields: Object,groupId:string)=>React.JSX.Element} [props.container]
 * @returns 
 */
export default function GroupedDocumentsGrid({
    documents = [],
    render = undefined,
    order = [],
    separator = undefined,
    container = undefined
}) {
    const getInitialOrder = () => order.length === 0 ? {} : Object.fromEntries(order.map(x => ([x, []])))
    const groupedDocuments = useMemo(() => documents.reduce((acc, curr) => {
        const docType = curr.metadata?.document
        if (!acc[curr.group]) {
            acc[curr.group] = getInitialOrder()
        }
        acc[curr.group][docType] = [...acc[curr.group][docType] ?? [], curr]
        return acc
    }, {}), [documents])
    if (documents.length === 0) {
        return <strong style={{ marginTop: '24px' }}>Nenhum documento</strong>
    }
    return (
        <div style={{ display: 'flex', flexDirection: "column", marginTop: '24px', }}>
            {Object.entries(groupedDocuments).map(([group, types], i) => (
                <>
                    {container && <div style={{ marginTop: i > 0 && '24px' }}>
                        {container(Object.values(types)?.[0]?.[0]?.fields, group)}
                    </div>}
                    <div style={{
                        display: 'flex', padding: '12px', marginTop: '8px', borderRadius: 8, backgroundColor: 'white', boxShadow: '0px 0px 8px .1px #999'
                    }}>
                        {Object.entries(types).map(([docType, docs], index) => (
                            <React.Fragment key={docType}>
                                {render(docs, group, docType, index)}
                                {index < Object.values(types).length - 1 && !!separator
                                    ? (typeof separator === 'boolean'
                                        ? <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 10px' }} />
                                        : separator
                                    )
                                    : null
                                }
                            </React.Fragment>
                        ))}
                    </div>
                </>
            ))}
        </div>

    )
}