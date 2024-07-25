import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import SendDocumentSolicitation from "./SendDocumentSolicitation";
import Schedule from "./components/Schedule";
import UserPendencies from "./components/UserPendencies";

export default function CandidatePendency() {
    const { state } = useLocation()
    return (
        state?.schedule
            ? <Schedule />
            : <UserPendencies />
    )
}