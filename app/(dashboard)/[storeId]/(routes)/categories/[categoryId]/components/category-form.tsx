"use client"

import {Category} from "@prisma/client";
import React, {useState} from "react";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {AlertModel} from "@/components/modals/alert-model";

type CategoryFormValues = z.infer <typeof formSchema>;

interface CategoryFormProps{
    initialData: Category | null;
}
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})



export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter();

    const[open, setOpen] = useState(false)
    const[loading, setLoading] = useState(false)

    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit Category" : "Add a new Category"
    const toastMessage = initialData ? "Category updated" : "Category created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId:'',
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.push(`/${params.storeId}/billboards`)
            router.refresh();
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Error saving stored data.")
        } finally{
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setOpen(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.push(`/${params.storeId}/billboards`)
            router.refresh();
            toast.success("Billboard deleted.")
        } catch (error){
            toast.error("Make sure you removed all categories using this billboard.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return(
        <>
            <AlertModel isOpen={open}
                        onClose={() => setOpen(false)}
                        onConfirm={onDelete} loading={loading}/>
            <div className={"flex flex-items-center justify-between"}>
                <Heading title={title}
                         description={description}/>

                    {
                        initialData && (<Button
                            disabled={loading}
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => setOpen(true)}
                        >
                            <Trash className={"h-4 w-4"}/>
                        </Button>)
                    }
            </div>
            <Separator/>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8 w-full"}>
                    <div className={"grid grid-cols-3 gap-8"}>
                        <FormField control={form.control} name={"name"} render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={"Category name"} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className={"ml-auto"} type={"submit"}>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator/>
        </>
    )
}