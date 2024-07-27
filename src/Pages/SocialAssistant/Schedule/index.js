import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AssistantScheduleManager from "./components/AssistantScheduleManager";
import AssistantScheduleView from "./components/AssistantScheduleView";
import MenuCard from "Components/MenuCard";
import { ReactComponent as Calendar } from 'Assets/icons/calendar.svg'
import { ReactComponent as Gear } from 'Assets/icons/gear.svg'
export default function AssistantSchedule() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const handleNavigate = (state) => {
        navigate('', { state: { scheduleView: state } })
    }
    if (!state?.scheduleView) {
        return (
            <>
                <h1>Agenda</h1>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '64px 24px' }}>
                    <MenuCard title={'gerenciar agenda'} description={'gerencie os horários para cada edital'} Icon={Gear} onClick={() => handleNavigate('manager')} />
                    <MenuCard title={'agenda'} description={'tenha uma visão geral de seus horários'} Icon={Calendar} onClick={() => handleNavigate('agenda')} />
                </div>
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