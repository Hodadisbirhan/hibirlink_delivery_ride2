<script setup lang="ts">
import all_unAssigned_or_unAccepted_order from "~/apollo/query/orders/all_order.gql";
import fetch_all_driver from "~/apollo/query/driver/fetch_driver_with_order.gql";
import assigned_order_to_driver from "~/apollo/mutation/driver/assigned_order_todriver.gql";
import { useAuth } from "~/store/auth";
const selected_order_id = ref(null);
const show_driver_dialog = ref(false);
const show_notification = ref(false);
const notification_message = ref("");
const loading = ref(false);
const success = ref(false);
const enable_query = ref(false);
const center = reactive({ lng: 0, lat: 0 });
const store = useAuth();
console.log(store.uid);
const order_variable = {
  where: {
    _and: [
      { delivery_provider: { owner_id: { _eq: store.uid } } },
      // {
      //   delivery_id: { _eq: store.$state.delivery_id }, // we need to  change with the signedin id
      // },
    ],
  },
};
const variable = computed(() => {
  return {
    where: {
      // driver: {
      //   _and: [{ worked_at: { _eq: store.$state.delivery_id } }], // we need to  change with the signedin id
      //   // worked_at: {
      //   //   is_null: false,
      //   // },
      // },
      driver: { delivery_provider: { owner_id: { _eq: store.uid } } },
    },
  };
});
const {
  onError: onFetchOrdersError,
  refetch: refechAassignedOrder,
  loading: loading_order,
  result: assignedOrderResult,
} = useCustomQuery(all_unAssigned_or_unAccepted_order, order_variable);
const {
  
  onError: onfetchAllDriverError,
  // refetch: refechAllDriver,
  result: allDriverResult,
  loading: loading_fetch_all_driver,
} = useCustomSubscription(fetch_all_driver, variable);
const {
  mutate: assignOrder,
  onDone: onAssignedOrderCompleted,
  onError: onAssignedOrderError,
} = useCustomMutation(assigned_order_to_driver);

let i = 0.1;
const driverResult = computed(() => {
  console.log(allDriverResult);

  return allDriverResult.value?.drivers?.map((element: any) => {
    i = i + 0.1;
    return {
      popup: {
        id: element.id,
        icon: "uil:car",
        role: "driver",
        name: element.first_name + " " + element.last_name,
        email: element.email,
        phone: element.phone_number,
        total_order: element?.driver?.total?.order?.value,
      },
      lat: element.driver.latitude || i,
      lng: element.driver.longitude || i,
      staticAnchor: [4, 6],
      customText: {
        icon: "uil:car",
        role: "driver",
        total_order: element.driver.total.order.value,
      },
    };
  });
});

watchEffect(() => {
  console.log(driverResult?.value);
});

const orderResult = computed(() => {
  return assignedOrderResult.value?.product_order?.map((element: any) => {
    return {
      popup: {
        id: element.id,
        icon: "uil:home",
        role: "customer",
        name: element.user.first_name + " " + element.user.last_name,
        email: element.user.email,
        location_icon: "uil:location-point",
        address: element.shipping_address,
        number_store: numberStore(element.order_details),
        status: element.status,
        driver: element.driver,
      },
      lat: element?.shipping_address?.latitude || 0,
      lng: element?.shipping_address?.longitude || 0,
      staticAnchor: [4, 6],
      customText: { date: formatDate(element.created_at), role: "order" },
    };
  });
});
onMounted(() => {
  window.navigator.geolocation.getCurrentPosition((e) => {
    console.log(e.coords.altitude);
    center.lat = e.coords.latitude;
    center.lng = e.coords.longitude;
  });
});

onFetchOrdersError((err) => {
  console.log(err);
});

watch(
  () => store.$state.delivery_id,
  (value) => {
    if (value) {
      enable_query.value = true;
    }
  }
);

const onSelectedDriver = (driver_id: String) => {
  loading.value = true;
  assignOrder({
    id: selected_order_id.value,
    set: {
      driver_id: driver_id,
      status: "waiting",
    },
  });
};

onAssignedOrderCompleted((result) => {
  console.log(result);
  success.value = true;
  show_notification.value = true;
  notification_message.value = "Assigned Successfully";
  loading.value = false;
  show_driver_dialog.value = false;
  //refechAllDriver();
  refechAassignedOrder();
});

onAssignedOrderError((error) => {
  success.value = false;
  show_notification.value = true;
  notification_message.value = error.message;
  loading.value = false;
});

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div class="relative w-full h-[calc(100vh-8rem)]">
    <h-notification
      :success="success"
      :message="notification_message"
      v-model="show_notification"
    />
    <h-dialog
      v-model="show_driver_dialog"
      title="Assign Order"
      class="2xl:w-[50%] xl:w-[55%] lg:w-[60%] md:w-[70%] w-[90%] h-[calc(100vh-10rem)] overflow-y-auto"
    >
      <template #content>
        <div class="flex flex-col relative gap-1 w-full bg-light400">
          <div
            class="flex fixed z-20 top-0 h-[100vh] left-0 bottom-0 right-0 w-full bg-dark300/60 justify-center items-center"
            v-if="loading"
          >
            <h-loading class="text-4xl font-bold text-primary" />
          </div>
          <ul
            class="w-full flex flex-col gap-3 h-full"
            v-if="allDriverResult?.drivers"
          >
            <li
              class="flex flex-row w-full justify-between px-2 font-semibold text-base"
            >
              <span>Drivers</span>
              <span>#Assigned Order</span>
            </li>
            <hr />
            <li
              class="flex flex-row w-full group justify-between cursor-pointer gap-3 hover:bg-primaryvar4/40 rounded text-dark300/60"
              v-for="driver in allDriverResult?.drivers"
              :key="driver.id"
              @click="onSelectedDriver(driver.id)"
            >
              <div class="flex flex-col py-1 px-2 gap-1">
                <span class="text-sm font-semibold">
                  {{ driver.first_name }} {{ driver.last_name }}
                </span>
                <span class="text-xs font-medium">
                  {{ driver.email }}
                </span>
              </div>

              <span
                class="h-[1.5rem] min-w-[1.5rem] flex justify-center items-center bg-primaryvar5 rounded-[100%] group-hover:bg-light400 group-hover:text-primaryvar3 text-light400"
              >
                {{ driver.driver.total.order.value }}
              </span>
            </li>
          </ul>
        </div>
      </template>
    </h-dialog>

    <!-- <div
      class="px-3 py-2 w-full md:w-[80%] z-50 flex gap-12 rounded shadow-sm drop-shadow absolute top-1 right-3 bg-light400"
    >
      <div class="flex gap-4 items-center">
        <span
          class="flex rounded-[100%] bg-primaryvar4 min-w-[2rem] min-h-[2rem] items-center justify-center w-[2rem] h-[2rem]"
          >2</span
        >

        <span>Active Order </span>
      </div>
      <div class="flex gap-4 items-center">
        <span
          class="flex rounded-[100%] bg-primaryvar4 min-w-[2rem] min-h-[2rem] items-center justify-center w-[2rem] h-[2rem]"
          >5</span
        >
        <span>Active Driver</span>
      </div>
    </div> -->
    <h-geo-location-map
      :center="center"
      :maxZoom="19"
      :minZoom="1"
      :zoom="10"
      v-if="orderResult"
      :information="[...orderResult, ...driverResult]"
    >
      <template #popup="{ popup }">
        <div>
          <div
            class="px-8 py-2 rounded flex flex-col gap-4 bg-light400 text-sm font-semibold text-neutral-500"
            v-if="popup.role === 'customer'"
          >
            <div class="flex justify-end">
              <span
                class="text-xs rounded-3xl font-semibold py-1 px-3 bg-primaryvar6 text-light400"
              >
                {{ popup.status }}
              </span>
            </div>
            <div class="flex w-full gap-3 items-center">
              <Icon
                :name="popup.icon"
                class="text-2xl font-bold text-primaryvar3"
              />
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-semibold text-primaryvar3">
                  {{ popup.role }}
                </h2>
                <span> Name: {{ popup.name }} </span>
                <span>email:{{ popup.email }}</span>
              </div>
            </div>
            <hr class="bg-primaryvar5" />

            <div aria-label="store" class="flex items-center gap-3">
              <Icon
                :name="popup.location_icon"
                class="text-2xl font-bold text-primaryvar3"
              ></Icon>
              <div class="flex flex-col gap-2">
                <h2 class="text-xl font-semibold text-primaryvar3">Store</h2>
                <span>{{ popup.number_store }} Stores</span>
              </div>
            </div>
            <div class="flex flex-row gap-1">
              <div>
                <button
                  v-if="popup.status === 'pending'"
                  @click="
                    () => {
                      selected_order_id = popup.id;
                      show_driver_dialog = true;
                    }
                  "
                  class="text-sm bg-primaryvar2/60 py-1 px-2 text-light300 rounded-md flex gap-2"
                >
                  + Assign
                </button>
                <button
                  v-else
                  class="flex border-[1px] border-light400 items-center gap-4 bg-primaryvar8 px-2 py-1 rounded-md"
                >
                  <Icon
                    name="uil:user-minus"
                    class="text-primaryvar4 text-3xl font-bold"
                  />
                  {{ popup.driver.user.email }}
                </button>
              </div>
            </div>
          </div>
          <div
            v-else-if="popup.role === 'driver'"
            class="text-sm font-semibold flex gap-4 flex-col w-full"
          >
            <div
              class="w-full flex justify-between bg-primaryvar6 px-2 py-1 rounded-xl"
            >
              <span class="text-light200">Assigned Order</span
              ><span
                class="text-xs font-semibold bg-primaryvar1 text-light400 text-end px-2 py-1 w-fit rounded-[100%]"
                >{{ popup.total_order }}</span
              >
            </div>
            <div class="flex gap-2 flex-col text-dark300/70">
              <span>{{ popup.name }}</span>
              <span>{{ popup.email }}</span>
            </div>
            <hr />
            <span class="text-dark300/50">+251{{ popup.phone }}</span>
            <div class="flex justify-end w-full gap-4">
              <Icon name="uil:phone" class="text-lg text-primaryvar2" />
              <Icon
                name="uil:comment-message"
                class="text-lg text-primaryvar2"
              />
            </div>
          </div>
        </div>
      </template>
      <template #customText="{ value }">
        <div>
          <div
            v-if="value.text.role === 'order'"
            class="relative text-[0.5rem] rounded-[100%] flex justify-center items-center text-center text-light400 bg-primaryvar3 shadow-2xl drop-shadow-2xl font-semibold w-[3rem] h-[3rem]"
          >
            {{ value.text.date }}
          </div>
          <div
            v-if="value.text.role === 'driver'"
            class="rounded-[100%] relative bg-light200 w-[2.5rem] h-[2.5rem] flex justify-center items-center"
          >
            <span
              class="text-xs flex justify-center items-center bg-primary border-[1px] border-light300 text-light400 py-1 px-1 rounded-[100%] absolute -top-1 -right-1 z-20 h-[1.2rem] w-[1.2rem]"
              >{{ value.text.total_order }}</span
            >
            <div
              class="flex items-center justify-center text-light400 bg-primary w-[2rem] h-[2rem] rounded-[100%]"
            >
              <Icon :name="value.text.icon" class="text-2xl" />
            </div>
          </div>
        </div>
      </template>
    </h-geo-location-map>
  </div>
</template>
