import React from 'react'
import { useState, useEffect } from 'react'
export default function Parecer ({candidate, FamilyMembers, Housing, Vehicle})  {

    useEffect(() =>{

    })


  return (
    <div className="fill-container general-info">
    <h1 id="parecer-text">
      Em, {"02-11-2023"} o(a) candidato
      {"("}a{")"} {"João Silva"}, portador{"("}a{")"} da cédula de
      identidade RG número {"22.222.222"}, orgão emissor IIMG, UF do orgão
      emissor MG, com Nacionalidade Brasileira, solteiro e desempregado,
      residente no apartamento número 123, CEP 12228460, Campus do DCTA, São
      José dos Campos, São Paulo, SP. Com email
      jeancarlosimpliamaral@hotmail.com, se inscreveu para participar do
      processo seletivo de que trata o Edital Unifei 2023.1 e recebeu número
      de inscrição 00001.
      <br></br>
      <br></br>O candidato possui a idade de 19 anos e reside com: Ana Lúcia
      {"(Mãe)"}, Mateus Pereira {"(Irmão)"}
      <br></br>
      <br></br>O grupo familiar objeto da análise reside em imóvel próprio
      pelo prazo de 5 anos e a moradia é do tipo casa. Esta moradia possui 6
      cômodos, sendo que 2 estão servindo permanentemente de dormitório para
      os moradores deste domicílio.
      <br></br>
      <br></br>
      Nenhum integrante do grupo familiar possui doença grave ou crônica que
      exija custeio elevado.
      <br></br>
      <br></br>
      Os integrantes possuem veículos conforme identificação abaixo:
    </h1>
    <table id="vehicle-info">
      <thead>
        <tr>
          <th>Proprietário</th>
          <th>Carros e utilitários pequenos</th>
          <th>Modelo/Marca</th>
          <th>Ano/fabricação</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ana Lúcia</td>
          <td>1</td>
          <td>Pálio</td>
          <td>2003</td>
          <td>Velho</td>
        </tr>
      </tbody>
    </table>
  </div>
  )
}

