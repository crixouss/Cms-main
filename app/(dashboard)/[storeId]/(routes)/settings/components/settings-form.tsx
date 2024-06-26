"use client"

import {Store} from "@prisma/client";
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
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";

interface SettingsFormProps{
    initialData: Store;
}
const formSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer <typeof formSchema>;


export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter();
    const origin = useOrigin()

    const[open, setOpen] = useState(false)
    const[loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated successfully.")
        } catch (error) {
            toast.error("Error saving stored data.")
        } finally{
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setOpen(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.push("/")
            router.refresh();
            toast.success("Store deleted successfully.")
        } catch (error){
            toast.error("Make sure you removed all products and categories first!")
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
                <Heading title={"Settings"}
                         description={"Manage settings"}/>
                <Button
                    disabled={loading}
                    variant={"destructive"}
                    size={"sm"}
                    onClick={() => setOpen(true)}
                >
                    <Trash className={"h-4 w-4"}/>
                </Button>
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
                                    <Input disabled={loading} placeholder={"Store name"} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className={"ml-auto"} type={"submit"}>
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert variant={"public"}
                      title={"NEXT_PUBLIC_API_URL"}
                      description={`${origin}/api/${params.storeId}`} />
        </>
    )
}