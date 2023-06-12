<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuth } from "~/store/auth";
import delivery_provider from "~/apollo/query/delivery_provider.gql";
import region_city from "~/apollo/query/region_city.gql";
import sub_city from "~/apollo/query/sub_city.gql";
import update_delivery from "~/apollo/mutation/update_delivery_info.gql";
import updatePasswordgql from "~/apollo/mutation/updatePassword.gql";
const { handleSubmit } = useForm();

const regions: any = ref();
const selected_region: any = ref("");
const selected_subcity: any = ref("");
const loading = ref(false);
const subcities = ref();
const show_notification = ref(false);
const notification_message = ref("");
const success = ref(false);
const store = useAuth();

const token = useCookie("_hibirlink").value?.token;

const delivery_variable = ref({ id: store.$state.uid });

const {
  result: deliver_result,
  onError: onFetchDeliveryError,
  onResult: onFetchDeliveryResult,
  error: error_fetch_delivery,
  loading: onDeliverLoading,
  refetch: refetchDelivery,
} = useCustomQuery(delivery_provider, delivery_variable);
const {
  onResult: onRegionCityResult,
  onError: onFetchRegionError,

  loading: loading_region,
} = useCustomQuery(region_city);

const {
  error: fetch_subcity_error,
  onResult: onSubcityResult,
  onError: onFetchSubcityError,
  refetch: refetchSubcity,
} = useCustomQuery(sub_city);

const {
  mutate: updateDeliveryInfo,
  onDone: onUpdateDeliveryComplete,
  onError: onUpdateDeliverError,
} = useCustomMutation(update_delivery);

const {
  onDone: onUpdatePassword,
  onError: onUpdatePasswordError,
  mutate: updatePassword,
} = useCustomMutation(updatePasswordgql);

const delivery_info = computed(() => {
  return deliver_result.value?.users_by_pk;
});

const sub_city_with_region = computed(() => {
  return subcities.value
    ?.filter((element: any) => {
      return element.city_region_id === selected_region.value.id;
    })
    ?.map((element: any) => {
      return { id: element.id, name: element.translate.to[1].name };
    });
});

onFetchDeliveryError((error) => {
  console.log(error);
});

onRegionCityResult((result) => {
  if (result.data) {
    regions.value = result.data.region_city?.map((element: any) => {
      return { id: element.id, name: element.translate.to[1].name };
    });
  }
});
onFetchDeliveryResult((result) => {
  console.log(result.data.users_by_pk.delivery[0]);
  let temp_deliver = result.data.users_by_pk.delivery[0];
  selected_region.value = {
    name: temp_deliver.sub_city.region_city?.translate.to[1].name,
    id: temp_deliver.sub_city.region_city.id,
  };

  selected_subcity.value = {
    name: temp_deliver.sub_city.translate.to[1].name,
    id: temp_deliver.sub_city.id,
  };
});
onSubcityResult((result) => {
  console.log(result.data);
  subcities.value = result.data?.sub_city;
});

onFetchSubcityError((error) => {
  console.log(error);
});
onUpdateDeliverError((error) => {
  loading.value = false;
  console.log(error);
  showNotification({ message: error.message, success_input: false });
});
onUpdateDeliveryComplete((result) => {
  loading.value = false;
  showNotification({ message: "Successfull updated", success_input: true });
  refetchDelivery();
});
onUpdatePassword((result) => {
  loading.value = false;

  showNotification({
    message: "Password Successfull updated",
    success_input: true,
  });
});
onUpdatePasswordError((error) => {
  loading.value = false;

  showNotification({ message: error.message, success_input: true });
});

// watch(selected_region, (newValue) => {
//   selected_subcity.value = "";
// });
const { uploadImages } = useUploadFile();

const handleProfileChange = handleSubmit(async (value) => {
  console.log(value);
  loading.value = true;
  let set;
  try {
    const license = value.license;
    if (typeof license !== "string") {
      const { urls, error } = await uploadImages(license, "/image");
      if (urls) {
        console.log(urls);

        set = {
          id: store.$state.uid,
          delivery_set: {
            description: value.description,
            license: urls[0],
            street_address: value.street,
            sub_city_id: value.subcity.id,
            zip_code: value.zip,
            name: value.name,
            tin_number: value["tin number"],
          },
          user_set: {
            first_name: value.fname,
            last_name: value.lname,
            email: value.email,
            phone_number: value.phone,
          },
        };
      }
    } else {
      set = {
        id: store.$state.uid,
        delivery_set: {
          description: value.description,
          license: value.license,
          street_address: value.street,
          sub_city_id: value.subcity.id,
          zip_code: value.zip,
          name: value.name,
          tin_number: value["tin number"],
        },
        user_set: {
          first_name: value.fname,
          last_name: value.lname,
          email: value.email,
          phone_number: value.phone,
        },

        input: {
          firstName: value.fname,
          lastName: value.lname,
          newEmail: value.email,
          token: token,
        },
      };
    }

    updateDeliveryInfo(set);
  } catch (error) {
    console.log(error);
  }
});

const exceedImageSizeHandler = (size: any) => {
  showNotification({
    message: "The Image Size Exceeds from the Permitted one",
    success_input: false,
  });
};

interface NotificationInterface {
  success_input: boolean;
  message: string;
}

const showNotification = (data: NotificationInterface) => {
  const { success_input, message } = data;
  show_notification.value = true;
  notification_message.value = message;
  success.value = success_input;
};

const errorParse = (value) => {
  const data = {
    "not found": "Permission Denied",
    "network error": "Network Error",
  };
  if (value.includes("not found")) {
    return data["not found"];
  }
};

const handlePasswordChange = handleSubmit(async (value: any) => {
  console.log(value.newpassword);
  const set = {
    inputPassword: {
      newPassword: value.newpassword,
      token: token,
    },
  };
  loading.value = true;
  updatePassword(set);
});
definePageMeta({
  middleware: "auth",
});
</script>
<template>
  <div class="flex">
    <h-notification
      :message="notification_message"
      :success="success"
      v-model="show_notification"
    />
    <h-tab :tabs="[{ text: 'General' }, { text: 'Security' }]">
      <template #General>
        <div class="min-h-[90vh] mb-3">
          <div
            v-if="onDeliverLoading"
            class="w-full flex justify-center h-full"
          >
            <h-loading class="text-4xl text-primary font-semibold" />
          </div>
          <div v-if="error_fetch_delivery">
            {{ parseError(error_fetch_delivery) }}
          </div>
          <form
            v-if="delivery_info"
            class="flex flex-row gap-3"
            @submit.prevent="handleProfileChange"
          >
            <div
              class="w-full rounded-md bg-light300/50 border-[1px] border-primaryvar8 px-7 py-7 gap-2 gap-y-0"
            >
              <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4 lg:px-[10%] px-[2px]"
              >
                <h-text-field
                  type="text"
                  label="First Name"
                  rules="required"
                  name="fname"
                  id="fname"
                  v-model="delivery_info.first_name"
                  placeholder="e.g kebede"
                ></h-text-field>
                <h-text-field
                  type="text"
                  label="Last Name"
                  rules="required"
                  name="lname"
                  v-model="delivery_info.last_name"
                  id="lname"
                  placeholder="e.g abineh"
                ></h-text-field>
                <h-text-field
                  type="email"
                  label="Email"
                  placeholder="example@gmail.com"
                  rules="required|email"
                  v-model="delivery_info.email"
                  name="email"
                  id="email"
                ></h-text-field>

                <h-text-field
                  type="text"
                  label="Phone Number"
                  rules="required|phoneNumber"
                  name="phone"
                  v-model="delivery_info.phone_number"
                  id="phone"
                  leading-text="+251"
                ></h-text-field>
                <h-text-field
                  type="text"
                  label="Tin Number"
                  rules="required"
                  name="tin number"
                  v-model="delivery_info.delivery[0].tin_number"
                  id="tin"
                ></h-text-field>

                <h-select
                  v-if="regions"
                  label="city|region"
                  rules="required"
                  name="city_region"
                  :items="regions"
                  v-model="selected_region"
                  id="region"
                ></h-select>
                <h-select
                  v-if="
                    (sub_city_with_region && sub_city_with_region.length > 0) ||
                    selected_subcity
                  "
                  label="subcity"
                  rules="required"
                  name="subcity"
                  v-model="selected_subcity"
                  :items="sub_city_with_region || [{}]"
                  id="region"
                ></h-select>
                <h-text-field
                  type="text"
                  label="Street address"
                  rules="required"
                  name="street"
                  id="street"
                  v-model="delivery_info.delivery[0].street_address"
                  placeholder="e.g Bahirdar Geiorgis Road "
                ></h-text-field>

                <h-text-field
                  type="text"
                  label="zip or postal code"
                  rules="required"
                  name="zip"
                  v-model="delivery_info.delivery[0].zip_code"
                  id="zip"
                  placeholder="600"
                ></h-text-field>

                <h-text-field
                  type="text"
                  label="Campany Name"
                  rules="required"
                  name="campany_name"
                  v-model="delivery_info.delivery[0].name"
                  id="campany_name"
                ></h-text-field>
                <h-text-area
                  label="company Description"
                  rules="required"
                  name="description"
                  id="description"
                  v-model="delivery_info.delivery[0].description"
                  parentClass="md:col-span-2"
                  inputclass="bg-light100  rounded"
                  placeholder="write about your company up to 200 words"
                ></h-text-area>
                <div class="w-full md:col-span-2 xl:col-span-3">
                  <span class="text-sm font-semibold text-neutral400"
                    >License</span
                  >
                  <h-file-upload
                    name="license"
                    id="license"
                    rules="required"
                    v-model="delivery_info.delivery[0].license"
                    :limit="1"
                    accept="image/*"
                    size="1 MB"
                    @exceed:size="exceedImageSizeHandler"
                  />
                </div>
                <div
                  class="w-full flex justify-end md:col-span-2 xl:col-span-3 py-1 mt-1"
                >
                  <h-button
                    btnClass="py-1 text-light400 w-[10rem]"
                    btnName="Save"
                    type="submit"
                    :is-loading="loading"
                  ></h-button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </template>
      <template #Security>
        <div
          class="xl:w-[40rem] md:w-[60%] mx-auto border px-[10%] py-7 rounded-md"
        >
          <form
            class="flex flex-col gap-1"
            @submit.prevent="handlePasswordChange"
          >
            <h-text-field
              type="password"
              name="newpassword"
              label="New Password"
              rules="required|password"
              trailing-icon="uil:eye"
              placeholder="New Password"
            />
            <h-text-field
              type="password"
              name="confirm"
              label="Confirm Password"
              rules="required|confirmPassword:newpassword"
              trailing-icon="uil:eye"
              placeholder="Confirm Password"
            />
            <div class="flex justify-end mt-1">
              <h-button type="submit" :is-loading="loading" btnName="Save">
              </h-button>
            </div>
          </form>
        </div>
      </template>
    </h-tab>
  </div>
</template>
