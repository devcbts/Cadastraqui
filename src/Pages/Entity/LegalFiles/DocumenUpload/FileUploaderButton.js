import ButtonBase from "Components/ButtonBase";
import CustomFilePicker from "Components/CustomFilePicker";

export default function FileUploaderButton({
    multiple,
    onUpload
}) {
    return <>
        <CustomFilePicker multiple={multiple} onUpload={onUpload} >
            <ButtonBase label={!multiple ? 'Novo arquivo' : 'Novo(s) arquivo(s)'} />
        </CustomFilePicker>
    </>
}