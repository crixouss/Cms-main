"use client"

import {Heading} from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import React from "react";
import {DataTable} from "@/components/ui/data-table";
import {columns, OrderColumn} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {

    return(
        <>
            <Heading title={`Orders (${data.length})`} description={"Manage orders for your store"}/>
            <Separator/>
            <DataTable searchKey={"products"} columns={columns} data={data}/>
        </>
    )
}