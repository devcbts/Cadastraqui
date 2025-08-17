import fs from 'fs';
import path from 'path';
import { getDocument } from 'pdfjs-dist';
import csv from 'csv-parser';

// Defina o caminho para o worker do PDF.js


function findBankName(bancoCode: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const results: { [key: string]: string } = {};
        fs.createReadStream(path.join(__dirname, 'ParticipantesSTR.csv'))
            .pipe(csv())
            .on('data', (data) => {
                console.log(data['﻿ISPB'])
                results[data['﻿ISPB']] = data.Nome_Extenso;
            })
            .on('end', () => {
                resolve(results[bancoCode] || null);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
async function extractTextFromPdf(pdfPath: string): Promise<string[]> {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await getDocument({ data: new Uint8Array(pdfBytes) }).promise;
    const textArray: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => (item as any).str).join(' ');
        textArray.push(text);
    }

    return textArray;
}
function extractDataFromText(text: string) {
    const nameMatch = text.match(/Nome:\s*(.+?)\s*CPF\/CNPJ:/);
    const cpfCnpjMatch = text.match(/CPF\/CNPJ:\s*([\d\.\-\/]+)/);
    const tableDataMatch = text.match(/Banco ou Instituição\s+Data de início\s+Data de fim\s+([\s\S]+?)(?=\s*(Importante|Relatório))/);
    const name = nameMatch ? nameMatch[1].trim() : null;
    const cpfCnpj = cpfCnpjMatch ? cpfCnpjMatch[1].trim() : null;
    const tableData = tableDataMatch ? tableDataMatch[1].trim() : null;

    const tableRows = tableData ? tableData.split(/(?<=\d) (?=\d)/).map(row => row.trim()).filter(row => row) : [];
        console.log(tableRows);
    const table = tableRows.map(row => {
        const [banco, dataInicio, dataFim] = row.split(/\s{2,}/).map(item => item.trim());
        const bancoCode = banco.split(' ')[0].replace(/\./g, ''); // Extrair o código numérico sem pontuação
        console.log(bancoCode);
        return { banco, bancoCode, dataInicio, dataFim: dataFim || 'N/A' };
    });
    return { name, cpfCnpj, table };
}

export async function processPdf(pdfPath: string) {
    const textArray = await extractTextFromPdf(pdfPath);

   

    // Processar o texto extraído para obter os dados da tabela
    textArray.forEach(text => {
        const { name, cpfCnpj, table } = extractDataFromText(text);

        table.filter(row => row.dataFim === 'N/A').forEach(async row => {
            const bankName = await findBankName(row.bancoCode);
            
            console.log(`Banco: ${row.banco}, Nome Extenso: ${bankName}, Data de Início: ${row.dataInicio}, Data de Fim: ${row.dataFim}`);
        });
    });
}


// Substitua 'path/to/your/file.pdf' pelo caminho para o seu arquivo PDF
processPdf(path.join(__dirname, 'CCS.pdf'));