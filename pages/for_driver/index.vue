<template>
  <main
    class="w-full min-h-full flex flex-row justify-between gap-8 max-w-[90rem] mx-auto p-4 relative"
  >
    <h-notification
      :success="success"
      :message="message"
      v-model="show_message"
    />
    <h-dialog title="Scan the Order From Customer" v-model="scan">
      <template #content>
        <div class="flex flex-col">
          <span>Scan IT in The Store You Selected</span>
          <h-qr-reader @get-scanned-value="getScannedValue" />
        </div>
      </template>
    </h-dialog>
    <h-dialog
      :title="'Scan It  ' + `order-id ${generated_order_id}`"
      v-model="generate"
    >
      <template #content>
        <qrcode-vue
          :value="'order-' + '%$#@$%' + generated_order_id"
          class="h-[8rem] flex-1"
          size="200"
          level="H"
        />
      </template>
    </h-dialog>
    <section class="bg-light300 lg:max-w-sm min-h-full flex-1">
      <h1 class="font-bold text-neutral300">Orders</h1>

      <h-tab :tabs="tabs" @selected:tab="handleTab">
        <template #current>
          <section class="grid gap-4 lg:grid-cols-1 sm:grid-cols-2 grid-cols-1">
            <div v-if="orderLoading" class="w-full">
              <h-skeleton-loader :loading="orderLoading">
                <div
                  class="flex flex-col max-w-sm sm:max-w-none w-full bg-neutral300/20 animate-pulse px-3"
                >
                  <span
                    class="w-full block h-[2rem] bg-neutral200/20 rounded-md"
                  ></span>
                  <div
                    class="flex flex-row w-full justify-between h-full items-center py-2"
                  >
                    <span
                      class="w-[4rem] h-[2rem] rounded-md bg-neutral200/20"
                    ></span>
                    <span
                      class="w-[2rem] h-[1rem] rounded-md bg-neutral200/20"
                    ></span>
                  </div>
                </div>
              </h-skeleton-loader>
            </div>

            <div
              v-if="order_result && !orderLoading"
              class="h-[calc(100vh-4rem)]"
            >
              <div v-if="order_result?.length <= 0">
                No result found in Pending
              </div>
              <div
                @click="
                  () => {
                    navigate = true;
                    selected_id = order.id;
                    enable_detail_fetch = true;
                  }
                "
                v-for="order in order_result"
                :key="order.id"
                :class="[
                  selected_id === order.id ? 'border-2 border-primary' : '',
                ]"
                class="flex group flex-col items-start justify-center max-w-lg gap-2 bg-light400 bg-opacity-30 p-3 border rounded hover:border-2 hover:border-primary cursor-pointer transition-all ease-in-out duration-200"
              >
                <div class="flex flex-row justify-between w-full">
                  <h1 class="text-primary font-bold text-md">
                    ORDER-{{ order.id }}
                  </h1>
                  <span
                    class="text-xs bg-primaryvar8 text-primary flex justify-center items-center rounded-2xl px-1"
                    >{{ order.status }}</span
                  >
                </div>

                <div
                  class="flex items-center justify-between w-full text-neutral300"
                >
                  <p class="text-xs font-semibold">
                    <Icon name="carbon:dot-mark" class="w-3 h-3 text-primary" />
                    {{ formatDate(order.created_at) }}
                  </p>
                  <p class="text-sm font-medium">
                    {{ order.total_store }} stores
                  </p>
                </div>

                <div class="w-full flex justify-between">
                  <div class="flex-1 w-[10rem]">
                    <span
                      class="text-xs font-medium text-neutral400 w-[10rem] block"
                    >
                      To
                      {{
                        order?.shipping_address?.sub_city?.region_city?.name
                          ?.to[1].name
                      }}
                      {{ order?.shipping_address?.sub_city?.name?.to[1].name }}

                      {{ order?.shipping_address?.state_provinence }}
                    </span>
                  </div>

                  <div
                    @click.stop="() => {}"
                    class="w-full flex justify-between gap-4 py-1"
                    v-if="order.status === 'waiting'"
                  >
                    <button
                      class="text-sm text-red px-1 border-red border rounded-md font-semibold"
                      @click.stop="handleClick('reject', order.id)"
                    >
                      Reject
                    </button>
                    <button
                      class="text-sm font-semibold rounded-md border border-red px-1 text-primaryvar4"
                      @click="handleClick('accept', order.id)"
                    >
                      Accept
                    </button>
                  </div>
                  <!-- <div
                    class="flex w-full justify-end pt-4"
                    @click.stop="() => {}"
                  >
                    <button
                      class="border-primary border-[2px] rounded-md hover:bg-primary hover:text-light400 text-sm px-1"
                    
                      @click="handleClick('picked', order.id)"
                    >
                      Pick
                    </button>
                  </div> -->
                  <div
                    class="flex w-full justify-end pt-4"
                    @click.stop="() => {}"
                  >
                    <button
                      v-if="order.status === 'accepted_driver'"
                      class="border-primary border-[1px] rounded-md hover:bg-primary hover:text-light400 text-sm px-1"
                      @click="handleClick('ontheway', order.id)"
                    >
                      On The Way
                    </button>
                  </div>
                  <div
                    class="flex w-full justify-end pt-4"
                    @click.stop="() => {}"
                  >
                    <button
                      v-if="order.status === 'ontheway'"
                      class="border-primary border-[1px] rounded-md hover:bg-primary hover:text-light400 text-sm px-1"
                      @click="handleClick('scan', order.id)"
                    >
                      Generate Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>
        <template #completed>
          <section class="grid gap-4 lg:grid-cols-1 sm:grid-cols-2 grid-cols-1">
            <div v-if="order_result?.length <= 0">
              No result found in Completed
            </div>
            <div
              @click="navigate = true"
              v-for="order in order_result"
              :key="order.id"
              class="flex group flex-col items-start justify-center max-w-lg gap-2 bg-light400 bg-opacity-30 p-3 border rounded hover:border-2 hover:border-lemon cursor-pointer transition-all ease-in-out duration-200"
            >
              <h1 class="text-lemon font-bold text-md">
                ORDER-{{ order?.id }}
              </h1>
              <div
                class="flex items-center justify-between w-full text-neutral300"
              >
                <p class="text-xs font-semibold">
                  <Icon name="carbon:dot-mark" class="w-3 h-3 text-lemon" />
                  {{ formatDate(order.created_at) }}
                </p>
                <p class="text-sm font-medium">
                  {{ order.number_store }} stores
                </p>
              </div>
            </div>
          </section>
        </template>

        <template #rejected>
          <section class="grid gap-4 lg:grid-cols-1 sm:grid-cols-2 grid-cols-1">
            <div
              @click="navigate = true"
              v-for="order in order_result"
              :key="order.id"
              class="flex group flex-col items-start justify-center max-w-lg gap-2 bg-light400 bg-opacity-30 p-3 border rounded hover:border-2 hover:border-darkblue cursor-pointer transition-all ease-in-out duration-200"
            >
              <div class="w-full flex flex-row justify-between">
                <h1 class="text-darkblue font-bold text-md">
                  ORDER-{{ order.id }}
                </h1>
                <span
                  class="text-xs bg-primaryvar8 text-primary flex justify-center items-center rounded-2xl px-1"
                  >reject</span
                >
              </div>

              <div
                class="flex items-center justify-between w-full text-neutral300"
              >
                <p class="text-xs font-semibold">
                  <Icon name="carbon:dot-mark" class="w-3 h-3 text-darkblue" />
                  {{ formatDate(order.updated_at) }}
                </p>
                <p class="text-sm font-medium">
                  {{ order.total_store }} stores
                </p>
              </div>
            </div>
          </section>
        </template>
      </h-tab>
    </section>
    <section
      :class="[navigate ? 'lg:w-full top-0' : 'top-full']"
      class="lg:flex-auto flex flex-col gap-1 lg:static fixed top-0 left-0 right-0 bottom-0 bg-light300 transition-all ease-in-out duration-200"
    >
      <div
        class="absolute top-16 left-4 z-40 lg:hidden block cursor-pointer"
        @click="navigate = false"
      >
        <Icon name="bx:arrow-back" class="w-8 h-8 text-dark100" />
      </div>
      <div class="h-[calc(100vh-4rem)]">
        <h-geo-location-map
          :max-zoom="20"
          :zoom="8"
          :center="{
            lat: your_location?.latitude || 0,
            lng: your_location?.longitude || 0,
          }"
          :information="information"
        >
          <template #popup="{ popup }" class="bg-black">
            <div
              class="flex flex-col text-sm min-w-fit lg:max-w-[20rem] bg-light400 min-h-[13rem] font-semibold items-center justify-center"
              v-if="popup.role == 'store'"
            >
              <div class="flex flex-row gap-5 text-neutral300">
                <div class="w-[10rem] h-[8rem] flex bg-light200">
                  <button
                    class="flex flex-col items-center justify-center bg-primary text-light200 px-2 py-2 rounded-md"
                    @click="
                      () => {
                        scan = true;
                      }
                    "
                  >
                    Scan The Code
                  </button>
                </div>
                <div class="flex flex-col">
                  <div class="w-full flex flex-col text-neutral300">
                    <strong class="text-sm font-semibold text-primaryvar3"
                      >The Store Owner Info</strong
                    >
                    <span
                      >Name: {{ popup?.supplier?.first_name }}
                      {{ popup?.supplier?.last_name }}</span
                    >
                    <span>phone : {{ popup?.supplier.phone_number }} </span>
                    <span>Email: {{ popup?.supplier?.email }}</span>
                  </div>
                  <div
                    class="w-full flex flex-col gap-1 pt-3"
                    v-if="popup?.employes?.length > 0"
                  >
                    <strong class="text-sm font-semibold text-primaryvar3"
                      >Store Employer</strong
                    >
                    <span>
                      Name: {{ popup?.employes[0]?.user.first_name
                      }}{{ popup.employes[0].user.last_name }}</span
                    >
                    <span> Email: {{ popup?.employes[0]?.user.email }}</span>

                    <span>
                      Phone: {{ popup?.employes[0]?.user?.phone_number }}</span
                    >
                  </div>
                  <span> Store Name: {{ popup.store_name }}</span>
                  <span>total Product: {{ popup.total_product }}</span>
                  <span>Total Price: {{ popup.total_price }} ETB</span>
                  <span
                    >Address: {{ popup.city_region[1].name }}
                    {{ popup.subcity[1].name }}</span
                  >

                  <div>
                    <div class="flex items-center gap-3 py-1">
                      <span class="h-[2rem] w-[4px] bg-red"></span>
                      <span class="text-sm font-medium text-red"
                        >Please Make sure You Are Getting the product which are
                        listed below before try to scan It</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-row bg-light400 gap-10 lg:max-w-none max-w-[20rem] overflow-x-auto"
              >
                <h-table
                  :headers="detail_header"
                  :body="popup.details"
                  header-class="bg-light400  text-neutral100"
                >
                  <template #product_name="{ item }">
                    <div>
                      {{ item.physical_product.title }}
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
                  <template #special_discount="{ item }">
                    <div>
                      {{ item.physical_product.special_discount_rate }}
                    </div>
                  </template>

                  <template #product_status="{ item }">
                    <div>
                      {{ item.physical_product.status }}
                    </div>
                  </template>
                </h-table>
              </div>
            </div>

            <div
              v-else-if="popup.role == 'customer'"
              class="w-[20rem] h-[10rem] bg-light200 text-neutral300 text-sm font-semibold"
            >
              <div class="flex gap-5">
                Name
                <span>{{ popup.customerInfo.first_name }}</span>
                <span>{{ popup.customerInfo.last_name }}</span>
              </div>
              <span>Email: {{ popup.address.email }}</span>
              <span class="block"
                >Phone Number: {{ popup.address.phone_number1 }}</span
              >
              <span class="block" v-if="popup.address.phone_number2"
                >Phone Number: {{ popup.address.phone_number2 }}</span
              >
              <div class="flex gap-4">
                Address:
                <span>{{
                  popup?.address?.sub_city.region_city.name.to[1].name
                }}</span>
                <span>{{ popup?.address?.sub_city.name.to[1].name }}</span>
                <span>{{ popup?.address?.state_provinence }}</span>
              </div>
            </div>
          </template>
          <template #customText="{ value }">
            <div
              class="w-[2rem] relative h-[2rem] border flex justify-center items-center border-primary bg-light400 rounded-[100%]"
            >
              <Icon
                :name="value.text"
                class="font-bold text-2xl text-primary"
              />

              <div
                v-if="value.text == 'uil:car'"
                class="text-sm font-medium text-primaryvar1 z-20 absolute -top-4 bg-light400 w-[2rem] h-[2rem] -right-0 rounded-[100%] flex items-center justify-center"
              >
                You
              </div>
            </div>
          </template>
        </h-geo-location-map>
      </div>

      <div
        class="flex lg:items-end gap-6 lg:justify-end lg:static py-2 backdrop-blur-sm absolute bottom-0 left-5 bg-light300 bg-opacity-10 items-center justify-center"
      >
        <div class="text-sm flex flex-col items-end">
          <small>Rides Number</small>
          <p>+251{{ store.$state.ride_phone }}</p>
        </div>
        <button
          type="button"
          class="inline-block text-center rounded-sm bg-primaryvar1 px-8 space-x-4 py-1.5 font-semibold leading-normal text-light300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primaryvar1 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
          <Icon name="icon-park-solid:phone-telephone" class="w-5 h-5" />
          Call to Raid
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import fetch_order from "~/apollo/query/orders/order_by_driver.gql";
import order_detail from "~/apollo/query/orders/fetch_detail_order_for_one_driver.gql";
import update_order_status from "~/apollo/mutation/order/update_order_status.gql";
import listen_driver_location from "~/apollo/query/driver/listen_the_driver_location.gql";
import update_order_detail from "~/apollo/mutation/order/update_order_detail.gql";
import { useAuth } from "~/store/auth";
import QrcodeVue from "qrcode.vue";
const status = ref(["waiting", "picked", "ontheway", "accepted_driver"]);
const store = useAuth();
const selected_id = ref();
const product_order_info: any = ref("");
const order_detail_data: any = ref("");
const enable_detail_fetch = ref(false);
const loading = ref(false);
const success = ref(false);
const show_message = ref(false);
const message = ref("");
const scan = ref(false);
const generate = ref(false);
const generated_order_id: any = ref(null);

const searchQuery = ref("");
const searchResult = ref("");

const detail_header = [
  "product_name",
  "quantity",
  "discount",
  "unit_price",
  "special_discount",
  "product_status",
];
const id = computed(() => {
  return store.$state.uid;
});

const scanned_result = ref("");

const variable = computed(() => {
  console.log(id.value);

  return {
    where: {
      driver_id: { _eq: id.value },
      status: { _in: status.value },
    },
  };
});

const single_order_detail = computed(() => {
  return { id: selected_id.value };
});

const { result: yourLocationResult, error: error_to_fetch_driver_address } =
  useCustomSubscription(listen_driver_location, { id: id.value });

const {
  onResult: onOrderDetailResult,
  onError: onOrderDetailError,
  result: order_result_detail,
  loading: orderDetailLoading,
  refetch: refetchOrderDetail,
} = useCustomQuery(order_detail, single_order_detail, 0, enable_detail_fetch);

const {
  result: orderResult,
  error: orderError,
  loading: orderLoading,
  refetch: refetchOrder,
} = useCustomQuery(fetch_order, variable);

const {
  mutate: update_order,
  onDone: onUpdateOrderResult,
  onError: onUpdateOrderError,
} = useCustomMutation(update_order_status);

const order_result = computed(() => {
  return orderResult.value?.order;
});

const {
  mutate: updateDetail,
  onDone: onUpdateOrderDetail,
  onError: onUpdateOrderDetailError,
} = useCustomMutation(update_order_detail);

const your_location = computed(() => {
  return yourLocationResult.value?.driver;
});

const tabs = computed(() => {
  return [
    {
      text: "current",

      badge: orderResult.value?.length,
    },
    {
      text: "completed",
    },
    {
      text: "rejected",
    },
  ];
});

const handleTab = (value: any) => {
  selected_id.value = null;
  product_order_info.value = "";
  if (value === "current")
    status.value = ["waiting", "picked", "ontheway", "accepted_driver"];
  else if (value === "rejected") {
    status.value = ["rejected_by_driver"];
  } else if (value === "completed") {
    status.value = ["delivered", "completed"];
  }
};

const navigate = ref(false);

onUpdateOrderResult((result) => {
  success.value = true;
  loading.value = false;
  message.value = "success";
  show_message.value = true;
  refetchOrder();
});

onUpdateOrderError((error) => {
  success.value = false;
  loading.value = false;
  message.value = "Please Try again";
  show_message.value = true;
});

useHead({
  title: "Account",
});

onOrderDetailResult((result) => {
  enable_detail_fetch.value = false;
  order_detail_data.value = result.data?.product_order;
  const store_data = setup_for_geolocation(result.data?.product_order);
  console.log(result.data.product_order?.shipping_address?.latitude);
  const customer = {
    lat: result.data?.product_order?.shipping_address?.latitude,
    lng: result.data?.product_order?.shipping_address?.longitude,

    icon: "uil:user",
    popup: {
      customerInfo: result.data?.product_order.user,
      address: result.data?.product_order.shipping_address,
      role: "customer",
    },
    staticAnchor: [6, 3],
    customText: "uil:user",
    isPersistenceTooltip: false,
  };
  product_order_info.value = [...store_data, customer];
});

const setup_for_geolocation = (data: any) => {
  console.log(data);
  const stores: any = {};
  if (data) {
    data?.order_details?.forEach((item: any) => {
      let special_discount_rate = item?.special_discount_rate;

      if (
        Object.keys(stores).includes(
          item.physical_product?.store?.id.toString()
        )
      ) {
        stores[`${item.physical_product?.store?.id}`].popup.total_product +=
          item?.quantity;
        console.log(item.quantity);
        stores[`${item.physical_product?.store?.id}`].popup.total_price +=
          item?.quantity *
          (item?.unit_price -
            item?.discount -
            (item?.unit_price - item.discount) *
              ((special_discount_rate ? special_discount_rate : 0) / 100));
      } else {
        stores[`${item.physical_product.store.id}`] = {
          id: item.physical_product.store.id,
          lat: item.physical_product.store.latitude,
          lng: item.physical_product.store.longitude,

          staticAnchor: [3, 2],
          icon: "uil:store",
          popup: {
            store_name: item.physical_product.store?.name,
            phone: item.physical_product.store?.phone_number,
            total_product: item.quantity,
            supplier: item.physical_product?.store?.supplier?.userById,
            employes: item.physical_product?.store?.store_manager,
            details: getProductsInOneStore(item.physical_product.store.id),
            role: "store",
            total_price:
              item?.quantity *
              (item?.unit_price -
                item?.discount -
                (item?.unit_price - item.discount) *
                  ((special_discount_rate ? special_discount_rate : 0) / 100)),
            subcity: item.physical_product.store.sub_city?.name.to,
            city_region:
              item.physical_product.store.sub_city.region_city?.name.to,
          },

          customText: "uil:store",
        };
      }
    });
  }
  return Object.values(stores);
};

const getProductsInOneStore = (store_id: number) => {
  console.log(order_detail_data.value);

  return order_detail_data.value?.order_details?.filter((element) => {
    return element.physical_product.store.id === store_id;
  });
};

watchEffect(() => {
  console.log(your_location.value, "changed......");
  console.log(product_order_info.value);
});

onOrderDetailError((error) => {
  enable_detail_fetch.value = false;
  console.log(error);
});

const handleClick = (value: String, id: number) => {
  loading.value = true;
  if (value == "reject") {
    update_order({
      set: { status: "rejected_by_driver" },
      id: id,
    });
  }
  if (value == "accept") {
    update_order({
      set: { status: "accepted_driver" },
      id: id,
    });
  }
  if (value == "picked") {
    update_order({
      set: { status: "picked" },
      id: id,
    });
  }
  if (value == "ontheway") {
    update_order({
      set: { status: "ontheway" },
      id: id,
    });
  } else if (value === "scan") {
    generate.value = true;
    generated_order_id.value = id;
  }
};

onUpdateOrderDetail((result) => {
  show_message.value = true;
  success.value = true;
  message.value = "Scanned Successfully";
});

onUpdateOrderDetailError((error) => {
  show_message.value = true;
  success.value = false;
  message.value = error.message;
});

const information = computed(() => {
  return product_order_info.value && order_result_detail.value
    ? [
        ...product_order_info.value,
        {
          lat: your_location.value?.latitude,
          lng: your_location.value.longitude,
          staticAnchor: [6, 4],
          customText: "uil:car",
        },
      ]
    : [];
});

const getScannedValue = (value: any) => {
  scanned_result.value = value;
  const data = scanned_result.value.split("%$#@$%");
  let ids = data.slice(1);
  console.log(ids);
  ids = ids.map((element) => {
    return parseInt(element);
  });

  console.log(ids);
  updateDetail({
    where: { id: { _in: ids } },

    set: {
      status: "picked",
    },
  });
};

definePageMeta({
  layout: "custom",
  middleware: "auth",
});
</script>
