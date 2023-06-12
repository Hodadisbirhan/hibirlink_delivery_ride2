import { useAuth } from "~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  const cookie = useCookie("_hibirlink");

  const token = cookie.value?.token;

  if (token) {
    const data = JSON.parse(window.atob(token.split(".")[1]));
    console.log("data", " ", data.metadata.roles[0]);
    const role = data.metadata.roles[0];
    console.log(role);
    if (cookie.value && role === "delivery") {
      auth.setUID(data.metadata.user_id);
      console.log(auth.$state.uid);
      return true;
    } else if (cookie.value && role === "driver") {
      if (to.fullPath === "/for_driver") return true;
      else return navigateTo("/for_driver");
    }

    return false;
  }
  return false;
});
