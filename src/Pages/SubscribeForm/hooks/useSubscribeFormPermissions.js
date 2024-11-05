import candidateViewAtom from "Components/CandidateView/atom/candidateViewAtom";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import applicationService from "services/application/applicationService";
import { api } from "services/axios";
import candidateService from "services/candidate/candidateService";

export default function useSubscribeFormPermissions() {
    const { auth } = useAuth()
    // const { currentApplication, currentCandidate } = useRecoilValue(candidateViewAtom)
    const { state } = useLocation()
    const [currentApplication, currentCandidate] = [state?.applicationId, state?.candidateId]
    const availablePermissions = [
        {
            roles: ["ASSISTANT", "ENTITY", "ENTITY_DIRECTOR"],
            permissions: {
                canEdit: false,
                service: !!currentApplication ? applicationService.setApplicationId(currentApplication) : candidateService
            },
        },
        {
            roles: ["RESPONSIBLE", "CANDIDATE"],
            permissions: {
                canEdit: true,
                service: candidateService,
            }
        },

    ]
    useEffect(() => {
        const addCandidateId = api.interceptors.request.use((config) => {
            if (!!currentCandidate) {
                config.params = {
                    ...config.params,
                    candidateId: currentCandidate
                }
            }
            return config
        }, (err) => { })
        return () => {
            api.interceptors.request.eject(addCandidateId)
        }
    }, [auth, currentCandidate])
    const currentPermission = useMemo(() => {
        const role = auth?.role
        const nullishRolePermission = {
            canEdit: false,
            service: null,
        }

        return availablePermissions.find(e => e.roles.includes(role))?.permissions ?? nullishRolePermission
    }, [auth.role])

    return currentPermission
}