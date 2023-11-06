import React from 'react'
import './cadastroFamiliar.css'

export default function CadastroFamiliar() {
    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <div class="survey-box">
                    <label for="relationship" id="relationship-label">Relação:</label>
                    <br />
                    <select name="relationship" id="relationship" class="select-data">
                        <option value="Wife">Esposa</option>
                        <option value="Husband">Marido</option>
                    </select>
                </div>

                <div class="survey-box">
                    <label for="fullName" id="fullName-label">Nome Completo:</label>
                    <br />
                    <input type="text" name="fullName" id="fullName" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="socialName" id="socialName-label">Nome Social:</label>
                    <br />
                    <input type="text" name="socialName" id="socialName" class="survey-control" />
                </div>

                <div class="survey-box">
                    <label for="birthDate" id="birthDate-label">Data de Nascimento:</label>
                    <br />
                    <input type="date" name="birthDate" id="birthDate" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="gender" id="gender-label">Sexo:</label>
                    <br />
                    <select name="gender" id="gender" class="select-data">
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Feminino</option>
                    </select>
                </div>

                <div class="survey-box">
                    <label for="nationality" id="nationality-label">Nacionalidade:</label>
                    <br />
                    <input type="text" name="nationality" id="nationality" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="natural_city" id="natural_city-label">Cidade Natal:</label>
                    <br />
                    <input type="text" name="natural_city" id="natural_city" class="survey-control" required />
                </div>



                <div class="survey-box">
                    <label for="natural_UF" id="natural_UF-label">Unidade Federativa:</label>
                    <br />
                    <select name="natural_UF" id="natural_UF" class="select-data">
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                    </select>
                </div>

                <div class="survey-box">
                    <label for="CPF" id="CPF-label">CPF:</label>
                    <br />
                    <input type="text" name="CPF" id="CPF" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="RG" id="RG-label">Nº de RG:</label>
                    <br />
                    <input type="text" name="RG" id="RG" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="rgIssuingAuthority" id="rgIssuingAuthority-label">Órgão Emissor:</label>
                    <br />
                    <input type="text" name="rgIssuingAuthority" id="rgIssuingAuthority" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="rgIssuingState" id="rgIssuingState-label">Estado do Órgão Emissor:</label>
                    <br />
                    <select name="rgIssuingState" id="rgIssuingState" class="select-data">
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                    </select>
                </div>

                <div class="survey-box">
                    <label for="documentType" id="documentType-label">Tipo de Documento Adicional:</label>
                    <br />
                    <select name="documentType" id="documentType" class="select-data">
                        <option value="DriversLicense">Carteira de Motorista</option>
                        <option value="FunctionalCard">Cartão Funcional</option>
                    </select>
                </div>

                <div class="survey-box">
                    <label for="documentNumber" id="documentNumber-label">Número do Documento:</label>
                    <br />
                    <input type="text" name="documentNumber" id="documentNumber" class="survey-control" />
                </div>

                <div class="survey-box">
                    <label for="documentValidity" id="documentValidity-label">Data de Validade:</label>
                    <br />
                    <input type="date" name="documentValidity" id="documentValidity" class="survey-control" />
                </div>




                {/*<!-- Número do Registro de Nascimento -->*/}
                <div class="survey-box">
                    <label for="numberOfBirthRegister" id="numberOfBirthRegister-label">Nº do Registro de Nascimento:</label>
                    <br />
                    <input type="text" name="numberOfBirthRegister" id="numberOfBirthRegister" class="survey-control" required />
                </div>

                {/*<!-- Livro do Registro de Nascimento -->*/}
                <div class="survey-box">
                    <label for="bookOfBirthRegister" id="bookOfBirthRegister-label">Livro do Registro de Nascimento:</label>
                    <br />
                    <input type="text" name="bookOfBirthRegister" id="bookOfBirthRegister" class="survey-control" required />
                </div>

                {/*<!-- Página do Registro de Nascimento -->*/}
                <div class="survey-box">
                    <label for="pageOfBirthRegister" id="pageOfBirthRegister-label">Página do Registro de Nascimento:</label>
                    <br />
                    <input type="text" name="pageOfBirthRegister" id="pageOfBirthRegister" class="survey-control" required />
                </div>

                {/*<!-- Estado Civil -->*/}
                <div class="survey-box">
                    <label for="maritalStatus" id="maritalStatus-label">Estado Civil:</label>
                    <br />
                    <select name="maritalStatus" id="maritalStatus" class="select-data">
                        <option value="Single">Solteiro(a)</option>
                        <option value="Married">Casado(a)</option>

                    </select>
                </div>

                {/*<!-- Cor da Pele -->*/}
                <div class="survey-box">
                    <label for="skinColor" id="skinColor-label">Cor da Pele:</label>
                    <br />
                    <select name="skinColor" id="skinColor" class="select-data">
                        <option value="Yellow">Amarela</option>
                        <option value="White">Branca</option>
                    </select>
                </div>

                {/*<!-- Religião -->*/}
                <div class="survey-box">
                    <label for="religion" id="religion-label">Religião:</label>
                    <br />
                    <input type="text" name="religion" id="religion" class="survey-control" required />
                </div>

                {/*<!-- Nível de Educação -->*/}
                <div class="survey-box">
                    <label for="educationLevel" id="educationLevel-label">Nível de Educação:</label>
                    <br />
                    <select name="educationLevel" id="educationLevel" class="select-data">
                        <option value="Illiterate">Analfabeto</option>
                        <option value="ElementarySchool">Ensino Fundamental</option>
                    </select>
                </div>

                {/*<!-- Necessidades Especiais -->*/}
                <div class="survey-box">
                    <label for="specialNeeds" id="specialNeeds-label">Necessidades Especiais:</label>
                    <br />
                    <input type="checkbox" name="specialNeeds" id="specialNeeds" class="survey-control" />
                </div>

                {/*<!-- Descrição das Necessidades Especiais -->*/}
                <div class="survey-box">
                    <label for="specialNeedsDescription" id="specialNeedsDescription-label">Descrição das Necessidades Especiais:</label>
                    <br />
                    <input type="text" name="specialNeedsDescription" id="specialNeedsDescription" class="survey-control" />
                </div>


                {/*<!-- Tem relatório médico -->*/}
                <div class="survey-box">
                    <label for="hasMedicalReport" id="hasMedicalReport-label">Possui relatório médico:</label>
                    <br />
                    <input type="checkbox" name="hasMedicalReport" id="hasMedicalReport" class="survey-control" />
                </div>

                {/*<!-- Telefone Fixo -->*/}
                <div class="survey-box">
                    <label for="landlinePhone" id="landlinePhone-label">Telefone Fixo:</label>
                    <br />
                    <input type="text" name="landlinePhone" id="landlinePhone" class="survey-control" />
                </div>

                {/*<!-- Telefone de Trabalho -->*/}
                <div class="survey-box">
                    <label for="workPhone" id="workPhone-label">Telefone de Trabalho:</label>
                    <br />
                    <input type="text" name="workPhone" id="workPhone" class="survey-control" />
                </div>

                {/*<!-- Nome para Contato -->*/}
                <div class="survey-box">
                    <label for="contactNameForMessage" id="contactNameForMessage-label">Nome para Contato:</label>
                    <br />
                    <input type="text" name="contactNameForMessage" id="contactNameForMessage" class="survey-control" />
                </div>

                {/*<!-- Email -->*/}
                <div class="survey-box">
                    <label for="email" id="email-label">Email:</label>
                    <br />
                    <input type="email" name="email" id="email" class="survey-control" required />
                </div>

                {/*<!-- Endereço -->*/}
                <div class="survey-box">
                    <label for="address" id="address-label">Endereço:</label>
                    <br />
                    <input type="text" name="address" id="address" class="survey-control" required />
                </div>

                {/*<!-- Cidade -->*/}
                <div class="survey-box">
                    <label for="city" id="city-label">Cidade:</label>
                    <br />
                    <input type="text" name="city" id="city" class="survey-control" required />
                </div>

                {/*<!-- Unidade Federativa -->*/}
                <div class="survey-box">
                    <label for="UF" id="UF-label">Unidade Federativa:</label>
                    <br />
                    <select name="UF" id="UF" class="select-data">
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>

                    </select>
                </div>

                {/*<!-- CEP -->*/}
                <div class="survey-box">
                    <label for="CEP" id="CEP-label">CEP:</label>
                    <br />
                    <input type="text" name="CEP" id="CEP" class="survey-control" required />
                </div>

                {/*<!-- Bairro -->*/}
                <div class="survey-box">
                    <label for="neighborhood" id="neighborhood-label">Bairro:</label>
                    <br />
                    <input type="text" name="neighborhood" id="neighborhood" class="survey-control" required />
                </div>

                {/*<!-- Número de Endereço -->*/}
                <div class="survey-box">
                    <label for="addressNumber" id="addressNumber-label">Número de Endereço:</label>
                    <br />
                    <input type="number" name="addressNumber" id="addressNumber" class="survey-control" required />
                </div>

                {/*<!-- Profissão -->*/}
                <div class="survey-box">
                    <label for="profession" id="profession-label">Profissão:</label>
                    <br />
                    <input type="text" name="profession" id="profession" class="survey-control" required />
                </div>

                {/*<!-- Inscrito em Programa Governamental -->*/}
                <div class="survey-box">
                    <label for="enrolledGovernmentProgram" id="enrolledGovernmentProgram-label">Inscrito em Programa Governamental:</label>
                    <br />
                    <input type="checkbox" name="enrolledGovernmentProgram" id="enrolledGovernmentProgram" class="survey-control" />
                </div>

                {/*<!-- NIS -->*/}
                <div class="survey-box">
                    <label for="NIS" id="NIS-label">NIS:</label>
                    <br />
                    <input type="text" name="NIS" id="NIS" class="survey-control" />
                </div>

                {/*<!-- Tipo de Instituição -->*/}
                <div class="survey-box">
                    <label for="educationPlace" id="educationPlace-label">Tipo de Instituição:</label>
                    <br />
                    <select name="educationPlace" id="educationPlace" class="select-data">
                        <option value="Public">Pública</option>
                        <option value="Private">Privada</option>
                    </select>
                </div>

                {/*<!-- Nome da Instituição -->*/}
                <div class="survey-box">
                    <label for="institutionName" id="institutionName-label">Nome da Instituição:</label>
                    <br />
                    <input type="text" name="institutionName" id="institutionName" class="survey-control" />
                </div>

                {/*<!-- Nível de Ensino Cursando -->*/}
                <div class="survey-box">
                    <label for="coursingEducationLevel" id="coursingEducationLevel-label">Nível de Ensino Cursando:</label>
                    <br />
                    <select name="coursingEducationLevel" id="coursingEducationLevel" class="select-data">
                        <option value="Alfabetizacao">Alfabetização</option>
                        <option value="Ensino_Medio">Ensino Médio</option>
                        
                    </select>
                </div>

                {/*<!-- Ciclo de Educação -->*/}
                <div class="survey-box">
                    <label for="cycleOfEducation" id="cycleOfEducation-label">Ciclo de Educação:</label>
                    <br />
                    <input type="text" name="cycleOfEducation" id="cycleOfEducation" class="survey-control" />
                </div>

                {/*<!-- Turno de Educação -->*/}
                <div class="survey-box">
                    <label for="turnOfEducation" id="turnOfEducation-label">Turno de Educação:</label>
                    <br />
                    <select name="turnOfEducation" id="turnOfEducation" class="select-data">
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        
                    </select>
                </div>

                {/*<!-- Tem Bolsa -->*/}
                <div class="survey-box">
                    <label for="hasScholarship" id="hasScholarship-label">Possui Bolsa:</label>
                    <br />
                    <input type="checkbox" name="hasScholarship" id="hasScholarship" class="survey-control" />
                </div>

                {/*<!-- Percentual da Bolsa -->*/}
                <div class="survey-box">
                    <label for="percentageOfScholarship" id="percentageOfScholarship-label">Percentual da Bolsa:</label>
                    <br />
                    <input type="text" name="percentageOfScholarship" id="percentageOfScholarship" class="survey-control" />
                </div>

                {/*<!-- Valor Mensal -->*/}
                <div class="survey-box">
                    <label for="monthlyAmount" id="monthlyAmount-label">Valor Mensal:</label>
                    <br />
                    <input type="text" name="monthlyAmount" id="monthlyAmount" class="survey-control" />
                </div>

                {/*<!-- Botão de Submissão -->*/}
                <div class="survey-box">
                    <button type="submit" id="submit-button">Enviar</button>
                </div>






                
            </form>
        </div></div>
    )
}

