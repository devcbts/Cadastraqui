import { zodResolver } from "@hookform/resolvers/zod";
import ButtonBase from "Components/ButtonBase";
import FormCheckbox from "Components/FormCheckbox";
import CoursesResumeBoard from "Pages/Entity/Register/components/Announcement/components/CoursesResumeBoard";
import { useForm } from "react-hook-form";
import findLabel from "utils/enums/helpers/findLabel";
import OFFERED_COURSES_TYPE from "utils/enums/offered-courses";
import SCHOLARSHIP from "utils/enums/scholarship";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import { z } from "zod";

export default function EntityStudentsRenewConfirmCourses({ onSubmit, courses, data }) {
    const { control, watch, handleSubmit } = useForm({
        resolver: zodResolver(z.object({
            confirm: z.boolean().nullish().refine(v => v !== null).default(null)
        })),
        defaultValues: {
            confirm: data.confirm
        }
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1' }}>
            <div>

                <FormCheckbox control={control} name={"confirm"} label={'Confirma as bolsas que serão renovadas?'} value={watch("confirm")} />
                <CoursesResumeBoard
                    headers={["curso", "tipo de educação", "turno", "vagas", "tipo de bolsa"]}
                    courses={courses?.map(e => ({
                        id: e.id,
                        1: e.course,
                        2: findLabel(SCHOLARSHIP.concat(OFFERED_COURSES_TYPE), e.type),
                        3: e.shift,
                        4: e.verifiedScholarships,
                        5: findLabel(SCHOLARSHIP_OFFER.concat(SCHOLARSHIP_TYPE), e.scholarshipType)
                    }))}
                />
            </div>
            {watch("confirm") && <ButtonBase label={'próximo'} onClick={handleSubmit(() => onSubmit({ confirm: watch("confirm") }))} />}
        </div>
    )
}