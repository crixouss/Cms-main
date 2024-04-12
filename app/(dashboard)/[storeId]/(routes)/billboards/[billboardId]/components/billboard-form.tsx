"use client"

import {Billboard} from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps{
    initialData: Billboard | null;
}
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer <typeof formSchema>;


export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter();

    const[open, setOpen] = useState(false)
    const[loading, setLoading] = useState(false)

    const title = initialData ? "Edit Billboard" : "Create Billboard"
    const description = initialData ? "Edit Billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl:'',
        }
    })

    const onSubmit = async (data: BillboardFormValues) => {
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
                    <FormField control={form.control} name={"imageUrl"} render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Background image
                            </FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={(url) => field.onChange("")}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className={"grid grid-cols-3 gap-8"}>
                        <FormField control={form.control} name={"label"} render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Label
                                </FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={"Billboard label"} {...field} />
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