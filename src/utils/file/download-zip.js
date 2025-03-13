import { saveAs } from 'file-saver';
import JSZip from "jszip";
/**
 * 
 * @param {Object[]} files
 *  @param {string} [files.url] 
 *  @param {string} [files.filename] 
 */
export const downloadZip = async (files = []) => {
    try {

        const zip = new JSZip();


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const response = await fetch(file.url);
            const blob = await response.blob();
            // const filename = url.split('#')[0].split('?')[0].split('/').pop();
            zip.file(file.filename, blob);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `${new Date().getTime()}.zip`);
        });
    } catch (err) { }
}