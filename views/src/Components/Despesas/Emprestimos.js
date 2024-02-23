import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../../services/axios.js";
import CadastroEmprestimo from "./cadastroEmprestimo.js";
import VerEmprestimo from "./verEmprestimos.js"; // Certifique-se de que o nome está correto e é exportável

export default function Emprestimos() {
  const [loansInstances, setLoansInstances] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  useEffect(() => {
    async function pegarDespesas() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/candidates/expenses/loan", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setLoansInstances(
          response.data.loans.map((loan) => ({
            value: loan.id,
            label: loan.familyMemberName,
            loan: loan,
          }))
        );
        if (response.data.loans.length > 0) {
          setSelectedLoan(response.data.loans[0]);
        }
      } catch (err) {
        alert(err);
      }
    }
    pegarDespesas();
  }, [mostrarCadastro]);

  const handleSelectChange = (selectedOption) => {
    setSelectedLoan(selectedOption.loan);
  };

  const toggleCadastro = () => {
    setMostrarCadastro(!mostrarCadastro);
  };

  return (
    <div>
      {!mostrarCadastro && loansInstances && (
        <Select
          options={loansInstances}
          onChange={handleSelectChange}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      )}
      {mostrarCadastro ? (
        <CadastroEmprestimo />
      ) : (
        selectedLoan && <VerEmprestimo formDataInfo={selectedLoan} />
      )}

      <button className="budget-btn" onClick={toggleCadastro}>
        {mostrarCadastro ? "Fechar Cadastro" : "Cadastrar Empréstimo"}
      </button>
    </div>
  );
}
