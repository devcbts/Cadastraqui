import Profile from "Pages/Profile";
import FormView from "./components/FormView";

export default function AdminProfile() {
    return (
        <Profile
            dataForm={(onEdit) => <FormView data={null} onEdit={onEdit} />}
        />
    )
}