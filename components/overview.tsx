"use client"

import React from "react";
import {Bar, BarChart, /* LineChart, */ ResponsiveContainer, XAxis, YAxis} from "recharts";

interface OverviewProps {
    data: any[];
}

export const Overview: React.FC<OverviewProps> = ({data
}) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart  data={data}>
                <XAxis dataKey="name"
                       stroke={"#888888"}
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}/>
                <YAxis tickFormatter={(value) => `$${value}`}
                       stroke={"#888888"}
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}/>
                <Bar dataKey={"total"} fill={"#3498db"} radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}