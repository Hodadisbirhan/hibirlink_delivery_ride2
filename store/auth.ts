import { defineStore } from "pinia";

const expires = new Date();
expires.setDate(expires.getDate() + 7);

export const useAuth = defineStore({
  id: "_hibirlink",
  state: () => {
    return {
      toSignInPageFrom: "",
      token: "",
      uid: "",
      name: "",
      role: "",
      email: "",
      delivery_id: null,
      driver_id: null,
      ride_phone: "",
    };
  },
  actions: {
    setToSignInPageFrom(from: string) {
      this.toSignInPageFrom = from;
    },
    setRidePhone(phone: string) {
      this.ride_phone = phone;
    },

    setToken(token: string) {
      this.token = token;
    },

    setUID(uid: string) {
      this.uid = uid;
    },
    setDeliveryID(id: number) {
      this.delivery_id = id;
    },
    setDiverID(id: String) {
      this.driver_id = id;
    },

    setName(name: string) {
      this.name = name;
    },
    setRole(role: string) {
      this.role = role;
    },

    setEmail(email: string) {
      this.email = email;
    },
  },

  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: "strict",
      path: "/",
      domain: "localhost",
      secure: true,
      expires: expires,
    }),
    paths: ["token", "uid", "name", "role", "email"],
  },
});
