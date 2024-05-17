import {computed, ref} from "vue";
import {z} from "Zod";

export const emailSchema = z.string().min(5, {
    message: "5 characters minimum"
}).max(30, {
    message: "30 characters maximum"
}).email({
    message: "Invalid email"
});
export const fullNameSchema = z.string().min(4,{
    message: "4 characters minimum"
}).max(50,{
    message:"50 characters maximum"
}).regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s'-]+$/, {
    message: "contiens des caractères invalides"
});
export const addressSchema = z.string().min(5,{
    message: "5 characters minimum"
}).max(60,{
    message:"50 characters maximum"
}).regex( /^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: "adresse invalid"
});
export const codePostalSchema = z.string().min(4,{
    message: "4 characters minimum"
}).max(6,{
    message:"6 characters maximum"
}).regex( /^\d+$/, {
    message: "code postale invalid"
});
export const citySchema = z.string().min(2,{
    message: "2 characters minimum"
}).max(25,{
    message:"25 characters maximum"
}).regex( /^[a-zA-Z]+$/, {
    message: "ville invalid"
});

export const email= ref("");
export const fullName = ref("");
export const address = ref("");
export const codePostal = ref(0);
export const city = ref("");

export const emailError = computed(() => {
    const parsedEmail = emailSchema.safeParse(email.value);
    if(parsedEmail.success) {
        return "" ;
    }
    return parsedEmail.error.issues[0].message;
});
export const fullNameError = computed(() => {
    const parsedFullName = fullNameSchema.safeParse(fullName.value);
    if(parsedFullName.success) {
        return "" ;
    }
    return parsedFullName.error.issues[0].message;
});
export const addressError = computed(() => {
    const parsedAddress = addressSchema.safeParse(address.value);
    if(parsedAddress.success) {
        return "" ;
    }
    return parsedAddress.error.issues[0].message;
});
export const codePostalError = computed(()=> {
    const parsedCodePostale = codePostalSchema.safeParse(codePostal.value);
    if(parsedCodePostale.success) {
        return "";
    }
    return parsedCodePostale.error.issues[0].message;
})
export const cityError = computed(() => {
    const parsedcity = addressSchema.safeParse(address.value);
    if(parsedcity.success) {
        return "" ;
    }
    return parsedcity.error.issues[0].message;
});

export default {emailError, fullNameError, addressError,codePostalError,cityError}