import { configure, defineRule } from "vee-validate";

export default defineNuxtPlugin((nuxtApp) => {
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true,
  });

  defineRule("required", (value, target, ctx) => {
    if (value && value.toString().trim()) return true;
    else return splitCamelCaseString(ctx.field) + " is required";
  });

  defineRule("email", (value: string, target, ctx) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value.trim()))
      return true;
    else return splitCamelCaseString(ctx.field) + " is invalid";
  });

  defineRule("phoneNumber", (value: string, target, ctx) => {
    if (/\d{9}/.test(value.trim()) && value.trim().length === 9) return true;
    else return splitCamelCaseString(ctx.field) + " is invalid";
  });
  defineRule("password", (value, target, ctx) => {
    if (value && value.toString().length > 5) return true;
    else return splitCamelCaseString(ctx.field) + " must be 6+ chars";
  });
  defineRule("confirmPassword", (value, target: string, ctx) => {
    if (ctx.form[target] != value) return "Password does't match";
    else return true;
  });
  defineRule("EndTime", (value, target: string, ctx) => {
    const time1 = ctx.form[target] as string;
    const time2 = value as string;
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    const totalMinutes1 = h1 * 60 + m1;
    const totalMinutes2 = h2 * 60 + m2;
    if (totalMinutes1 < totalMinutes2) return true;
    else return splitCamelCaseString(ctx.field) + " must have higher value.";
  });
});

const splitCamelCaseString = (str: string): string => {
  return str.replaceAll("_", " ");
};
