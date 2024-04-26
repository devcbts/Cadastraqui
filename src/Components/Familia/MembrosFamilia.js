import React, { useEffect, useRef, useState } from "react";
import CadastroFamiliar from "./cadastroFamiliar.js";
import { api } from "../../services/axios.js";
import VerFamiliar from "./verFamiliar.js";
import Select from "react-select";
import LoadingCadastroCandidato from "../Loading/LoadingCadastroCandidato.js";
import "./MembrosFamilia.css";
import Swal from "sweetalert2";

export default function MembrosFamilia() {
  //Visualização de dados

  // Todos os membros da família
  const [membros, setMembros] = useState(null);

  // Decide se vai realizar cadastro ou ver os dados dos membros da familia
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  // Membro selecionado para ver os dados
  const [membroSelecionado, setMembroSelecionado] = useState(null);

  // Ignora isso por enquanto
  const adicionarMembro = (membro) => {
    setMembros([...membros, membro]);
    setMostrarCadastro(false); // Fecha o cadastro após adicionar o membro
  };

  // Só pra mudar a visão de cadastro pra visão de visualização de dados (e vice-versa)
  const toggleCadastro = () => {
    setMostrarCadastro(!mostrarCadastro);
  };

  // Setar o membro selecionado
  const selecionarMembro = (membro) => {
    setMembroSelecionado(membro);
    verFamiliarRef.current.setInfo(membro)
    console.log("====================================");
    console.log(membro);
    console.log("====================================");
  };

  const [len, setLen] = useState(2);
  // UseEffect para pegar os dados dos membros familiares
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
        console.log('MEMBROS', membrosdaFamilia)
        setMembros(membrosdaFamilia);
        if (membrosdaFamilia?.length === 0) {
          setMostrarCadastro(true)
        }
        setMembroSelecionado(membrosdaFamilia[0]);
        setLen(membrosdaFamilia.length);
      } catch (err) {
        alert(err);
      }
    }
    pegarMembros();
  }, []);

  const handleDeleteMember = async (memberId) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    })
    try {

      const isDeleting = result.isConfirmed;
      if (isDeleting) {
        await api.delete('/candidates/family-member', { params: { id: memberId } })


        setMembros((prevState) => [...prevState].filter((e) => e.id !== memberId))
        setMembroSelecionado(null)
      }
    } catch (err) {
      Swal.fire({
        title: 'Erro',
        text: err.response.data.message,
        icon: 'error'
      })
    }
  }
  const verFamiliarRef = useRef(null)

  return (
    <div className="family-add">
      {mostrarCadastro && (
        <CadastroFamiliar onCadastroCompleto={adicionarMembro} />
      )}

      {membros && !mostrarCadastro ? (
        <DropdownMembros membros={membros} onSelect={selecionarMembro} />
      ) : (
        ""
      )}
      {!mostrarCadastro && !!membroSelecionado ? (
        <VerFamiliar familyMember={membroSelecionado} onDelete={handleDeleteMember} ref={verFamiliarRef} />
      ) : !membros && (
        <div>{len == 0 && <LoadingCadastroCandidato />}</div>
      )}

      <button onClick={toggleCadastro} className="over-button">
        {mostrarCadastro ? "Fechar Cadastro" : "Adicionar Membro"}
      </button>
    </div>
  );
}

// Função de ser um dropdown para selecionar os dados dos membros familiares
export const DropdownMembros = ({ membros, onSelect }) => {
  if (membros.length === 0) return null;

  const handleSelect = (selectedOption) => {
    onSelect(selectedOption.membro);

  };

  // Esse options é só pra passar os dados pra cima, então eu decido o label, value e um objeto com os dados totais para passar como argumento pra cima
  const options = membros.map((membro) => ({
    membro: membro,
    value: membro.fullName,
    label: membro.fullName,
  }));
  //Select do react select
  return (
    <Select
      styles={{ container: styles => ({ ...styles, width: '80%', margin: 'auto' }) }}
      options={options}
      onChange={handleSelect}
      getOptionValue={(option) => option.value}
      getOptionLabel={(option) => option.label}
    />
  );
};
