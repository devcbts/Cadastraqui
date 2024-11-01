import stc from "string-to-color";

export default function toColor(value) {
    return stc(value)
    // if (isNaN(value)) {
    //     const stringHexNumber = stc(value)
    //     console.log(value, stringHexNumber)
    //     return stringHexNumber
    // }
    // let num = value
    // num >>>= 0;
    // // scale factor to prevent low number become all black coloured
    // num *= 100000
    // var b = num & 0xFF,
    //     g = (num & 0xFF00) >>> 8,
    //     r = (num & 0xFF0000) >>> 16;
    // // a = ((num & 0xFF000000) >>> 24) / 255;
    // // 
    // return "rgb(" + [r, g, b].join(",") + ")";
}