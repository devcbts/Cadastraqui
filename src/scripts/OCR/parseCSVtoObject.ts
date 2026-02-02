import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function parseCsvToObject(csvPath: string): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
        const result: { [key: string]: any } = {};

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
                const ispb = data['﻿ISPB'];
                if (ispb) {
                    result[ispb] = {
                        Nome_Reduzido: data['Nome_Reduzido'],
                        Número_Código: data['Número_Código'],
                        Participa_da_Compe: data['Participa_da_Compe'],
                        Acesso_Principal: data['Acesso_Principal'],
                        Nome_Extenso: data['Nome_Extenso'],
                        Início_da_Operação: data['Início_da_Operação'],
                    };
                }
            })
            .on('end', () => {
                resolve(result);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Caminho para o arquivo CSV
const csvPath = path.join(__dirname, 'ParticipantesSTR.csv');

// Caminho para o arquivo JSON de saída
const jsonPath = path.join(__dirname, 'ParticipantesSTR.json');

// Executar o parser
parseCsvToObject(csvPath)
    .then((data) => {
        // Escrever os dados no arquivo JSON
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Dados do CSV foram salvos como JSON em:', jsonPath);
    })
    .catch((error) => {
        console.error('Erro ao processar o CSV:', error);
    });