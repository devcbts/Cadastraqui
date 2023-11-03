import React from "react";
import { useNavigate, useParams } from "react-router";
import NavBarAssistente from "../../Components/navBarAssistente";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './estatisticas.css'
import DadosBox from "../../Components/dadosBox";
import { Link } from "react-router-dom";


const PieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
];

const COLORS = ['#0088FE', '#FF8042'];

const LineData = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
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
          <h1>Editais - Unifei 2023.1</h1>
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
          <h2>Gráfico de Pizza</h2>
          <div className="pie-container">
            <div className="pie-box">

              <PieChart width={300} height={300}>
                <Pie
                  data={PieData}
                  cx={150}
                  cy={150}
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

              </PieChart>
            </div>
            <div className="pie-box">
              <PieChart width={300} height={300}>
                <Pie
                  data={PieData}
                  cx={150}
                  cy={150}
                  innerRadius={0}
                  outerRadius={100}
                  fill=""
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {PieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

              </PieChart>

            </div>
            <div className="pie-box">

              <PieChart width={300} height={300}>
                <Pie
                  data={PieData}
                  cx={150}
                  cy={150}
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

              </PieChart>
            </div>
          </div>
          <h2>Gráfico de Linha</h2>
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pv" stroke="#0088FE" activeDot={{ r: 8 }} />
              </LineChart>
            </div>

            <div className="pie-box">

              <PieChart width={300} height={300}>
                <Pie
                  data={PieData}
                  cx={150}
                  cy={150}
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

              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
