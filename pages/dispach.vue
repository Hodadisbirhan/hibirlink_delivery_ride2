<script setup lang="ts">
import fetch_all_driver from "~/apollo/query/driver/fetch_driver_with_order.gql";
import all_unAssigned_or_unAccepted_order from "~/apollo/query/orders/all_order.gql";
import assigned_order_to_driver from "~/apollo/mutation/driver/assigned_order_todriver.gql";
import unassigned_order_gql from "~/apollo/mutation/order/unassigned.gql";
import { useAuth } from "~/store/auth";
const selected_id = ref("");
const is_desktop = ref(true);
const is_new_order = ref(false);
const show_dialog = ref(false);
const show_notification = ref(false);
const notification_message = ref("");
const loading = ref(false);
const success = ref(false);
const order_id = ref("");
const error_fetch = ref("");
const store = useAuth();
const variable = computed(() => {
  return {
    where: {
      driver: {
        _and: [{ delivery_provider: { user: { id: { _eq: store.uid } } } }], // we need to  change with the signedin id
        // worked_at: {
        //   is_null: false,
        // },
      },
    },
  };
});

const order_variable = {
  where: {
    _and: [
      {
        delivery_provider: { user: { id: { _eq: store.uid } } }, // we need to  change with the signedin id
      },
      {
        status: {
          _in: ["waiting", "rejected_by_driver", "pending"],
        },
      },
    ],
  },
};

const order_for_aparticular_order = computed(() => {
  return {
    where: {
      _and: [
        {
          driver_id: { _eq: selected_id.value },
        },
        {
          status: {
            _in: ["waiting", "accepted_driver", "ontheway", "picked"],
          },
        },
      ],
    },
  };
});

const to_list = () => {
  is_desktop.value = true;
};
const {
  mutate: unassigned_order,
  onError: onUnAssignedOrderError,
  onDone: onUnAssignedOrderCompleted,
} = useCustomMutation(unassigned_order_gql);
const {
  onError: onfetchAllDriverError,
  refetch: refechAllDriver,
  result: allDriverResult,
  loading: loading_fetch_all_driver,
} = useCustomQuery(fetch_all_driver, variable);
const {
  onError: onFetchAssignedError,
  refetch: refechAassignedOrder,
  loading: loading_assigned_order,
  result: assignedOrderResult,
} = useCustomQuery(
  all_unAssigned_or_unAccepted_order,
  order_for_aparticular_order
);

const {
  onError: onFetchUnassingedOrderError,
  result: unassignedOrderResult,
  loading: onassignedOrderLoading,
  refetch: refechUnassignedOrder,
} = useCustomQuery(all_unAssigned_or_unAccepted_order, order_variable);

const {
  mutate: assignOrder,
  onDone: onAssignedOrderCompleted,
  onError: onAssignedOrderError,
} = useCustomMutation(assigned_order_to_driver);

const assigned_order = computed(() => {
  return assignedOrderResult.value?.product_order;
});

const drivers = computed(() => {
  return allDriverResult.value?.drivers;
});

const unassigned_order_result = computed(() => {
  return unassignedOrderResult.value?.product_order;
});

const select_driver = (id: string) => {
  selected_id.value = id;
  is_desktop.value = false;
};

const swap_tap = (value: boolean) => {
  is_new_order.value = value;
};
onfetchAllDriverError((error) => {
  console.log(error);
});

onFetchUnassingedOrderError((error) => {
  console.log(error);
});

const onSelectedDriver = (driver_id: String) => {
  loading.value = true;
  assignOrder({
    id: order_id.value,
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
  show_dialog.value = false;
  refechAllDriver();
  refechUnassignedOrder();
});

onAssignedOrderError((error) => {
  success.value = false;
  show_notification.value = true;
  notification_message.value = error.message;
  loading.value = false;
});
const unAssignedHandler = (order_id: any) => {
  loading.value = true;
  unassigned_order({
    order_id: order_id,
    set: {
      driver_id: null,
      status: "pending",
    },
  });
};

onUnAssignedOrderCompleted((result) => {
  loading.value = false;
  show_notification.value = true;
  notification_message.value = "UnAssigned Successfully";
  success.value = true;
  refechUnassignedOrder();
  refechAllDriver();
});
onUnAssignedOrderError((error) => {
  loading.value = false;
  show_notification.value = true;
  notification_message.value = error.message;
  success.value = false;
});

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div class="flex flex-row py-1 gap-1 w-full h-[calc(100vh-4rem)]">
    <h-notification
      :success="success"
      :message="notification_message"
      v-model="show_notification"
    />
    <div class="pb-3"></div>

    <div class="flex flex-row gap-0 w-full h-full" v-if="!is_new_order">
      <div
        v-if="loading_fetch_all_driver"
        class="md:w-[18rem] w-full flex py-5 justify-center h-full pr-1"
      >
        <h-loading class="text-2xl w-9 h-10 font-bolder" />
      </div>
      <ul
        :class="[is_desktop ? 'flex' : 'hidden']"
        class="md:flex flex-col gap-2 md:w-[18rem] w-full bg-light400 h-full md:border-primaryvar8 divide-y-2 divide-y-primary overflow-y-auto pr-1"
        v-else-if="drivers"
      >
        <span
          class="text-sm font-semibold sticky top-0 left-0 py-1 bg-light400 md:block hidden"
          >Assigned Order</span
        >
        <li
          v-for="driver in drivers"
          :key="driver.id"
          class="flex flex-row cursor-pointer gap-4 px-3 text-dark300/60 items-center rounded-md py-1"
          @click="select_driver(driver.id)"
          :class="[
            selected_id === driver.id
              ? 'text-light400 bg-primaryvar3'
              : 'hover:bg-primaryvar8',
          ]"
        >
          <span
            class="min-w-[2rem] font-semibold text-sm tracking-tighter flex justify-center items-center text-center w-[2rem] min-h-[2rem] h-[2rem] rounded-[100%] bg-darkblue/50 uppercase text-light400"
          >
            {{ driver.first_name[0] }}{{ driver.last_name[0] }}
          </span>
          <div class="flex gap-1 flex-col w-full">
            <span class="text-sm font-semibold line-clamp-1">
              {{ driver.first_name }}
              {{ driver.last_name }}
            </span>
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold line-clamp-1">
                {{ driver.email }}
              </span>

              <span
                class="w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-[100%] text-xs font-semibold"
                :class="{
                  'bg-light400 text-primary': selected_id === driver.id,
                  'bg-primary text-light400': selected_id != driver.id,
                }"
                >{{ driver.driver.total.order.value }}</span
              >
            </div>
          </div>
        </li>
      </ul>
      <div
        class="flex-1 w-full flex-grow border-[1px] border-primaryvar8/60 bg-light300/40 h-full overflow-y-auto text-dark200 rounded-md py-3 px-3"
        :class="[is_desktop ? 'md:block hidden' : 'block']"
      >
        <div
          class="w-[3rem] h-[3rem] md:hidden hover:bg-light300 rounded-[100%] flex justify-center items-center"
          @click="to_list"
        >
          <Icon
            name="uil:arrow-left"
            class="text-lg font-semibold text-primaryvar3"
          >
          </Icon>
        </div>
        <div class="h-full flex w-full flex-col py-4 gap-3" v-if="!selected_id">
          <h2 class="text-lg line-clamp-1 font-semibold text-darkblue/60">
            Start To see the order
          </h2>
          <span class="text-sm font-medium text-dark200/60">
            when You select the driver you will see the orders which is accepted
            by that driver and the you will track the order if it is live
          </span>
        </div>
        <div v-else>
          <!-- {{ assigned_order }} -->

          <div
            v-if="loading_assigned_order"
            class="flex gap-1 md:px-3 px-1 bg-light200 rounded-md w-full lg:w-[30rem] flex-col h-full overflow-y-auto"
          >
            <h-loading class="text-2xl w-9 h-10 font-bolder text-primary" />
          </div>
          <ul
            class="flex gap-2 bg-light400 rounded-md w-full flex-col h-full overflow-y-auto"
            v-else-if="assigned_order"
          >
            <li
              v-if="assigned_order.length < 1"
              class="text-sm font-semibold text-primaryvar3 w-full text-center"
            >
              No Assigned Ordered
            </li>

            <li
              class="flex flex-row gap-2 border-[1px] border-primaryvar8 px-3 py-2 rounded-md"
              v-for="order in assigned_order"
              :key="order.id"
            >
              <div class="w-full flex gap-2 flex-col">
                <div class="flex justify-between text-light400 items-center">
                  <h1 class="text-sm font-semibold text-darkblue uppercase">
                    order {{ order.id }}
                  </h1>

                  <span
                    class="px-2 py1 rounded bg-primaryvar8 text-dark300/50 text-xs"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <hr class="border-primaryvar8" />

                <div class="flex flex-row gap-6">
                  <div class="flex flex-col gap-0 items-center min-h-fit">
                    <Icon name="uil:home-alt" class="text-primaryvar3" />
                    <span
                      class="w-[1px] border border-dashed flex-1 border-primaryvar3"
                    >
                    </span>
                    <Icon
                      name="uil:location-pin-alt"
                      class="text-primaryvar3"
                    />
                  </div>
                  <div
                    class="flex flex-col gap-11 font-semibold text-dark200/40 w-full"
                  >
                    <div class="flex justify-between w-full text-sm">
                      <span>
                        from {{ numberStore(order.order_details) }} Store
                      </span>
                      <NuxtLink
                        class="text-[0.7rem] font-semibold tracking-wide bg-primaryvar3 hover:bg-primaryvar4 text-light400 flex gap-1 px-2 py-[2px] items-center rounded-2xl"
                        :to="{
                          name: 'dispatch-order_id',
                          params: {
                            order_id: order.id,
                          },
                        }"
                      >
                        <Icon name="uil:map-marker" class="text-base" />
                        <span>track</span>
                      </NuxtLink>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-sm">
                        to {{ order.user.first_name }}
                      </span>
                      <span
                        class="text-[0.7rem] font-semibold text-dark300/40"
                        v-if="order?.shipping_address"
                      >
                        {{
                          order.shipping_address.sub_city.region_city.translate
                            .to[1].name
                        }},
                        {{
                          order.shipping_address.sub_city.translate.to[1].name
                        }},

                        {{ order.shipping_address.state_provinence }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="w-full md:w-[40%]"
      :class="{ 'lg:flex hidden': !is_new_order, flex: is_new_order }"
    >
      <div
        class="flex fixed z-20 top-0 h-[100vh] left-0 bottom-0 right-0 w-full bg-dark300/20 justify-center items-center"
        v-if="loading && !show_dialog"
      >
        <h-loading class="text-4xl font-bold text-primary" />
      </div>

      <div
        v-if="onassignedOrderLoading"
        class="flex gap-1 md:px-3 px-1 bg-light300/60 rounded-md w-full flex-col h-full overflow-y-auto"
      >
        <h-loading class="text-2xl w-9 h-10 font-bolder text-primary" />
      </div>
      <ul
        class="flex gap-1 md:px-3 px-1 bg-light300/40 border-[1px] border-primaryvar8 rounded-md w-full flex-col h-full overflow-y-auto"
        v-else-if="unassigned_order_result"
      >
        <span
          class="text-sm font-semibold sticky top-0 z-0 left-0 right-0 w-full py-2 px-3 bg-transparent backdrop-blur-lg md:block hidden"
          >New Order</span
        >
        <li
          v-if="unassigned_order_result.length < 1"
          class="text-sm font-semibold text-primaryvar3 w-full text-center"
        >
          No New Order
        </li>

        <li
          class="flex flex-row gap-2 border-[1px] border-primaryvar8 bg-light400/30 px-3 py-2 rounded-md"
          v-for="order in unassigned_order_result"
          :key="order.id"
        >
          <div class="w-full flex gap-2 flex-col">
            <div class="flex justify-between text-light400 items-center">
              <strong class="text-sm font-semibold text-darkblue uppercase">
                order {{ order.id }}
              </strong>
              <span
                v-if="order.status === 'waiting'"
                class="px-2 py1 rounded bg-primaryvar8 text-dark300/50 text-xs"
              >
                {{ order.status }}
              </span>

              <span
                v-if="order.status === 'rejected_by_driver'"
                class="px-2 py1 rounded bg-primaryvar8 text-dark300/50 text-xs"
              >
             rejected
              </span>
              <button
                v-if="
                  order.status === 'pending' ||
                  order.status === 'rejected_by_driver'
                "
                @click="
                  () => {
                    show_dialog = true;
                    order_id = order.id;
                  }
                "
                class="text-xs font-semibold px-3 py-1 rounded-md text-primary bg-light400 border-[1px] border-primary hover:bg-primary hover:text-light400"
              >
                + Assign
              </button>
              <button
                v-if="order.status === 'waiting'"
                @click="
                  () => {
                    unAssignedHandler(order.id);
                  }
                "
                class="text-xs font-semibold px-3 py-1 border-[1px] hover:bg-primaryvar2 hover:text-light400 rounded-md text-primaryvar2"
              >
                Unassign
              </button>
            </div>
            <hr class="bg-primaryvar5" />

            <div class="flex flex-row gap-6">
              <div class="flex flex-col gap-0 items-center min-h-fit">
                <Icon name="uil:home-alt" class="text-primaryvar3" />
                <span
                  class="w-[1px] border border-dashed flex-1 border-primaryvar3"
                >
                </span>
                <Icon name="uil:location-pin-alt" class="text-primaryvar3" />
              </div>
              <div
                class="flex flex-col gap-11 font-semibold text-dark200/40 w-full"
              >
                <div class="flex justify-between w-full text-sm">
                  <span>
                    from {{ numberStore(order.order_details) }} Store
                  </span>
                  <NuxtLink
                    class="text-[0.7rem] font-semibold bg-primaryvar3 hover:bg-primaryvar4 text-light400 flex gap-2 px-2 py-[2px] items-center rounded-2xl"
                    :to="{
                      name: 'dispatch-order_id',
                      params: {
                        order_id: order.id,
                      },
                    }"
                  >
                    <Icon name="uil:map-marker" class="text-base" />
                    <span>Map</span>
                  </NuxtLink>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs"> to {{ order.user.first_name }} </span>
                  <span class="text-[0.7rem]" v-if="order.shipping_address">
                    {{
                      order.shipping_address.sub_city.region_city.translate
                        .to[1].name
                    }}
                    ,
                    {{ order.shipping_address.sub_city.translate.to[1].name }} ,

                    {{ order.shipping_address.state_provinence }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="flex md:hidden flex-row bg-primaryvar8 justify-around fixed bottom-0 h-[4rem] items-center left-0 right-0"
    >
      <button
        class="text-sm bg-darkblue font-semibold text-light400 px-2 py-2 h-fit rounded"
        @click="swap_tap(false)"
      >
        Assigned Order
      </button>
      <button
        class="text-sm bg-darkblue font-semibold h-fit py-2 rounded text-light400 px-2"
        @click="swap_tap(true)"
      >
        New Orders
      </button>
    </div>

    <h-dialog
      v-model="show_dialog"
      title="Assign Order"
      class="2xl:w-[50%] xl:w-[55%] lg:w-[60%] md:w-[70%] w-[90%] h-[calc(100vh-10rem)] overflow-y-auto"
    >
      <template #content>
        <div class="flex flex-col relative gap-1 w-full bg-light400">
          <div
            class="flex fixed z-20 top-0 h-[100vh] left-0 bottom-0 right-0 w-full bg-dark300/20 justify-center items-center"
            v-if="loading"
          >
            <h-loading class="text-4xl font-bold text-primary" />
          </div>
          <ul class="w-full flex flex-col gap-3 h-full" v-if="drivers">
            <li
              class="flex flex-row w-full justify-between px-2 font-semibold text-base"
            >
              <span>Drivers</span>
              <span>#Assigned Order</span>
            </li>
            <hr />
            <li
              class="flex flex-row w-full group justify-between cursor-pointer gap-3 hover:bg-primaryvar4/40 rounded text-dark300/60"
              v-for="driver in drivers"
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
  </div>
</template>
