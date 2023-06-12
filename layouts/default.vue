<template>
  <div class="font-nunito max-w-[1920px] mx-auto">
    <header
      class="flex justify-between max-w-[1920px] mx-auto z-40 items-center px-[5%] h-[4rem] pt-[10px] sticky top-0 left-0 w-full bg-light400/40 backdrop-blur-sm"
    >
      <div class="lg:text-2xl font-bold text-primary md:block hidden">
        <NuxtLink :to="{ name: 'index' }">Hibirlink + Ride</NuxtLink>
      </div>
      <div class="lg:text-2xl font-bold text-primary md:hidden">
        <NuxtLink :to="{ name: 'index' }">H+R</NuxtLink>
      </div>

      <nav class="flex gap-10 items-center">
        <ul
          class="md:flex hidden flex-row justify-end lg:gap-[30px] capitalize gap-6"
        >
          <li
            v-for="link in nav_list"
            :key="link.name"
            class="hover:text-primaryvar1 text-dark300/40 tracking-wide rounded-md px-3 py-2 text-sm font-semibold"
          >
            <NuxtLink :to="{ name: link.name }">
              {{ link.text }}
            </NuxtLink>
          </li>
        </ul>
        <ul class="md:hidden">
          <TransitionRoot as="template" :show="is_nav_appear">
            <Dialog
              as="div"
              class="relative z-50"
              @close="is_nav_appear = false"
            >
              <TransitionChild
                as="template"
                enter="ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="fixed inset-0 bg-neutral100 bg-opacity-75 transition-opacity"
                />
              </TransitionChild>

              <div class="inset-0 fixed overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                  <div
                    class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
                  >
                    <TransitionChild
                      as="template"
                      enter="transform transition ease-in-out duration-500 sm:duration-700"
                      enter-from="translate-x-full"
                      enter-to="translate-x-0"
                      leave="transform transition ease-in-out duration-500 sm:duration-700"
                      leave-from="translate-x-0"
                      leave-to="translate-x-full"
                    >
                      <DialogPanel
                        class="pointer-events-auto relative w-screen max-w-xs"
                      >
                        <TransitionChild
                          as="template"
                          enter="ease-in-out duration-500"
                          enter-from="opacity-0"
                          enter-to="opacity-100"
                          leave="ease-in-out duration-500"
                          leave-from="opacity-100"
                          leave-to="opacity-0"
                        >
                          <div
                            class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4"
                          >
                            <button
                              type="button"
                              class="rounded-md text-neutral100 hover:text-light400 focus:outline-none focus:ring-2 focus:ring-light400"
                              @click="is_nav_appear = false"
                            >
                              <span class="sr-only">Close panel</span>
                              <Icon
                                name="uil:x"
                                class="text-xl text-neutral200 cursor-pointer font-bold"
                                @click="remove_side"
                              ></Icon>
                            </button>
                          </div>
                        </TransitionChild>
                        <div
                          class="flex h-full flex-col overflow-y-scroll bg-light400 py-6 shadow-xl"
                        >
                          <div
                            class="relative mt-6 flex flex-col gap-5 flex-1 px-6"
                          >
                            <!-- Your content -->

                            <NuxtLink
                              v-for="link in nav_list"
                              :key="link.name"
                              :to="{ name: link.name }"
                              @click="is_nav_appear = false"
                            >
                              {{ link.text }}
                            </NuxtLink>
                          </div>
                        </div>
                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </ul>

        <div class="flex gap-9 items-center">
          <span class="h-[15px] w-[1.5px] bg-lemon inline-block"> </span>
          <!-- <div>
            <Icon name="ion:language" /> {{ locale === "en" ? "Eng" : "አማ" }}
          </div> -->
          <div
            class="flex relative items-center justify-center h-[2rem] w-[2rem] rounded-[100%] bg-primaryvar4/50"
          >
            <Icon name="uil:bell" class="text-xl"></Icon>
            <span
              class="absolute -top-1 -right-1 cursor-pointer h-[1rem] w-[1rem] bg-primaryvar2 text-light400 flex justify-center items-center rounded-[100%] text-xs"
              >1</span
            >
          </div>

          <div class="top-16 text-right">
            <Menu as="div" class="relative inline-block text-left">
              <div class="">
                <MenuButton
                  class="inline-flex group justify-center rounded-md px-4 py-2 text-sm font-medium items-end"
                >
                  <Icon
                    name="uil:user"
                    class="text-2xl font-bold text-primary"
                  ></Icon>
                  <Icon
                    name="uil:angle-down"
                    class="h-5 w-5 text-primary group-focus:rotate-180 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 px-2 py-2 origin-top-right rounded-md bg-light400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <div
                        class="group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm border-b"
                      >
                        <span
                          class="flex flex-row items-center justify-center min-w-[2rem] min-h-[2rem] text-light300 bg-primaryvar4 rounded-[100%]"
                          >{{ store.$state.name[0] }}</span
                        >
                        <div class="flex flex-col gap-2" v-if="profile">
                          <strong
                            class="text-base font-semibold text-dark200/80 whitespace-nowrap"
                          >
                            {{ store.$state.name }}
                          </strong>
                          <span class="text-sm font-semibold text-dark300/50">{{
                            store.$state.email
                          }}</span>
                        </div>
                      </div>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="
                          () => {
                            router.push({ name: 'myAccount' });
                          }
                        "
                        :class="[
                          active
                            ? 'bg-primaryvar5 text-white'
                            : 'text-gray-900',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        ]"
                      >
                        <Icon
                          name="uil:user-circle"
                          class="mr-2 h-5 w-5 group-hover:text-light400 text-primaryvar3"
                          aria-hidden="true"
                        />
                        My Account
                      </button>
                    </MenuItem>
                    <!-- <MenuItem v-slot="{ active }">
                      <button
                        @click="
                          () => {
                            router.push({ name: 'setting' });
                          }
                        "
                        :class="[
                          active
                            ? 'bg-primaryvar5 text-white'
                            : 'text-gray-900',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        ]"
                      >
                        <Icon
                          name="uil:setting"
                          class="mr-2 h-5 w-5 group-hover:text-light400 text-primaryvar3"
                          aria-hidden="true"
                        />
                        Setting
                      </button>
                    </MenuItem> -->
                  </div>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="logout"
                      :class="[
                        active ? 'bg-primaryvar5 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                    >
                      <Icon
                        name="uil:left-arrow-from-left"
                        class="mr-2 h-5 w-5 group-hover:text-light400 text-primaryvar3"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="md:hidden flex" :class="{ invisible: is_nav_appear }">
          <Icon
            name="uil:align-center-alt"
            class="text-2xl font-extrabold hover:text-primary"
            @click="is_nav_appear = true"
          ></Icon>
        </div>
      </nav>
    </header>

    <main class="mt-[2rem] px-[5%] min-h-[calc(100vh-8rem)]">
      <slot />
    </main>
    <footer class="px-4 divide-y w-full bg-light200">
      <div
        class="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0"
      >
        <div class="lg:w-1/3">
          <nuxt-link
            rel="noopener noreferrer"
            :to="{ name: 'index' }"
            class="flex justify-start items-end gap-3 lg:justify-start"
          >
            <img src="/favicon.svg" class="self-end" />
            <h3 class="text-xl font-bold text-dark200 self-end">
              {{ $t("hibirlink") }}
            </h3>
          </nuxt-link>
        </div>
        <div
          class="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4"
        >
          <div class="space-y-3 self-center text-sm text-dark100">
            <h3 class="tracking-wide uppercase font-semibold">
              {{ $t("products") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("physical") }} {{ $t("products") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("digital") }} {{ $t("products") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("sell_on_hibirlink")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3 text-sm text-dark100">
            <h3 class="tracking-wide uppercase font-semibold">
              {{ $t("services") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("real_time") }} {{ $t("services") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("virtual") }} {{ $t("services") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("provide_services")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3 text-sm text-dark100">
            <h3 class="uppercase font-semibold">
              {{ $t("auction") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("closed") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("open") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("setup") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("participate")
                }}</a>
              </li>
            </ul>
          </div>

          <div class="space-y-3 text-sm text-dark100">
            <h3 class="uppercase font-semibold">{{ $t("delivery") }}</h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("join_hibirlink_delivery")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("partners") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>

          <div class="space-y-3 text-sm text-dark100">
            <div class="uppercase font-semibold">
              {{ $t("social_media") }}
            </div>
            <div class="flex justify-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="mailto:hibirlink@gmail.com"
                title="email"
                class="flex items-center p-1"
              >
                <Icon name="majesticons:mail" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="mdi:twitter" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="mdi:linkedin" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Facebook"
                class="flex items-center p-1"
              >
                <Icon name="mdi:facebook" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Instagram"
                class="flex items-center p-1"
              >
                <Icon name="ri:instagram-fill" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="ion:logo-tiktok" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon
                  name="ic:baseline-telegram"
                  class="w-6 h-6 text-dark200"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="py-6 text-sm text-dark200 flex items-center justify-center gap-x-8 gap-y-4"
      >
        <span>©2023 hibirlink.com, All rights reserved</span>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Privacy policy
        </a>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Terms of service
        </a>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Help center
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  MenuButton,
  Menu,
  MenuItems,
  MenuItem,
  TransitionRoot,
} from "@headlessui/vue";
import profilegql from "~/apollo/query/profile.gql";
import { useAuth } from "~/store/auth";
const store = useAuth();
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const runtimeConfig = useRuntimeConfig();

const nav_list = [
  { name: "order", path: "/", text: "Order" },
  { name: "driver", path: "/", text: "Driver" },
  { name: "review", path: "/review", text: "Review" },
  {
    name: "dispach",
    path: "/dispatch",
    text: "Dispatch",
  },
  {
    name: "map",
    path: "/map",
    text: "Map",
  },
];

const is_nav_appear = ref(false);

const {
  result: profileResult,
  onError: onFetchProfileError,
  loading: fetchProfileLoading,
  onResult: onFetchProfileResult,
} = useCustomQuery(profilegql, { id: store.$state.uid });
const profile = computed(() => {
  return profileResult.value?.profile;
});

onFetchProfileResult((result) => {
  const profile = result.data.profile.delivery;
  console.log(profile);
  store.setDeliveryID(profile.id);
});
onFetchProfileError((error) => {
  console.log(error);
});

const remove_side = () => {
  is_nav_appear.value = false;
};

const logout = () => {
  const { setToken, setUID, setName, setRole, setEmail } = useAuth();
  setToken("");
  setUID("");
  setName("");
  setRole("");
  setEmail("");
  //console.log(runtimeConfig.hibirlinkEndPoint);

  window.location.href = runtimeConfig.hibirlinkEndPoint;
};
</script>

<style scoped>
.router-link-active,
.router-link-active .active_icon {
  color: #306ee8;
}

/* .router-link-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #306ee8;
  height: 80%;
  margin: auto;
  width: 1px;
  transition: all 0.5s ease;
} */
</style>
