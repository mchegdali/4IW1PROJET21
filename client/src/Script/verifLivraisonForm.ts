import {ref} from "vue";
import {z} from "zod";

export const emailSchema = z.string().min(5, {
    message: "5 characters minimum"
}).max(30, {
    message: "30 characters maximum"
}).email({
    message: "Invalid email"
});
export const fullName = z.string().min(4,{
    message: "4 characters minimum"
}).max(50,{
    message:"50 characters maximum"
}).regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s'-]+$/, {
    message: "contiens des caractères invalides"
});
export const address = z.string().min(5,{
    message: "5 characters minimum"
}).max(60,{
    message:"50 characters maximum"
}).regex( /^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: "adresse invalid"
});
export const codePostal = z.string().min(4,{
    message: "4 characters minimum"
}).max(6,{
    message:"6 characters maximum"
}).regex( /^\d+$/, {
    message: "code postale invalid"
});
export const city = z.string().min(2,{
    message: "2 characters minimum"
}).max(25,{
    message:"25 characters maximum"
}).regex( /^[a-zA-Z]+$/, {
    message: "ville invalid"
});