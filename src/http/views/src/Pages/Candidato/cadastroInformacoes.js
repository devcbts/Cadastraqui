import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import MultiStep from "react-multistep";
import "./cadastroInformacoes.css";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { UilAngleRight } from "@iconscout/react-unicons";
import CadastroFamiliar from "../../Components/Familia/cadastroFamiliar";
import MembrosFamilia from "../../Components/Familia/MembrosFamilia";
import Moradia from "../../Components/Moradia/Moradia";
import Veiculo from "../../Components/Veiculo/Veiculo";
export default function CadastroInfo() {
  const nextButton = useRef(null);
  const prevButton = useRef(null);

  function BasicInfoDiv() {
    // React state can be used here if you need to handle form inputs dynamically

    return (
      <div className="fill-box">
        <form id="survey-form">
          <div className="survey-box">
            <label htmlFor="name" id="name-label">
              Nome:
            </label>
            <br />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              className="survey-control"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="name" id="name-label">
              Nome social:
            </label>
            <br />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              className="survey-control"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="name" id="name-label">
              Data de nascimento:
            </label>
            <br />
            <input
              type="date"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              className="survey-control"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="name" id="name-label">
              Sexo
            </label>
            <br />
            <select className="select-data">
              <option>Masculino</option>
              <option>Feminino</option>
            </select>
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nacionalidade
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Cidade:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Unidade federativa
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
              <option value="EX">Estrangeiro</option>
            </select>
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nº de RG:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Orgão emissor:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>
          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Estado do orgão emissor:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
              <option value="EX">Estrangeiro</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Caso queira adicionar outro tipo de documento, selecionar o tipo:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">CPF</option>
              <option value="AL">CNH</option>
              <option value="AL">Certidão de Nascimento</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Número do documento:
            </label>
            <br />
            <input
              type="number"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Data de vencimento
            </label>
            <br />
            <input
              type="date"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Estado civil:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Solteiro{"(a)"}</option>
              <option value="AL">Casado{"(a)"}</option>
              <option value="AL">Separado{"(a)"}</option>
              <option value="AL">Divorciado{"(a)"}</option>
              <option value="AL">Viuvo{"(a)"}</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Cor da pele:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Branca</option>
              <option value="AL">Preta</option>
              <option value="AL">Parda</option>
              <option value="AL">Amarela</option>
              <option value="AL">Indígena</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Religião:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nível de ensino:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Fundamental I</option>
              <option value="AL">Fundamental II</option>
              <option value="AL">Superior incompleto</option>
              <option value="AL">Superior completo</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Necessidades especiais:
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Descrição das necessidades especiais:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Celular:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Telefone:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nome para contato:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Profissão:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Envolvido em program governamental:
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              NIS:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Fonte de renda:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Setor privado</option>
              <option value="AL">Servidor público</option>
              <option value="AL">Empregado doméstico</option>
              <option value="AL">Trabalhador rural temporário</option>
              <option>Dono de empresa com taxação simplificada</option>
              <option>Dono de empresa</option>
              <option>Microempreendedor individual</option>
              <option>Autônomo</option>
              <option>Aposentado</option>
              <option>Pensionista</option>
              <option>Aprendiz</option>
              <option>Voluntário</option>
              <option>Anfitrião de aluguel</option>
              <option>Estudante</option>
              <option>Trabalhador informal</option>
              <option>Desempregado</option>
              <option>Incapacidade temporária</option>
              <option>Profissional liberal</option>
              <option>Ajuda de terceiros</option>
              <option>Auxílio governamental</option>
              <option>Pensão privada</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Mora sozinho?
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Quer concorrer a bolsas?
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Envolvido em program governamental:
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Estudou em escola pública:
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Beneficiado por bolsa básica do CEBAS?
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Anos de recebimento de benefício básico do CEBAS:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Tipo de bolsa básica:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Bolsa integral</option>
              <option value="AL">Bolsa parcial</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nome da instituição:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              CNPJ da instituição:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Beneficiado por bolsa profissional do CEBAS?
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="No"
                className="skill-radio"
              />
              Sim
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="user-skill"
                value="Not sure"
                className="skill-radio"
              />
              Não
            </label>
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Benefício recebido no último ano do CEBAS profissional:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Tipo de bolsa profissional:
            </label>
            <br />
            <select id="estado" className="select-data" name="estado">
              <option value="AC">Bolsa integral</option>
              <option value="AL">Bolsa parcial</option>
            </select>
          </div>

          <div className="survey-box">
            <label htmlFor="age" id="age-label">
              Age <span className="clue">(optional)</span>:
            </label>
            <br />
            <input
              type="number"
              className="survey-control"
              name="age"
              id="age"
              min="10"
              max="99"
              placeholder="Age"
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nome da instituição:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              CNPJ da instituição:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nome da instituição:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>

          <div className="survey-box">
            <label htmlFor="email-id" id="Email-label">
              Nome do curso:
            </label>
            <br />
            <input
              type="text"
              className="survey-control"
              name="email"
              id="email-id"
              placeholder="Email-ID"
              required
            />
          </div>
        </form>
      </div>
    );
  }

  function FamilyInfoDiv() {
    return (
      <div>
        <MembrosFamilia/>
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div >
        <Moradia/>
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div >
        <Veiculo/>
      </div>
    );
  }

  function EarningInfoDiv() {
    const [isSubscribed, setSubscribed] = useState(null);

    useEffect(() => {
      if (isSubscribed === "no") {
        document.getElementById("nis-input").disabled = true;
      } else {
        document.getElementById("nis-input").disabled = false;
      }
    }, [isSubscribed]);

    return (
      <div className="fill-container">
        <div className="input-cadastro title question">
          <h2>5. Inscrito em programas de transferência de renda? </h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro input-secondary">
          <input
            type="radio"
            name="gov-program"
            value="yes"
            onClick={() => setSubscribed("yes")}
          />
          Sim
          <input
            type="radio"
            name="gov-program"
            value="no"
            onClick={() => setSubscribed("no")}
          />
          Não
        </div>
        <div className="input-cadastro">
          <input type="text" id="nis-input" placeholder="Se sim, informe NIS" />
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro input-dropbox">
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-privado"
            />
            Empregado privado (CLT)
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-publico"
            />
            Empregado público
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-domestico"
            />
            Empregado doméstico
          </div>
          <div>
            <input type="radio" name="employmentType" value="empregado-rural" />
            Empregado temporário na área rural
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empresario-simples"
            />
            Empresário (Simples Nacional)
          </div>
          <div>
            <input type="radio" name="employmentType" value="empresario" />
            Empresário
          </div>
          <div>
            <input type="radio" name="employmentType" value="mei" />
            MEI
          </div>
          <div>
            <input type="radio" name="employmentType" value="autonomo" />
            Autônomo (conta-própria)
          </div>
          <div>
            <input type="radio" name="employmentType" value="aposentado" />
            Aposentado
          </div>
          <div>
            <input type="radio" name="employmentType" value="pensionista" />
            Pensionista
          </div>
          <div>
            <input type="radio" name="employmentType" value="aprendiz" />
            Aprendiz ou estagiário
          </div>
          <div>
            <input type="radio" name="employmentType" value="voluntario" />
            Trabalhador voluntário
          </div>
          <div>
            <input type="radio" name="employmentType" value="renda-aluguel" />
            Renda de aluguéis ou arrendamento
          </div>
          <div>
            <input type="radio" name="employmentType" value="estudante" />
            Estudante
          </div>
          <div>
            <input type="radio" name="employmentType" value="informal" />
            Trabalhador informal
          </div>
          <div>
            <input type="radio" name="employmentType" value="desempregado" />
            Desempregado
          </div>
          <div>
            <input type="radio" name="employmentType" value="desempregado" />
            Desempregado
          </div>
          <div>
            <input type="radio" name="employmentType" value="auxilio-doenca" />
            Auxílio doença
          </div>
          <div>
            <input type="radio" name="employmentType" value="prof-liberal" />
            Profissional Liberal
          </div>
          <div>
            <input type="radio" name="employmentType" value="ajuda-terceiros" />
            Ajuda Financeira de Terceiros
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="pensao-alimenticia"
            />
            Pensão alimentícia
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="pensao-alimenticia"
            />
            Pensão alimentícia
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="previdencia-privada"
            />
            Previdência Privada
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="previdencia-privada"
            />
            Previdência Privada
          </div>
        </div>
      </div>
    );
  }

  function BudgetInfoDiv() {
    return (
      <div className="fill-container">
        <h1>6</h1>
      </div>
    );
  }

  function HealthInfoDiv() {
    return (
      <div className="fill-container">
        <h1>7</h1>
      </div>
    );
  }

  function DeclarationsInfoDiv() {
    return (
      <div className="fill-container">
        <h1>8</h1>
      </div>
    );
  }

  function DocumentsInfoDiv() {
    return (
      <div className="fill-container">
        <h1>8</h1>
      </div>
    );
  }

  return (
    <div className="container-cadastro-candidato">
      <div className="upper-cadastro-candidato">
        <h1>CADASTRO</h1>
        <h1>PREENCHA SEUS DADOS</h1>
      </div>
      <div className="container-info">
        <MultiStep
          activeStep={0}
          className="multi-step"
          stepCustomStyle={{
            fontSize: 0.8 + "rem",
          }}
          prevButton={{
            title: "<",
            style: {
              width: 3 + "rem",
              marginTop: 1 + "rem",
              borderWidth: 0,
              fontSize: 2 + "rem",
              backgroundColor: "white",
            },
          }}
          nextButton={{
            title: ">",
            style: {
              width: 3 + "rem",
              borderWidth: 0,
              fontSize: 2 + "rem",
              backgroundColor: "white",
            },
          }}
        >
          <BasicInfoDiv title="Básico"></BasicInfoDiv>
          <FamilyInfoDiv title="Família"></FamilyInfoDiv>
          <HousingInfoDiv title="Moradia"></HousingInfoDiv>
          <VehicleInfoDiv title="Veículo"></VehicleInfoDiv>
          <EarningInfoDiv title="Renda"></EarningInfoDiv>
          <BudgetInfoDiv title="Despesas"></BudgetInfoDiv>
          <HealthInfoDiv title="Saúde"></HealthInfoDiv>
          <DeclarationsInfoDiv title="Declarações"></DeclarationsInfoDiv>
          <DocumentsInfoDiv title="Documentos"></DocumentsInfoDiv>
        </MultiStep>
      </div>
    </div>
  );
}
