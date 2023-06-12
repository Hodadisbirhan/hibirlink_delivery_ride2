<script setup lang="ts">
import fetch_single_order from "~/apollo/query/orders/single_order.gql";
import { useAuth } from "~/store/auth";
const route = useRoute();
const center = reactive({
  lat: 11.2,
  lng: 37,
});
const store = useAuth();

const variable = {
  where: {
    _and: [
      {
        id: {
          _eq: route.params.order_id,
        },
      },

      {
        driver: { delivery_provider: { owner_id: { _eq: store.uid } } },
      },
      {
        status: {
          _neq: "pending",
        },
      },
    ],
  },
};

const {
  onError: onFetchSingleOrderError,

  result: orderResult,
  loading: onFetchSingleOrderLoading,
} = useCustomSubscription(fetch_single_order, variable);

const order_result = computed(() => {
  if (
    orderResult.value?.product_order &&
    orderResult.value?.product_order.length > 0
  )
    return orderResult.value?.product_order[0];
  return null;
});

const customer = computed(() => {
  let temp = order_result.value?.user;
  return {
    customer: {
      first_name: temp?.first_name,
      last_name: temp?.last_name,
      email: temp?.email,
      phone: order_result.value?.shipping_address?.phone_number1,
      lat: order_result.value?.shipping_address?.latitude || 0,
      lng: order_result.value?.shipping_address?.longitude || 0,
      customText: "uil:user",
    },
  };
});

const stores_TP = computed(() => {
  const storess: any = {};

  order_result.value?.ordered_items?.map((element: any) => {
    let prevous_prices =
      storess[`${element.product.store.id}`]?.popup.total_price || 0;
    let total_product =
      storess[`${element.product.store.id}`]?.popup.total_product || 0;
    if (!Object.keys(storess).includes(element.product.store.id.toString())) {
      storess[`${element.product.store.id}`] = {
        total_price: 0,
        total_product: 0,
        id: element.product.store.id,
        lat: element.product.store.latitude,
        lng: element.product.store.longitude,
        staticAnchor: [3, 2],
        popup: {
          store_name: element.product.store.name,
          phone: element.product.store.phone_number,
          total_product: 0,
          shipping_fee: element.shipping_fee,
          total_price: 0,
          subcity: element.product.store.sub_city.translate.to,
          city_region: element.product.store.sub_city.region_city.translate.to,
        },
        icon: "uil:store",
        customText: "uil:store",
      };
    }
    storess[`${element.product.store.id}`].popup.total_price =
      prevous_prices +
      element.quantity *
        (element.unit_price -
          element.discount -
          (element.unit_price - element.discount) *
            ((element.special_discount_rate
              ? element.special_discount_rate
              : 0) /
              100));

    storess[`${element.product.store.id}`].popup.total_product =
      total_product + element.quantity;
  });

  return Object.values(storess);
});

onFetchSingleOrderError((error) => {
  console.log(error);
});

definePageMeta({
  middleware: "auth",
});
// console.log(route);
</script>

<template>
  <div class="relative w-full h-[calc(100vh-10rem)]">
    <h1
      class="absolute top-1 left-0 z-40 w-full h-[3rem] bg-light400/50 backdrop-blur px-3 py-3 text-primary shadow-md font-semibold"
    >
      Order Number: {{ route.params.order_id }}
    </h1>
    <div v-if="onFetchSingleOrderLoading">
      <h-loading />
    </div>

    <h-geo-location-map
      v-else-if="order_result"
      :center="center"
      :maxZoom="30"
      :zoom="10"
      :information="[
        ...stores_TP,
        {
          icon: 'uil:user-square',
          lat: customer.customer.lat,
          lng: customer.customer.lng,
          customText: 'uil:user',
          popup: customer.customer,
          staticAnchor: [6, 3],
          isPersistenceTooltip: false,
        },
        ...(order_result?.driver?.user
          ? [
              {
                icon: 'uil:car',
                lat: order_result?.driver?.lat || 0,
                lng: order_result?.driver?.lng || 0,
                customText: 'uil:car',
                popup: order_result?.driver?.user,
                staticAnchor: [6, 3],
                isPersistenceTooltip: false,
              },
            ]
          : []),
      ]"
    >
      <template #popup="{ popup }">
        <div class="flex">
          <div class="flex">
            <div
              v-if="popup.first_name"
              class="flex flex-col gap-2 w-full bg-light400 rounded"
            >
              <h2 class="text-sm font-semibold text-dark300/60">
                {{ popup.first_name }} {{ popup.last_name }}
              </h2>
              <div class="flex gap-2">
                <Icon name="uil:envelope-add" />
                <span class="text-sm font-semibold text-dark300/70">
                  {{ popup.email }}
                </span>
              </div>
              <div class="flex gap-2">
                <Icon name="uil:phone" />
                <span class="text-sm font-semibold">
                  {{ popup.phone }}
                </span>
              </div>
            </div>
            <div v-else class="flex gap-2 flex-col py-2 px-2">
              <span
                class="text-sm font-semibold text-dark300/50 flex gap-2 items-center"
              >
                <Icon name="uil:store" class="text-lg font-bold text-primary" />
                <span class="font-semibold text-lg">
                  {{ popup.store_name }}
                </span>
              </span>
              <span
                class="text-sm font-semibold text-dark300/50 flex gap-1 items-center"
              >
                <span class="text-lg text-primary"
                  ><Icon name="uil:location"
                /></span>

                Region/city {{ popup.city_region[1].name }}

                <span> subcity {{ popup.subcity[1].name }} </span>
              </span>
              <span
                class="text-sm font-semibold text-dark300/50 flex gap-1 items-center"
              >
                <Icon
                  name="uil:file-question-alt"
                  class="text-lg text-primary"
                />
                <span class="text-sm font-semibold">Total Product: </span>
                {{ popup.total_product }}</span
              >
              <span
                class="ext-sm font-semibold text-dark300/50 flex gap-1 items-center"
              >
                <Icon
                  name="uil:moneybag"
                  class="text-lg font-semibold text-primary"
                />
                <span class="text-sm font-semibold">Total Prices: </span>
                {{ popup.total_price }} Birr</span
              >
              <span>{{ popup.shipping_fee }}</span>
              <div
                class="flex flex-row gap-3 py-1 bg-primaryvar5/60 rounded-md text-center items-center justify-center text-dark300/60"
              >
                <Icon
                  name="uil:phone"
                  class="text-xl font-semibold items-center"
                />
                <span class="text-base font-medium">+251{{ popup.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #customText="{ value }">
        <div
          class="h-[2.5rem] w-[2.5rem] rounded-[100%] bg-light400 text-primary border border-primary flex justify-center items-center text-2xl"
        >
          <Icon :name="value.text" />
        </div>
      </template>
    </h-geo-location-map>
  </div>
</template>
