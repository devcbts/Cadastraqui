import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
export default async function searchBolsaFamiliaByNis(request: FastifyRequest, reply:FastifyReply){
    
    const params = z.object({
        nis: z.string()
    })

    const {nis} = params.parse(request.params)
    try {
        const url =`https://api.portaldatransparencia.gov.br/api-de-dados/novo-bolsa-familia-sacado-por-nis?nis=${nis}`
        const headers = {
            'chave-api-dados': process.env.PORTAL_TRANSPARENCIA_KEY
        }
        const response = await axios.get(url, { headers });
        const recebimentos = response.data;

        // Obter a data atual e calcular a data de corte para os últimos 4 meses
        const currentDate = new Date();
        const cutoffDate = new Date();
        cutoffDate.setMonth(currentDate.getMonth() - 4);

        // Filtrar os dados pelos saques mais recentes (últimos 4 meses)
        const filteredRecebimentos = recebimentos.filter((recebimento: any) => {
            const dataSaque = new Date(recebimento.dataSaque);
            return dataSaque >= cutoffDate;
        });

        // Mapear os dados filtrados para incluir o nome do beneficiário e o valor do saque
        const result = filteredRecebimentos.map((recebimento: any) => ({
            nomeBeneficiario: recebimento.beneficiarioBolsaFamilia.nome,
            cpfBeneficiario: recebimento.beneficiarioBolsaFamilia.cpfFormatado,
            dataSaque: recebimento.dataSaque,
            valorSaque: recebimento.valorSaque
        }));

        return reply.status(200).send(result);
    } catch (error) {
        return reply.status(500).send({ message: 'Erro ao buscar dados do Bolsa Família' });

    }
}