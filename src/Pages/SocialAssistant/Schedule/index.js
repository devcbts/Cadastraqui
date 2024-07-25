import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AssistantScheduleManager from "./components/AssistantScheduleManager";
import AssistantScheduleView from "./components/AssistantScheduleView";

export default function AssistantSchedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    if (!state?.scheduleView) {
        return (
            <>
                <h1>Agenda</h1>
                <ButtonBase label={'Gerenciar agenda'} onClick={() => navigate('', { state: { scheduleView: 'manager' } })} />
                <ButtonBase label={'ver agenda'} onClick={() => navigate('', { state: { scheduleView: 'agenda' } })} />
            </>
        )
    }
    switch (state.scheduleView) {
        case 'manager':
            return <AssistantScheduleManager />
        case 'agenda':
            return <AssistantScheduleView />
    }

}