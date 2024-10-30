import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { needle } from "./Needle";

export default function IndicatorChart({ data, value }) {
    const cx = 150;
    const cy = 200;
    const iR = 50;
    const oR = 100;

    return (
        <ResponsiveContainer height={300} style={{ padding: 0 }}>
            <PieChart >
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    stroke="#1F4B73"
                    strokeWidth={2}
                    width={'fit-content'}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Legend
                    iconType="circle"
                    verticalAlign="middle"
                    layout="vertical"
                    formatter={(_, entry) => {
                        return entry.payload.legend
                    }} />
                {needle({ color: 'black', cx, cy, iR, oR, data, value })}

            </PieChart>
        </ResponsiveContainer>
    )
}
