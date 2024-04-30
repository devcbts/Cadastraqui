import React from "react";
import universityLogo from "../Assets/usp-logo.png";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "./colaboracao.css";
import { api } from "../services/axios";
const MySwal = withReactContent(Swal)

export default function Colaboracao(props) {

  const handleEdit = () => {
    MySwal.fire({
      title: 'Editar Informações',
      html: (
        <div>
          <h2>Endereço</h2>
          <input id="swal-input-address" className="swal2-input" defaultValue={props.address} placeholder="Endereço" />
          <h2>CEP</h2>
          <input id="swal-input-cep" className="swal2-input" defaultValue={props.CEP} placeholder="CEP" />
          <h2>Razão Social</h2>
          <input id="swal-input-socialReason" className="swal2-input" defaultValue={props.name} placeholder="Razão Social" />
          <h2>Códico e-Mec/Educasenso</h2>

          <input id="swal-input-educationalInstitutionCode" className="swal2-input" defaultValue={props.educationalInstitutionCode} placeholder="Código Instituição Educacional" />
        </div>
      ),
      focusConfirm: false,
      preConfirm: () => {
        const address = document.getElementById('swal-input-address').value;
        const CEP = document.getElementById('swal-input-cep').value;
        const socialReason = document.getElementById('swal-input-socialReason').value;
        const educationalInstitutionCode = document.getElementById('swal-input-educationalInstitutionCode').value;

        // Aqui você pode adicionar mais campos conforme necessário
        const updatedInfo = { address, CEP, socialReason, educationalInstitutionCode };
        // Chamar função de atualização aqui
        const token = localStorage.getItem('token');
        api.patch(`entities/subsidiary/${props.id}`,  updatedInfo , {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
          .then(response => {
            MySwal.fire('Atualizado!', 'As informações foram atualizadas com sucesso.', 'success');
          })
          .catch(error => {
            MySwal.fire('Erro!', 'Houve um erro ao atualizar as informações.', 'error');
            console.log(error)
          });
      }
    });
  }

  const handleEditResp = () => {
    MySwal.fire({
      title: 'Editar Informações',
      html: (
        <div>
          <h2>Nome</h2>
          <input id="swal-input-name" className="swal2-input" defaultValue={props.name} placeholder="Nome" />
          {/* <h2>CEP</h2>
          <input id="swal-input-cep" className="swal2-input" defaultValue={props.CEP} placeholder="CEP" />
          <h2>Razão Social</h2>
          <input id="swal-input-socialReason" className="swal2-input" defaultValue={props.name} placeholder="Razão Social" />
          <h2>Códico e-Mec/Educasenso</h2>

          <input id="swal-input-educationalInstitutionCode" className="swal2-input" defaultValue={props.educationalInstitutionCode} placeholder="Código Instituição Educacional" /> */}
        </div>
      ),
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;

        // Aqui você pode adicionar mais campos conforme necessário
        const updatedInfo = { name };
        // Chamar função de atualização aqui
        const token = localStorage.getItem('token');
        api.patch(`entities/director/${props.id}`,  updatedInfo , {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
          .then(response => {
            MySwal.fire('Atualizado!', 'As informações foram atualizadas com sucesso.', 'success');
          })
          .catch(error => {
            MySwal.fire('Erro!', 'Houve um erro ao atualizar as informações.', 'error');
            console.log(error)
          });
      }
    });
  }

  const handleDelete = () => {
    MySwal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, delete isso!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        let type = '';
        if (props.role === 'Filial') {
          type = 'subsidiary';
        } else if (props.role === 'Assistente') {
          type = 'assistant';
        } else if (props.role === 'Responsável') {
          type= 'director';
        }

        api.delete(`entities/${type}/${props.id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        .then(response => {
          MySwal.fire('Deletado!', `A ${props.role} foi deletada.`, 'success');
          // Usar a função de remoção passada via props
          if (props.onRemoveEntity) {
            props.onRemoveEntity();
          }
        })
        .catch(error => {
          MySwal.fire('Erro!', `Houve um erro ao deletar a ${props.role}.`, 'error');
          console.log(error);
        });
      }
    });
  };

  return (
    <div className="card-candidatura">
      <div className="nome-candidato" style={{ width: '25%' }}>
        <h2>{props ? props.name : ''}</h2>
      </div>
      {props.address ?
        <div className="entidade-nome colaboracao-status">
          <h2>Endereço:</h2>
          <h2> {props.address}</h2>
        </div> : ''}
      <div className="situacao">
        <h2>{props.role === 'Filial' ? '' : props.role}</h2>
      </div>
      {props.role === 'Filial' &&
        <button onClick={handleEdit} className="button-edital-editar" style={{marginBottom: '0px'}}>Editar</button>
      }
      {props.role === 'Responsável' &&
        <button onClick={handleEditResp} className="button-edital-editar" style={{marginBottom: '0px'}}>Editar</button>
      }
      <button onClick={handleDelete} className="button-edital-excluir">Excluir</button>
    </div>
  );
}
