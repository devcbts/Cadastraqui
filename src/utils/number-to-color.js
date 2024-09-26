export default function toColor(num) {
    console.log(num)
    num >>>= 0;
    // scale factor to prevent low number become all black coloured
    num *= 100000
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    // a = ((num & 0xFF000000) >>> 24) / 255;
    console.log("rgb(" + [r, g, b].join(",") + ")")
    return "rgb(" + [r, g, b].join(",") + ")";
}