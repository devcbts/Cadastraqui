import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PdfPreview({ file }) {

    ;
    ;
    ;
    return (
        <div style={{ height: '750px' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={file} />
            </Worker>
        </div>
    );
}