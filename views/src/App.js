import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeEntidade from "./Pages/Entidade/home";
import EditaisEntidade from "./Pages/Entidade/editais";
import { useState } from "react";
import { AppProvider } from "./AppGlobal";
import CadastroEntidade from "./Pages/Entidade/cadastro";
import SacEntidade from "./Pages/Entidade/sac";
import ContasEntidade from "./Pages/Entidade/contas";
import PerfilEntidade from "./Pages/Entidade/perfil";
import HomeCandidato from "./Pages/Candidato/home";
import PerfilCandidato from "./Pages/Candidato/perfil";
import HistoricoCandidato from "./Pages/Candidato/historico";
import HomeAssistente from "./Pages/Assistente/home";
import EditaisAssistente from "./Pages/Assistente/editais";
import NewEntidade from "./Pages/Admin/newEntidade";
import EditaisAdmin from "./Pages/Admin/editais";
import EditalAberto from "./Pages/Entidade/edital";
import EditalAbertoCandidato from "./Pages/Candidato/editalCandidato";
import AcceptEdital from "./Pages/Candidato/acceptEdital";
import CandidatosCadastrados from "./Pages/Assistente/candidatosCadastrados";
import Login from "./Pages/Login/login";
import { AuthProvider } from "./context/auth";
import CadastroInfo from "./Pages/Candidato/cadastroInformacoes";
import Estatisticas from "./Pages/Assistente/estatisticas";
import SacAssistente from "./Pages/Assistente/sacAssistente";
import PerfilAssistente from "./Pages/Assistente/perfilAssistente";
import SeeCandidatosInfo from "./Pages/Assistente/seeCandidatosInfo";

import GeralCadastrado from "./Pages/Assistente/geralCadastrado";

import SolicitacoesCandidato from "./Pages/Candidato/solicitações";
import VerSolicitacoes from "./Pages/Candidato/verSolicitações";
import VerEditalEntidade from "./Pages/Entidade/verEdital";
import HomePage from "./Pages/Home/homePage";
import Entidades from "./Pages/Admin/entidades";
import VerEntidade from "./Pages/Admin/verEntidade";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              {/*Here we have the routes for the "entidade" user type */}
              <Route path="/entidade/home" element={<HomeEntidade />}></Route>
              <Route
                path="/entidade/editais"
                element={<EditaisEntidade />}
              ></Route>
              <Route
                path="/entidade/cadastro"
                element={<CadastroEntidade />}
              ></Route>
              <Route path="/entidade/sac" element={<SacEntidade />}></Route>
              <Route
                path="/entidade/contas"
                element={<ContasEntidade />}
              ></Route>
              <Route
                path="/entidade/perfil"
                element={<PerfilEntidade />}
              ></Route>

              {/*Here we have the routes for the "assistente social" user type */}
              <Route
                path="/candidato/home"
                element={<HomeCandidato></HomeCandidato>}
              ></Route>
              <Route
                path="/candidato/perfil"
                element={<PerfilCandidato></PerfilCandidato>}
              ></Route>
              <Route
                path="/candidato/historico"
                element={<HistoricoCandidato></HistoricoCandidato>}
              ></Route>
              <Route
                path="/candidato/solicitacoes"
                element={<SolicitacoesCandidato></SolicitacoesCandidato>}
              ></Route>
              <Route
                path="/candidato/solicitacoes/:application_id"
                element={<VerSolicitacoes></VerSolicitacoes>}
              ></Route>

              <Route
                path="/assistente/home"
                element={<HomeAssistente></HomeAssistente>}
              ></Route>
              <Route
                path="/assistente/editais"
                element={<EditaisAssistente></EditaisAssistente>}
              ></Route>
              <Route
                path="/assistente/estatisticas/:announcement_id"
                element={<Estatisticas />}
              ></Route>
              <Route
                path="/admin/cadastro"
                element={<NewEntidade></NewEntidade>}
              ></Route>
              <Route
                path="/admin/editais"
                element={<EditaisAdmin></EditaisAdmin>}
              ></Route>
              <Route
                path="/admin/entidades"
                element={<Entidades />}>

              </Route>
              <Route
                path="/admin/entidades/:entity_id"
                element={<VerEntidade />}
              ></Route>
              <Route
                path="/entidade/edital/:announcement_id"
                element={<VerEditalEntidade />}
              ></Route>
              <Route
                path="/candidato/edital/:announcement_id"
                element={<EditalAbertoCandidato></EditalAbertoCandidato>}
              ></Route>
              <Route
                path="/assistente/cadastrados/:announcement_id"
                element={<CandidatosCadastrados></CandidatosCadastrados>}
              ></Route>

              <Route
                path="/assistente/cadastrados"
                element={<CandidatosCadastrados></CandidatosCadastrados>}
              ></Route>

              <Route path="/login" element={<Login></Login>}></Route>

              <Route path="/candidato/info" element={<CadastroInfo />}></Route>

              <Route
                path="/assistente/sac"
                element={<SacAssistente></SacAssistente>}
              ></Route>

              <Route
                path="/assistente/perfil"
                element={<PerfilAssistente></PerfilAssistente>}
              ></Route>

              <Route
                path="/assistente/cadastrados/info/:announcement_id/:application_id"
                element={<SeeCandidatosInfo></SeeCandidatosInfo>}
              ></Route>
              <Route
                path="/assistente/cadastrados/geral/:announcement_id/:application_id?"
                element={<GeralCadastrado></GeralCadastrado>}
              ></Route>

            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
