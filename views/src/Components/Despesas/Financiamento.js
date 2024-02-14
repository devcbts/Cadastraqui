import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../../services/axios.js";
import CadastroFinanciamento from "./cadastroFinanciamento";
import VerFinanciamento from "./verFinanciamento";

export default function Financiamento() {
  const [financingsInstances, setFinancingsInstances] = useState([]);
  const [selectedFinancing, setSelectedFinancing] = useState(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  useEffect(() => {
    async function pegarFinanciamentos() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/candidates/expenses/financing", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("====================================");
        console.log(response.data.financings);
        console.log("====================================");
        setFinancingsInstances(
          response.data.financings.map((financing) => ({
            value: financing.id,
            label: financing.familyMemberName,
            financing: financing,
          }))
        );
        if (response.data.financings.length > 0) {
          setSelectedFinancing(response.data.financings[0]);
        }
      } catch (err) {
        alert(err);
      }
    }
    pegarFinanciamentos();
  }, [mostrarCadastro]);

  const handleSelectChange = (selectedOption) => {
    setSelectedFinancing(selectedOption.financing);
  };

  const toggleCadastro = () => {
    setMostrarCadastro(!mostrarCadastro);
  };

  return (
    <div>
      {!mostrarCadastro && financingsInstances && (
        <Select
          options={financingsInstances}
          onChange={handleSelectChange}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      )}
      {mostrarCadastro ? (
        <CadastroFinanciamento />
      ) : (
        selectedFinancing && <VerFinanciamento formData={selectedFinancing} />
      )}

      <button className="budget-btn" onClick={toggleCadastro}>
        {mostrarCadastro ? "Fechar Cadastro" : "Cadastrar Financiamento"}
      </button>
    </div>
  );
}
