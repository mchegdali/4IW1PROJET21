import {ref} from "vue";

export const dispCred = ref({display:"none"});
export const dispPayPal = ref ({display:"none"});
export const disPayPalButt = ref(false);
export const displayCredForm = () => {
  dispCred.value = {display:"block"};
  dispPayPal.value = {display:"none"};
  disPayPalButt.value = false;
  return;
}
export const displayPayPalForm = () => {
  dispPayPal.value = {display:"block"};
  dispCred.value = {display:"none"};
  disPayPalButt.value = true;
  return;
}
export default {displayCredForm,displayPayPalForm,dispCred,dispPayPal,disPayPalButt };