export default function toColor(num) {
    // 
    num >>>= 0;
    // scale factor to prevent low number become all black coloured
    num *= 100000
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    // a = ((num & 0xFF000000) >>> 24) / 255;
    // 
    return "rgb(" + [r, g, b].join(",") + ")";
}