<template>
  <div>
    <div
      class="top-0 text-right sticky right-0 w-full px-2 items-center py-1 z-30 bg-light400/50 backdrop-blur-md flex justify-between"
    >
      <div class="lg:text-md text-sm font-semibold text-neutral200">
        <NuxtLink :to="{ name: 'for_driver' }"> Orders </NuxtLink>
      </div>

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
            v-if="driverResult"
            class="absolute right-0 px-2 py-2 origin-top-right rounded-md bg-light400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <div
                  class="group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm border-b"
                >
                  <span
                    class="flex flex-row items-center justify-center min-w-[2rem] min-h-[2rem] text-light300 bg-primaryvar4 rounded-[100%]"
                    >{{ driverResult?.delivery?.user?.first_name[0] }}</span
                  >
                  <div class="flex flex-col gap-2" v-if="driverResult">
                    <strong
                      class="text-base font-semibold text-dark200/80 whitespace-nowrap"
                    >
                      {{ driverResult?.delivery?.user?.first_name }}
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
                      router.push({ name: 'for_driver-account' });
                    }
                  "
                  :class="[
                    active ? 'bg-primaryvar5 text-white' : 'text-gray-900',
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
    <slot />
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
import driver from "~/apollo/query/driver/driver_profile.gql";
import update_driver_location_gql from "~/apollo/mutation/driver/update_driver_location.gql";
import { useAuth } from "~/store/auth";
const store = useAuth();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const id = computed(() => {
  return { id: store.uid };
});

const {
  onResult: onDriverResult,
  onError: onDriverError,
  loading: driverLoading,
  result: driverResult,
} = useCustomQuery(driver, id);
const {
  onDone: onUpdateDriverLocation,
  onError: onUpdateDriverError,
  mutate: update_driver_location,
} = useCustomMutation(update_driver_location_gql);

const handleLocationUpdate = (position: any) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(position);
  update_driver_location({
    id: id.value?.id,
    latitude: latitude,
    longitude: longitude,
  });
};

watchEffect(() => {
  console.log(driverResult.value);
});

onUpdateDriverLocation((result) => {
  console.log(result);
});

onUpdateDriverError((error) => {
  console.log(error);
});

const handleLocationError = (error: any) => {
  console.log(error);
};
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    handleLocationUpdate,
    handleLocationError
  );

  onDriverResult((result) => {
    console.log(result);
    store.setRidePhone(
      result.data?.delivery.delivery_provider.user.phone_number
    );
  });
} else {
  console.log("browser IS not Supported");
}

onDriverError((error) => {
  console.group(error);
});

const logout = () => {
  const { setToken, setUID, setName, setRole, setEmail } = useAuth();
  setToken("");
  setUID("");
  setName("");
  setRole("");
  setEmail("");
  window.location.href = runtimeConfig.hibirlinkEndPoint;
};
</script>
