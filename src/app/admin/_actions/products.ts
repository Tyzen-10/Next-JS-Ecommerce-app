"use server"
import prisma from "@/db/client"
import {z} from "zod"
import fs from "fs/promises"
import { redirect } from "next/navigation"

const fileSchema = z.instanceof(File, {message: "Required!"})
const imageSchema = fileSchema.refine(file=> file.size === 0 || file.type.startsWith("image/"))
//or statement -> if either one is true then don't accept i guess -> check later.
//file size 0 -> so didnt submit file. 
//if submitted a file then we check whether it starts with image/
//above we don't check foe file size. we check later below.
const addSchema = z.object({
    name:z.string().min(1),
    description: z.string().min(1),
    priceInCents:z.coerce.number().int().min(1),
    //coerce attempts to convert to a number
    file: fileSchema.refine(file=> file.size > 0, "Required!"),
    image:imageSchema.refine(file=> file.size > 0, "Required!"),
    //file and image don't got the z.___ functions. -> so we need to create own checks like above.
})
//actions must be an async function -> why?
export async function addProduct(prevState: unknown,formData: FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!result.success){
        //not in proper format. -> send errors back to client from SS.
        return result.error.formErrors.fieldErrors // dont understand this
    }
    //code if in proper format.
    const data = result.data

    await fs.mkdir("products", { recursive : true })
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    //now save it to the file path we designed above.
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive: true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    /*why dont't we need to give public/products in above line -> but instead /products -> 
    becoz WDS said it will assume to get it from here, from the folder which is publically available.*/
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    /*but after saying that, he prefixes image path with public idk why> */
    
    await prisma.product.create({data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        //for filePath and imagePath -> first store the file in File system 
        //then path in DB.
        filePath,
        imagePath,
    }})
    console.log(formData);

    redirect("/admin/products")
}