import React from "react"
import { UilArrowCircleRight } from '@iconscout/react-unicons'
import { Link } from "react-router-dom"
export default function ResponsibleDependentCard({ dependent }) {

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 20, }}>
            <label>{dependent.name}</label>
            <Link>
                <UilArrowCircleRight size={40} color="#1F4B73"></UilArrowCircleRight>
            </Link>
        </div>
    )
}