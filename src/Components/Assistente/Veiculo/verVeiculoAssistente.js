import React, { useState, useEffect } from "react";
import "./verVeiculoAssistente.css";
import Select from "react-select";
import { api } from "../../../services/axios";
const VehicleType = [
  { value: "SmallCarsAndUtilities", label: "Carros Pequenos e Utilitários" },
  { value: "TrucksAndMinibuses", label: "Caminhões e Vans" },
  { value: "Motorcycles", label: "Motocicletas" },
];

const VehicleSituation = [
  { value: "PaidOff", label: "Quitado" },
  { value: "Financed", label: "Financiado" },
];

const VehicleUsage = [
  { value: "WorkInstrument", label: "Instrumento de Trabalho" },
  { value: "NecessaryDisplacement", label: "Deslocamento Necessário" },
];
// Componente de formulário para registrar informações do veículo
export default function VerVeiculoAssistente({ formData, id }) {
  const [membros, setMembros] = useState([]);

  // Atualiza o estado do formulário quando um input className='survey-control' muda
  const handleChange = (e) => { };

  const handleSelectChange = (selectedOptions) => { };

  // Envia o formulário para o servidor
  const handleSubmit = async (e) => { };

  useEffect(() => {
    async function pegarMembros() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/family-member/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        ;
        ;
        ;
        const membrosdaFamilia = response.data.familyMembers;
        setMembros(membrosdaFamilia);
      } catch (err) {
        alert(err);
      }
    }
    pegarMembros();
  }, []);

  return (
    <div className="fill-box">
      <form onSubmit={handleSubmit} id="survey-form">
        <div className="box-select">
          <label>Proprietários</label>
          <br />
          <Select
            isMulti
            name="owners_id"
            options={membros.map((membro) => ({
              value: membro.id,
              label: membro.fullName, // Substitua 'nome' pela propriedade que contém o nome do membro da família
            }))}
            className="survey-select"
            onChange={handleSelectChange}
            value={membros
              .filter((membro) => formData.ownerNames.includes(membro.fullName))
              .map((membro) => ({
                value: membro.id,
                label: membro.fullName, // Substitua 'nome' pela propriedade que contém o nome do membro da família
              }))}
          />
        </div>
        <div className="survey-box">
          <label>Tipo de Veículo:</label>
          <br />
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="select-data"
          >
            <option value="">Selecione</option>
            {VehicleType.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="survey-box">
          <label>Modelo e Marca:</label>
          <br />

          <input
            className="survey-control"
            type="text"
            name="modelAndBrand"
            value={formData.modelAndBrand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="survey-box">
          <label>Ano de Fabricação:</label>
          <br />

          <input
            className="survey-control"
            type="number"
            name="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="survey-box">
          <label>Situação do Veículo:</label>
          <br />

          <select
            name="situation"
            value={formData.situation}
            onChange={handleChange}
            required
            className="select-data"
          >
            {VehicleSituation.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Renderiza condicionalmente campos adicionais se o veículo estiver financiado */}
        {formData.situation === "Financed" && (
          <>
            <div className="survey-box">
              <label>Meses Financiados:</label>
              <br />

              <input
                className="survey-control"
                type="number"
                name="financedMonths"
                value={formData.financedMonths}
                onChange={handleChange}
              />
            </div>
            <div className="survey-box">
              <label>Meses para Quitação:</label>
              <br />

              <input
                className="survey-control"
                type="number"
                name="monthsToPayOff"
                value={formData.monthsToPayOff}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="survey-box survey-check">
          <label>Possui Seguro?</label>
          <br />

          <input
            className="survey-control"
            type="checkbox"
            name="hasInsurance"
            checked={formData.hasInsurance}
            onChange={handleChange}
          />
        </div>

        {/* Renderiza condicionalmente o campo de valor do seguro se o seguro estiver marcado */}
        {formData.hasInsurance && (
          <div className="survey-box">
            <label>Valor do Seguro:</label>
            <br />

            <input
              className="survey-control"
              type="number"
              name="insuranceValue"
              value={formData.insuranceValue}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="survey-box">
          <label>Uso do Veículo:</label>
          <br />

          <select
            name="usage"
            value={formData.usage}
            disabled
            onChange={handleChange}
            required
            className="select-data"
          >
            {VehicleUsage.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
