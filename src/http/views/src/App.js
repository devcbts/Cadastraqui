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

function App() {
  return (
    <AppProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
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
            <Route path="/entidade/contas" element={<ContasEntidade />}></Route>
            <Route path="/entidade/perfil" element={<PerfilEntidade />}></Route>

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
              path="/assistente/home"
              element={<HomeAssistente></HomeAssistente>}
            ></Route>
            <Route
              path="/assistente/editais"
              element={<EditaisAssistente></EditaisAssistente>}
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
              path="/entidade/editaltest"
              element={<EditalAberto />}
            ></Route>
            <Route
              path="/candidato/editaltest"
              element={<EditalAbertoCandidato></EditalAbertoCandidato>}
            ></Route>
            <Route
              path="/assistente/cadastrados"
              element={<CandidatosCadastrados></CandidatosCadastrados>}
            ></Route>
            <Route path="/login" element={<Login></Login>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
