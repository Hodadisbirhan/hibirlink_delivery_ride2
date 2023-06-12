<template>
  <div>
    Review

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
          >Reviewed Drivers</span
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
                class="w-[2rem] h-[2rem] flex justify-center items-center rounded-[100%] text-xs font-semibold"
                :class="{
                  'bg-light400 text-primary': selected_id === driver.id,
                  'bg-primary text-light400': selected_id != driver.id,
                }"
              >
                <Icon name="uil:star" />
                <small class="text-xs">{{
                  (driver?.driver?.total_order?.review?.count != 0 &&
                  driver?.driver?.total_order?.review?.sum?.driver_rate != null
                    ? driver?.driver?.total_order?.review?.sum?.driver_rate /
                      driver?.driver?.total_order?.review?.count
                    : 0
                  ).toFixed(1)
                }}</small>
              </span>
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
            Start To see the Review
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
              v-if="assigned_order?.length < 1"
              class="text-sm font-semibold text-primaryvar3 w-full text-center"
            >
              No Review
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
                        from {{ numberStore(order?.order_details) }} Store
                      </span>
                      <!-- <NuxtLink
                        class="text-[0.7rem] font-semibold tracking-wide bg-primaryvar3 hover:bg-primaryvar4 text-light400 flex gap-1 px-2 py-[2px] items-center rounded-2xl"
                        :to="{
                          name: 'dispatch-order_id',
                          params: {
                            order_id: order?.id,
                          },
                        }"
                      >
                        <Icon name="uil:map-marker" class="text-base" />
                        <span>track</span>
                      </NuxtLink> -->
                    </div>
                    <div class="flex flex-col gap-1">
                      <span
                        class="text-xs font-semibold flex items-center text-primary"
                      >
                        <Icon name="uil:star" class="text-primary text-base" />
                        {{ order?.driver_rate }}
                      </span>
                      <span class="text-xs font-semibold text-dark300/60">
                        {{ order?.driver_comment }}
                      </span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-sm">
                        to {{ order?.user?.first_name }}
                      </span>

                      <!-- <span
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
                      </span> -->
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import fetch_all_driver from "~/apollo/query/driver/fetch_all_driver.gql";
import all_unAssigned_or_unAccepted_order from "~/apollo/query/orders/all_order.gql";
import { useAuth } from "~/store/auth";
const selected_id = ref("");
const store = useAuth();
const enable_query = ref(false);
const is_desktop = ref(true);
const is_new_order = ref(false);
const swap_tap = (value: boolean) => {
  is_new_order.value = value;
};
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

const order_for_aparticular_order = computed(() => {
  return {
    where: {
      _and: [
        {
          driver_rate: { _gte: 1 },
        },
        {
          driver_id: { _eq: selected_id.value },
        },
        {
          status: {
            _in: ["completed", "delivered"],
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
  onError: onfetchAllDriverError,
  refetch: refechAllDriver,
  result: allDriverResult,
  loading: loading_fetch_all_driver,
} = useCustomQuery(fetch_all_driver, variable);

const drivers = computed(() => {
  return allDriverResult.value?.drivers;
});

const {
  onError: onFetchAssignedError,
  refetch: refechAassignedOrder,
  loading: loading_assigned_order,
  result: assignedOrderResult,
} = useCustomQuery(
  all_unAssigned_or_unAccepted_order,
  order_for_aparticular_order,
  0,
  enable_query
);

const assigned_order = computed(() => {
  return assignedOrderResult.value?.product_order;
});

const select_driver = (id: string) => {
  selected_id.value = id;
  is_desktop.value = false;
};

watch(selected_id, (selected) => {
  if (selected) {
    enable_query.value = true;
  }
});

const total_order_count = ref(0);
</script>
