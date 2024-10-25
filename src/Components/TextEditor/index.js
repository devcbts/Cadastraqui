import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export default function TextEditor({
    initialValue,
    onChange,
    title
}) {
    const editorRef = useRef(null);
    const hasBeenEdited = useRef(null)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', }}>
            <h4 style={{ textAlign: 'start' }}>{title}</h4>
            <div style={{ padding: '0px 12px', placeSelf: 'center', }}>
                <Editor
                    apiKey='gkujy2rb94yz5jcbytph303jfff7fxb45ozefr28jgzo2kdu'
                    onInit={(_evt, editor) => {
                        editorRef.current = editor
                    }}
                    cloudChannel="7"
                    initialValue={initialValue}
                    onMouseEnter={() =>
                        hasBeenEdited.current = true
                    }
                    onEditorChange={(richText, editor) => {
                        if (!hasBeenEdited.current) {
                            return
                        }
                        const plainText = editor.getContent({ format: "text" })
                        onChange(richText, plainText)
                    }}
                    init={{
                        min_height: '20%',
                        height: 500,
                        width: "100%",
                        menubar: false,
                        // plugins: [
                        //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        //     'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        // ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        language: "pt_BR"
                    }}
                    disabled={false}
                />
            </div>
        </div>
    );
}