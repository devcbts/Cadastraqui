import React from "react";
import { useNavigate, useParams } from "react-router";
import NavBarAssistente from "../../Components/navBarAssistente";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './estatisticas.css'
import DadosBox from "../../Components/dadosBox";
import { Link } from "react-router-dom";


const PieData = [
  { name: 'Masculino', value: 35000 },
  { name: 'Feminino', value: 15000 },
];

const COLORS = [
  '#0088FE', // Azul
  '#FF8042', // Laranja
  '#00C49F', // Verde-água
  '#FFBB28', // Amarelo
  '#A4DE6C', // Verde Claro
  '#8884D8', // Roxo
  '#83A6ED', // Azul Claro
  '#8DD1E1', // Ciano
  '#82CA9D', // Verde
  '#A4A4A4', // Cinza
];

const LineData = [
  { day: 'Dia 1', InscricoesDiarias: 5000, InscricoesTotais: 5000 },
  { day: 'Dia 2', InscricoesDiarias: 4500, InscricoesTotais: 9500 },
  { day: 'Dia 3', InscricoesDiarias: 5500, InscricoesTotais: 15000 },
  { day: 'Dia 4', InscricoesDiarias: 6000, InscricoesTotais: 21000 },
  { day: 'Dia 5', InscricoesDiarias: 4000, InscricoesTotais: 25000 },
  { day: 'Dia 6', InscricoesDiarias: 3500, InscricoesTotais: 28500 },
  { day: 'Dia 7', InscricoesDiarias: 3000, InscricoesTotais: 31500 },
  { day: 'Dia 8', InscricoesDiarias: 4500, InscricoesTotais: 36000 },
  { day: 'Dia 9', InscricoesDiarias: 7000, InscricoesTotais: 43000 },
  { day: 'Dia 10', InscricoesDiarias: 7000, InscricoesTotais: 50000 },
];

const AgeData = [
  { name: '0-17', value: 10000 },
  { name: '18-24', value: 8000 },
  { name: '25-34', value: 12000 },
  { name: '35-44', value: 7000 },
  { name: '45-59', value: 6000 },
  { name: '60+', value: 4000 },
];

const IncomeData = [
  { name: 'Sem renda', value: 5000 },
  { name: 'Até R$1.500', value: 10000 },
  { name: 'R$1.501 - R$3.000', value: 8000 },
  { name: 'R$3.001 - R$4.500', value: 6000 },
  { name: 'R$4.501 - R$6.000', value: 4000 },
  { name: '>R$6.000', value: 2000 },
];

export default function Estatisticas() {

  const announcement_id = useParams()

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>
      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editais - USP 2024.1</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">Extrair PDF</a>
            <a className="btn-cadastro"><Link className="btn-cadastro" to={`/assistente/cadastrados/${announcement_id.announcement_id}`}>Voltar</Link></a>
          </div>
        </div>
        <h1 className="title-thin">Estatísticas</h1>
        <div>
          <div className="dados-container">
            <DadosBox value="50.000" text="Inscritos" />
            <DadosBox value="50.000" text="Inscritos" />
            <DadosBox value="50.000" text="Inscritos" />
          </div>
          <h2>Gráficos</h2>
          <div className="pie-container">
            <div className="pie-box">
            <h3>Distribuição de gênero</h3>

              <PieChart width={350} height={350}>
                <Pie
                  data={PieData}
                  cx={175}
                  cy={155}
                  innerRadius={0}
                  outerRadius={100}
                  fill="white"
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                  label

                >
                  {PieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={36} />

              </PieChart>
            </div>
            <div className="pie-box">
              <h3>Faixa etária</h3>
              <PieChart width={350} height={350}>
                <Pie
                  data={AgeData}
                  cx={175}
                  cy={155}
                  innerRadius={0}
                  outerRadius={100}
                  fill=""
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {AgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={36} />
              </PieChart>

            </div>
            <div className="pie-box">
            <h3>Faixa de Renda</h3>

              <PieChart width={350} height={350}>
                <Pie
                  data={IncomeData}
                  cx={175}
                  cy={165}
                  innerRadius={0}
                  outerRadius={100}
                  fill="white"
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                  label

                >
                  {IncomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={50}  iconSize={10}/>

              </PieChart>
            </div>
          </div>
          <div className="pie-container">

            <div className="line-box">

              <LineChart
                width={700}
                height={300}
                data={LineData}
                margin={{
                  top: 10, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="InscricoesDiarias" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="InscricoesTotais" stroke="#82ca9d" activeDot={{ r: 8 }} />
                <Legend verticalAlign="top" height={30} />

              </LineChart>
            </div>

            <div className="pie-box">

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
