import axios from "axios";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const transformData = (data) => {
    if (!data) return [];

    const keys = Object.keys(data);
    const dates = Array.from(new Set(keys.flatMap((key) => data[key]?.map((item) => Object.keys(item)[0]))));

    return dates.map((date) => {
        let entry = { date };
        for (let key of keys) {
            const item = data[key]?.find((d) => d[date] !== undefined);
            entry[key] = item ? item[date] : 0;
        }
        return entry;
    });
};

const generateColors = (numColors) => {
    return Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 50%)`);
};

const LineChartComponent = ({ id }) => {
    const [dulieu, setdulieu] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8080/khuyenmai/getnangsuat?id=${id}`)
            .then(data => {
                setdulieu(data.data.data);
            })
            .catch(() => {});

    }, [id]);

    const chartData = transformData(dulieu);
    const keys = Object.keys(dulieu);
    const colors = generateColors(keys.length);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {keys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={colors[index]} strokeWidth={2} strokeOpacity={1} dot={{ r: 3 }} />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;
