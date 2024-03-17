import React, { useState, useEffect } from "react";
import "./cadastroVeiculo.css";
import Select from "react-select";
import { api } from "../../services/axios";
import InputCheckbox from "../Inputs/InputCheckbox";
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
export default function VerVeiculo({ initialFormData, candidate }) {
  // Edição de dados!
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setFormData(initialFormData);
    setIsEditing(false);
  }, [initialFormData]);

  const toggleEdit = () => {
    if (!isEditing) {
      // Atualiza formData com os IDs dos proprietários selecionados quando entra em modo de edição
      const selectedOwnerIds = opcoes
        .filter(
          (option) =>
            formData.ownerNames.includes(option.label) ||
            option.value === formData.candidate_id
        )
        .map((option) => option.value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        // Assumindo que 'owners_id' é o campo que estamos tentando atualizar
        owners_id: selectedOwnerIds,
      }));
    }

    setIsEditing(!isEditing);
  };

  console.log("====================================");
  console.log(formData);
  console.log("====================================");
  const [membros, setMembros] = useState([]);
  const [candidato, setCandidato] = useState({
    id: candidate.id,
    nome: candidate.name,
  });

  // Combine as opções de membros da família e candidato
  const opcoes = [
    ...membros.map((m) => ({ value: m.id, label: m.fullName, type: "family" })),
    { value: candidato.id, label: candidato.nome, type: "candidate" },
  ];

  // Atualiza o estado do formulário quando um input className='survey-control' muda
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue =
      name === "manufacturingYear" ||
      name === "financedMonths" ||
      name === "monthsToPayOff" ||
      name === "insuranceValue"
        ? Number(value)
        : type === "checkbox"
        ? checked
        : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    // Filtra para membros da família
    const owners = selectedOptions
      .filter((option) => option.type === "family")
      .map((option) => option.value);
    // Verifica se o candidato foi selecionado
    const candidate = selectedOptions.find(
      (option) => option.type === "candidate"
    )?.value;
    setFormData({
      ...formData,
      owners_id: owners,
      candidate_id: candidate || "",
    });
  };

  // Envia o formulário para o servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você incluiria a lógica para enviar os dados para o servidor
    console.log(formData);

    const token = localStorage.getItem("token");
    try {
      const { ownerNames, FamilyMemberToVehicle, ...formDataToSend } = formData;
      console.log(formDataToSend);
      const response = await api.patch(
        "/candidates/vehicle-info",
        formDataToSend,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
      alert("Registro criado com sucesso");
      setIsEditing(false); // Desabilitar edição ao enviar

      // Lógica para enviar os dados atualizados para o servidor
      console.log("Dados enviados:", formData);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("====================================");
  console.log(opcoes);
  console.log("====================================");
  useEffect(() => {
    async function pegarMembros() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/candidates/family-member", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
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
            options={opcoes}
            className="survey-select"
            isDisabled={!isEditing}
            onChange={handleSelectChange}
            value={opcoes.filter(
              (option) =>
                formData.ownerNames.includes(option.label) ||
                option.value === formData.candidate_id
            )}
          />
        </div>
        <div className="survey-box">
          <label>Tipo de Veículo:</label>
          <br />
          <select
            name="vehicleType"
            value={formData.vehicleType}
            disabled={!isEditing}
            onChange={handleChange}
            required
            class="select-data"
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
            onChange={handleChange}
            required
            class="select-data"
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
                disabled={!isEditing}
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
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="survey-box survey-check">
          <label>Possui Seguro?</label>
          <br />

          <InputCheckbox
          id="hasInsurance"
            className="survey-control"
            type="checkbox"
            name="hasInsurance"
            value={formData.hasInsurance}
            disabled={!isEditing}
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
              disabled={!isEditing}
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
            disabled={!isEditing}
            onChange={handleChange}
            required
            class="select-data"
          >
            {VehicleUsage.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="survey-box">
          {!isEditing ? (
            <button type="button" className="over-button" onClick={toggleEdit}>
              Editar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="over-button"
                onClick={handleSubmit}
              >
                Salvar Dados
              </button>
              <button
                type="button"
                className="over-button"
                onClick={toggleEdit}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
