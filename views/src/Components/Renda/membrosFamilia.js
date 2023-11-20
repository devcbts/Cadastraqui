import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import { CadastroRenda } from "../cadastro-renda";

export default function MembrosFamiliaRenda() {
  // ... outros estados e funções
  const [membros, setMembros] = useState([])
  const [membroSelecionado, setMembroSelecionado] = useState(null)
  

  const [registroDeRendaVisivel, setRegistroDeRendaVisivel] = useState(false)
  const [membroParaRegistroDeRenda, setMembroParaRegistroDeRenda] = useState(null)

  const exibirFormularioDeRegistroDeRenda = (membro) => {
    setMembroParaRegistroDeRenda(membro);
    setRegistroDeRendaVisivel(true);
  };

  const selecionarMembro = (membro) => {
    setMembroSelecionado(membro);
    setMembroParaRegistroDeRenda(membro)
    console.log('====================================');
    console.log(membro);
    console.log('====================================');
  }


  useEffect(() => {
    async function pegarMembros() {
        const token = localStorage.getItem('token');
        try {

            const response = await api.get("/candidates/family-member", {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');
            const membrosdaFamilia = response.data.familyMembers
            setMembros(membrosdaFamilia)
            setMembroSelecionado(membrosdaFamilia[0])
        }
        catch (err) {
            alert(err)
        }
    }
    pegarMembros()
    
},[])

  return (
    <div>
      {/* ... restante do código */}
      {membros? <DropdownMembros membros={membros} onSelect={selecionarMembro}/> : ''}
      {/*membros.map((membro) => (
        <div key={membro.id}>
          <p>{membro.fullName}</p>
          <button onClick={() => exibirFormularioDeRegistroDeRenda(membro)}>
            Registrar Renda
          </button>
        </div>
      ))*/}

      {membroParaRegistroDeRenda && (
        <CadastroRenda membro={membroParaRegistroDeRenda} />
      )}
    </div>
  );
}


const DropdownMembros = ({ membros, onSelect }) => {
  if (membros.length === 0) return null;
  
  const handleSelect = (event) => {
      const selectedMembro = membros.find(m => m.fullName === event.target.value);
      console.log('====================================');
      console.log(selectedMembro);
      console.log('====================================');
      onSelect(selectedMembro);
  };

  return (
      <div>
          <select onChange={handleSelect}>
          <option>Escolha o Membro da Família</option>
              {membros.map((membro, index) => (
                  <option key={index} value={membro.fullName}>
                      {membro.fullName}
                  </option>
              ))}
          </select>
      </div>
  );
};