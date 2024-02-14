import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../../services/axios.js";
import CadastroDespesas from "./cadastroDespesas.js";
import VerDespesas from "./verDespesas.js";

export default function DespesasMensais() {
  const [expensesInstances, setExpensesInstances] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  const toggleCadastro = () => {
    setMostrarCadastro(!mostrarCadastro);
  };

  useEffect(() => {
    async function pegarDespesas() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/candidates/expenses", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setExpensesInstances(response.data.expenses);
        if (response.data.expenses.length > 0) {
          setSelectedExpense(response.data.expenses[0]);
        }
      } catch (err) {
        alert(err);
      }
    }
    pegarDespesas();
  }, [mostrarCadastro]); // Adicionado mostrarCadastro como dependência

  const handleSelectChange = (selectedOption) => {
    setSelectedExpense(selectedOption.value);
  };

  return (
    <div>
      {mostrarCadastro && <CadastroDespesas />}

      {!mostrarCadastro && expensesInstances.length < 3 && (
        <button className="budget-btn" onClick={toggleCadastro}>
          Adicionar Despesa
        </button>
      )}

      {!mostrarCadastro && expensesInstances.length > 0 && (
        <div>
          <h2>Selecione a Despesa</h2>
          <Select
            options={expensesInstances.map((expense, index) => ({
              value: expense,
              label: `Despesa ${index + 1}`,
            }))}
            onChange={handleSelectChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </div>
      )}

      {!mostrarCadastro && selectedExpense && (
        <VerDespesas formData={selectedExpense} />
      )}
    </div>
  );
}
