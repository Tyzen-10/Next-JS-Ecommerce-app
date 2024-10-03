"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react"; //what does this do?
import { deleteProduct, toggleProductAvailablity } from "../../_actions/products";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({id, isAvailableForPurchase}: {id:string,
    isAvailableForPurchase: boolean
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    return <DropdownMenuItem disabled={isPending} onClick={() => {
        startTransition(async () => {
            // call an action here.
            await toggleProductAvailablity(id, !isAvailableForPurchase)
            router.refresh(); //refresh the page.
        })
    }}>{isAvailableForPurchase ? "Deactivate" : "Activate"}</DropdownMenuItem>
}

export function DeleteDropdownItem({id, disabled}: {id:string, disabled:boolean}){
    const [isPending, startTransition] = useTransition()
    return <DropdownMenuItem variant="destructive" disabled={disabled || isPending} onClick={() => {
        startTransition(async () => {
            //call an action here.
            await deleteProduct(id);
        })
    }}>Delete</DropdownMenuItem>
}