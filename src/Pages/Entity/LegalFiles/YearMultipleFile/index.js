import { ReactComponent as NewDocument } from 'Assets/icons/fileCirclePlus.svg';
import CustomFilePicker from 'Components/CustomFilePicker';
import { useState } from "react";
import DocumentGridView from '../DocumenUpload/DocumentGridView';
import YearGrid from "../YearGrid";

export default function YearMultipleFile({
    documents = [],
    onAdd,
    onUpdate,
}) {
    const [selectedYear, setSelectedYear] = useState(null)
    return (
        <div>
            <YearGrid
                container={{ onClick: setSelectedYear }}
                render={(year) => <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <strong>{year}</strong>
                        <CustomFilePicker
                            children={<NewDocument height={20} />}
                            onUpload={(files) => onAdd(files, selectedYear)}
                            multiple
                        />

                    </div>
                    <span>Ver arquivos</span>
                </div>}
            />
            <h1>{selectedYear}</h1>
            {selectedYear && <div>
                <DocumentGridView
                    documents={documents.filter(x => x.fields?.year === selectedYear)}
                    onUpdate={onUpdate}
                    title={'Arquivo'}
                    columns={6}
                />

            </div>}
        </div>
    )
}