export const needle = ({ value, data, cx, cy, iR, oR, color }) => {
    const RADIAN = Math.PI / 180;


    let total = 0;
    let intervals = [];
    data.forEach((v) => {
        const prev = !!intervals.length ? total + 1 : 0
        const curr = total + v.value
        intervals.push({ prev, curr, needlePos: (prev + curr) / 2 })
        total += v.value;
    });
    const currNeedlePos = intervals.find(e => value >= e.prev && value < e.curr + 1)?.needlePos
    const ang = 180.0 * (1 - currNeedlePos / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
        <circle cx={x0} cy={y0} r={r + 3} fill={color} stroke="black" strokeWidth={2} />,
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
    ]
}