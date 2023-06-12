<script setup lang="ts">
import all_order from "~/apollo/query/orders/all_orders_for_order_page.gql";
import order_detail from "~/apollo/query/orders/order_detail.gql";
import assigned_order_to_driver from "~/apollo/mutation/driver/assigned_order_todriver.gql";
import fetch_all_driver from "~/apollo/query/driver/fetch_driver_with_order.gql";
import unassigned_order_gql from "~/apollo/mutation/order/unassigned.gql";
import { useAuth } from "~/store/auth";
const show_detail_controller = ref(false);
const selected_tab = ref(["waiting", "pending"]);
const selected_order_id = ref(null);
const enable_order_detail = ref(false);
const order_detail_value: any = ref();
const show_driver_dialog = ref(false);
const show_notification = ref(false);
const notification_message = ref("");
const loading = ref(false);
const success = ref(false);
const enable_read_driver = ref(false);
const show_dialog_for_assigned_order = ref(false);
const store = useAuth();
definePageMeta({
  middleware: "auth",
});
const header = [
  "order_number",
  "customer_name",
  "customer_phone",
  "order_at",
  "total_price(Birr)",
  "total_item",
  "shipping_fee(Birr)",
  "driver",
  "status",
  "action",
];

const detail_header = [
  "product_name",
  "quantity",
  "discount",
  "unit_price",
  "store_name",
  "store_location",
  "supplier",
  "product_status",
];

const search = ref("");
const limit = ref(10);
const offset = ref(0);
const driver_variable = computed(() => {
  return {
    where: {
      driver: {
        _and: [{ worked_at: { _eq: store.$state.delivery_id } }], // we need to  change with the signedin id
        // worked_at: {
        //   is_null: false,
        // },
      },
    },
  };
});

const variable = computed(() => {
  return {
    order_by: {
      id: "asc",
    },
    limit: limit.value,
    offset: offset.value,
    where: {
      _and: [
        {
          delivery_provider: { user: { id: { _eq: store.$state.uid } } },
        },
        {
          status: {
            _in: selected_tab.value,
          },
        },
        {
          _or: [
            {
              status: { _iregex: search.value.trim() },
            },
            {
              transaction_key: {
                _iregex: search.value.trim(),
              },
            },
            {
              user: {
                _or: [
                  {
                    first_name: {
                      _iregex: search.value.trim(),
                    },
                  },
                  {
                    last_name: {
                      _iregex: search.value.trim(),
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
});
// for query
const {
  onError: onfetchAllDriverError,
  refetch: refechAllDriver,
  result: allDriverResult,
  loading: loading_fetch_all_driver,
} = useCustomQuery(fetch_all_driver, driver_variable, 0, enable_read_driver);
const {
  loading: loading_order,
  onError: onOrderFetchError,
  result: orderResult,
  refetch: refetchOrder,
} = useCustomQuery(all_order, variable, 500);

const {
  loading: loading_order_detail,
  onError: onOrderDetailFetchError,
  onResult: onOrderDetailResult,
  refetch: refetchOrderDetail,
} = useCustomQuery(
  order_detail,
  { id: selected_order_id },
  0,
  enable_order_detail
);
// for mutation
const {
  mutate: assignOrder,
  onDone: onAssignedOrderCompleted,
  onError: onAssignedOrderError,
} = useCustomMutation(assigned_order_to_driver);
const {
  mutate: unassigned_order,
  onError: onUnAssignedOrderError,
  onDone: onUnAssignedOrderCompleted,
} = useCustomMutation(unassigned_order_gql);

const drivers = computed(() => {
  return allDriverResult.value?.drivers;
});

const compute_price = (data: any) => {
  return data.reduce((total: number, element: any) => {
    return (
      total +
      element.quantity *
        (element.unit_price -
          element.discount -
          (element.unit_price - element.discount) *
            ((element?.special_discount_rate
              ? element.special_discount_rate
              : 0) /
              100))
    );
  }, 0);
};

const order_result = computed(() => {
  const data = orderResult.value?.product_order;
  console.log(data);

  if (data)
    return data.map((element) => {
      return {
        id: element.id,
        customer_name: element.user.first_name + " " + element.user.last_name,
        order_at: element.created_at,
        total_item: element.total.product.value?.quantity,
        customer_phone: element?.shipping_address?.phone_number1,
        status: element.status,
        total_price: compute_price(element.order_details),
        shipping_fee: element.shipping_fee,
        driver: element?.driver?.user?.email,
      };
    });
});

const total_product = computed(() => {
  return orderResult.value?.total_order?.total?.count;
});

onOrderDetailResult((result) => {
  console.log(result);
  order_detail_value.value = result.data?.order;
  enable_order_detail.value = false;
});

onOrderFetchError((error) => {
  enable_order_detail.value = false;
  console.log(error);
});

onOrderDetailFetchError((error) => {
  console.log(error);
});

const select_tab_handler = (tab: any) => {
  console.log(tab);
  if (tab === "New Arrival") selected_tab.value = ["waiting", "pending"];
  else if (tab === "On Dispatched")
    selected_tab.value = ["accepted_driver", "picked", "ontheway"];
  else if (tab === "Completed") selected_tab.value = ["completed", "delivered"];
  else if (tab === "Rejected") {
    selected_tab.value = ["rejected_by_driver"];
  }
};

const show_detail = (id: any) => {
  selected_order_id.value = id;
  enable_order_detail.value = true;
  show_detail_controller.value = true;
};

const onSelectedDriver = (driver_id: any) => {
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
  show_notification.value = true;
  notification_message.value = "Assigned Successfully";
  loading.value = false;
  success.value = true;
  show_dialog_for_assigned_order.value = false;
  enable_read_driver.value = false;
  refetchOrder();
});

onAssignedOrderError((error) => {
  show_notification.value = true;
  notification_message.value = error.clientErrors[0].message;
  loading.value = false;
  success.value = false;
  enable_read_driver.value = false;
});
const actionHandler = (action: any) => {
  console.log(action);
  if (action.action === "Unassign") {
    selected_order_id.value = action.id;
    loading.value = true;
    unassigned_order({
      order_id: action.id,
      set: {
        driver_id: null,
        status: "pending",
      },
    });
  } else if (action.action === "Assign") {
    selected_order_id.value = action.id;
    show_dialog_for_assigned_order.value = true;
    enable_read_driver.value = true;
  } else if (action.action === "view detail") {
    selected_order_id.value = action.id;
    enable_order_detail.value = true;
    show_detail_controller.value = true;
  }
};

onUnAssignedOrderCompleted((result) => {
  loading.value = false;
  show_notification.value = true;
  notification_message.value = "UnAssigned Successfully";
  success.value = true;
  refetchOrder();
});
onUnAssignedOrderError((error) => {
  loading.value = false;
  show_notification.value = true;
  notification_message.value = error.message;
  success.value = false;
});

const updateOffset = (value: any) => {
  offset.value = value;
};
</script>

<template>
  <div class="">
    <h-notification
      :success="success"
      :message="notification_message"
      v-model="show_notification"
    />
    <h1 class="text-xl font-bold text-dark300 pb-1">Orders</h1>

    <div class="relative flex-row-reverse flex-wrap flex justify-between">
      <div class="relative z-30 lg:min-w-[20rem] w-fit lg:-mb-3">
        <div class="absolute top-[20%] left-1 pl-2">
          <Icon name="uil:search" />
        </div>
        <input
          type="search"
          v-model="search"
          placeholder="Search"
          class="border px-2 pl-8 rounded outline-none placeholder:text-primaryvar5 border-primaryvar4 focus:ring-1 ring-offset-0 w-full hover:ring-primary h-[2.5rem]"
        />
      </div>

      <h-tab
        :tabs="[
          { text: 'New Arrival' },
          { text: 'On Dispatched' },
          { text: 'Completed' },
          { text: 'Rejected' },
        ]"
        @selected:tab="select_tab_handler"
        parent-class="flex justify-start w-full overflow-x-auto overflow-y-hidden"
        tab-class="whitespace-nowrap"
      >
      </h-tab>
    </div>

    <h-dialog
      title="Order Detail"
      v-model="show_detail_controller"
      title-class="px-5 text-primary text-[1.5rem] font-semibold"
      class="lg:w-[85%] w-full min-h-[80vh] max-h-[100vh] overflow-y-auto 2xl:w-[80%] 3xl:w-[70%] 4xl:w-[50%]"
    >
      <template #content>
        <div
          v-if="loading_order_detail"
          class="flex justify-center items-center w-full h-full"
        >
          <h-loading class="text-6xl text-primary font-bolder bg-light400" />
        </div>
        <div class="px-5 py-1" v-else-if="order_detail_value">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col gap-2 mb-10">
              <h1 class="uppercase text-primaryvar1">
                Order-{{ order_detail_value.id }}
              </h1>
              <span class="text-sm font-semibold text-primaryvar2">{{
                formatDate(order_detail_value.created_at)
              }}</span>
            </div>

            <span
              class="text-xs font-semibold px-2 py-[2px] h-fit flex justify-center items-center rounded-2xl bg-primaryvar6 text-light400"
            >
              {{ order_detail_value.status }}
            </span>
          </div>

          <div class="py-2 flex flex-row flex-wrap justify-between">
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-3">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1 items-center">
                  <span class="text-base font-semibold"
                    >Transaction Reference:
                  </span>
                  <span class="text-sm font-medium">{{
                    order_detail_value.transaction_key
                  }}</span>
                </div>
              </div>
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1 items-center">
                  <span class="text-base font-semibold">Total Store: </span>
                  <span class="text-sm font-medium">{{
                    numberStore(order_detail_value.ordered_item)
                  }}</span>
                </div>
              </div>

              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1 items-center">
                  <span class="text-base font-semibold">Date and Time: </span>
                  <span class="text-sm font-medium">
                    {{ formatDate(order_detail_value.created_at) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1 items-center">
                  <span class="text-base font-semibold">Customer Name: </span>
                  <span class="text-sm font-medium"
                    >{{ order_detail_value.customer.first_name }}
                    {{ order_detail_value.customer.last_name }}
                  </span>
                </div>
              </div>
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1">
                  <span class="text-base font-semibold items-center"
                    >Customer Phone:
                  </span>
                  <span class="text-sm font-medium">{{
                    order_detail_value?.shipping_address?.phone_number1
                  }}</span>
                </div>
              </div>
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div
                  class="flex flex-row gap-1"
                  v-if="order_detail_value?.shipping_address?.phone_number2"
                >
                  <span class="text-base font-semibold items-center"
                    >Optional Phone:
                  </span>
                  <span class="text-sm font-medium">{{
                    order_detail_value?.shipping_address?.phone_number2
                  }}</span>
                </div>
              </div>

              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div
                  class="flex flex-row gap-1 items-center"
                  v-if="order_detail_value?.shipping_address"
                >
                  <span class="text-base font-semibold items-center"
                    >Shipping Address:
                  </span>
                  <span class="text-sm font-medium"
                    >{{
                      order_detail_value?.shipping_address?.sub_city
                        ?.region_city?.translate?.to[1]?.name
                    }},

                    {{
                      order_detail_value?.shipping_address?.sub_city?.translate
                        ?.to[1].name
                    }},

                    {{
                      order_detail_value?.shipping_address?.state_provinence
                    }},
                    {{ order_detail_value?.shipping_address?.zip_code }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1 items-center">
                  <span class="text-base font-semibold">Subtotal_price: </span>
                  <span class="text-sm font-medium"
                    >{{
                      compute_price(order_detail_value.ordered_item)
                    }}
                    Birr</span
                  >
                </div>
              </div>
              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1">
                  <span class="text-base font-semibold">shipping Fee : </span>
                  <span class="text-sm font-medium">{{
                    order_detail_value.shipping_fee
                  }}</span>
                </div>
              </div>

              <div class="flex flex-row gap-3 items-center">
                <Icon name="uil:check-circle" class="text-dark300"></Icon>
                <div class="flex flex-row gap-1">
                  <span class="text-base font-semibold"
                    >Total Price:
                    {{
                      compute_price(order_detail_value.ordered_item) +
                      (order_detail_value.shipping_value || 0)
                    }}
                    Birr
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex w-full justify-center mt-6">
            <NuxtLink
              :to="{
                name: 'dispatch-order_id',
                params: { order_id: order_detail_value.id },
              }"
              class="px-10 py-2 text-light400 focus:ring-2 focus:ring-darkblue focus:ring-offset-2 rounded text-sm font-semibold bg-gradient-to-r hover:to-darkblue hover:from-primary transition-all duration-300 from-darkblue to-primary"
              type="button"
            >
              View on Map
            </NuxtLink>
          </div>

          <div class="flex gap-0 items-center mt-4">
            <span class="text-sm font-semibold text-primaryvar1"
              >Order Detail</span
            >
            <hr class="bg-primaryvar3 flex-1" />
          </div>

          <h-table
            :headers="detail_header"
            :body="order_detail_value.ordered_item"
            header-class="bg-light400  text-neutral100"
          >
            <template #product_name="{ item }">
              <div>
                {{ item.product.title }}
              </div>
            </template>
            <template #quantity="{ item }">
              <div>
                {{ item.quantity }}
              </div>
            </template>
            <template #discount="{ item }">
              <div>
                {{ item.discount }}
              </div>
            </template>
            <template #unit_price="{ item }">
              <div>
                {{ item.unit_price }}
              </div>
            </template>
            <template #store_name="{ item }">
              <div>
                {{ item.product.store.name }}
              </div>
            </template>
            <template #store_location="{ item }">
              <div>
                {{
                  item.product.store.sub_city.region_city.translate.to[1].name
                }}, {{ item.product.store.sub_city.translate.to[1].name }}
              </div>
            </template>
            <template #supplier="{ item }">
              <div>
                {{ item.product.store.supplier.userById.first_name }}
              </div>
            </template>
            <template #product_status="{ item }">
              <div>
                {{ item.product.status }}
              </div>
            </template>
          </h-table>
        </div>
      </template>
    </h-dialog>
    <!-- <span>this dialog for assigned driver</span> -->
    <h-dialog
      v-model="show_dialog_for_assigned_order"
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
    <h-table
      v-if="order_result"
      :headers="header"
      :body="order_result"
      :loading="loading_order"
      header-class="py-1 px-2  bg-darkblue"
      body-class="py-2 px-2 text-sm  text-dark300/60 whitespace-nowrap"
      @click:row="show_detail"
    >
      <template #order_number="{ item }">
        {{ item.id }}
      </template>
      <template #customer_name="{ item }">
        {{ item.customer_name }}
      </template>
      <template #customer_phone="{ item }">
        {{ item.customer_phone }}
      </template>
      <template #order_at="{ item }">
        {{ formatDate(item.order_at) }}
      </template>
      <template #total_price(Birr)="{ item }">
        {{ item.total_price }}
      </template>
      <template #total_item="{ item }">
        {{ item.total_item }}
      </template>
      <template #shipping_fee(Birr)="{ item }">
        {{ item.shipping_fee }}
      </template>
      <template #driver="{ item }">
        <div>
          <span v-if="item.driver">
            {{ item.driver }}
          </span>

          <span v-else>
            <button
              @click.stop="
                () => {
                  selected_order_id = item.id;
                  show_dialog_for_assigned_order = true;
                  enable_read_driver = true;
                }
              "
              class="text-[0.7rem] bg-primaryvar3 rounded-xl px-2 text-light400"
            >
              + Assign
            </button>
          </span>
        </div>
      </template>

      <template #action="{ item }">
        <div class="" @click.stop="null">
          <h-menu
            leading_icon="ic:sharp-more-horiz"
            @option-clicked="actionHandler"
            :menu="{
              actions: [
                ['pending', 'reject_driver'].includes(item.status)
                  ? 'Assign'
                  : '',
                ['waiting'].includes(item.status) ? 'Unassign' : '',
                'view detail',
              ],
              id: item.id,
            }"
          >
          </h-menu>
        </div>
      </template>
      <template #status="{ item }">
        <span
          class="text-xs py-[2px] font-semibold px-2 rounded-xl bg-green-300 text-light400"
          >{{ item.status }}</span
        >
      </template>
    </h-table>
    <div v-if="loading_order" class="flex justify-center w-full items-center">
      <h-loading class="text-4xl font-bold text-primary" />
    </div>
    <div
      class="flex w-full text-primary font-semibold text-lg text-center justify-center"
      v-if="order_result && order_result.length < 1"
    >
      No Result
    </div>
    <div
      class="flex fixed z-20 top-0 h-[100vh] left-0 bottom-0 right-0 w-full bg-dark300/20 justify-center items-center"
      v-if="
        loading && !show_dialog_for_assigned_order && !show_detail_controller
      "
    >
      <h-loading class="text-4xl font-bold text-primary" />
    </div>
    <HPagination
      :items-per-page="limit"
      :total-data="total_product"
      :offest="offset"
      @update:offset="updateOffset"
    />
  </div>
</template>
