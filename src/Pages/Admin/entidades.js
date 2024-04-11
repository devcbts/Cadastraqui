import React, { useEffect } from "react";
import "./newEntidade.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { UilAngleRightB } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import axios from "axios";
import NavBarAdmin from "../../Components/navBarAdmin";
import { useRef } from "react";
import { api } from "../../services/axios";
import CardEntidade from "../../Components/Admin/CardEntidade";

export default function Entidades() {
    const [entities, setEntities] = useState([])

    useEffect(() => {
        async function getEntities() {
            const token = localStorage.getItem('token');
            const response = await api.get('/admin/entidades', {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            })
            console.log(response.data)
            setEntities(response.data.entities)
        }
        getEntities();
    }, [1])

    return (
        <div className="container">
            <div className="section-nav">
                <NavBarAdmin></NavBarAdmin>
            </div>
            <div className={`editais `}>
                <div className="upper">
                    <h1>Visualizar Entidades</h1>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {entities.map(entidade => {
                        return <CardEntidade entity={entidade} />
                    })}
                </div>
            </div>
        </div>

    );
}

