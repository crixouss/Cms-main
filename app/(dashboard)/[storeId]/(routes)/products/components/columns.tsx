"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "@/app/(dashboard)/[storeId]/(routes)/products/components/cell-action";

export type ProductColumn = {
    id: string
    name: string
    price: string,
    size: string,
    category: string,
    color: string,
    isFeattured: boolean,
    isArchived: boolean,
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
      accessorKey: "isArchived",
        header: "IsArchived",
    },
    {
        accessorKey: "isFeattured",
        header: "IsFeattured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "Size",
        header: "Size",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className={"flex items-center gap-x-2"}>
                {row.original.color}
                <div className={"h-6 w-6 rounded-full border"}
                style={{backgroundColor: row.original.color}}/>
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original}/>
    },
]
