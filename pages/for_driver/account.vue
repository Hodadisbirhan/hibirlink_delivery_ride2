<script setup lang="ts">
import driver from "~/apollo/query/driver/driver_profile.gql";
import update_driver_account from "~/apollo/mutation/driver/update_driver_profile.gql";
import updatePasswordgql from "~/apollo/mutation/updatePassword.gql";
import subs from "~/apollo/mutation/driver/test.gql";
import { useAuth } from "~/store/auth";
import { useForm } from "vee-validate";
import { useSubscription } from "@vue/apollo-composable";
const regions: any = ref();
const loading = ref(false);
const subcities = ref();
const show_notification = ref(false);
const notification_message = ref("");
const success = ref(false);
const store = useAuth();
const { uploadImages } = useUploadFile();
const id = computed(() => {
  return { id: store.uid };
});

const { handleSubmit, meta } = useForm();

const {
  result: DriverResult,
  error: driverError,
  loading: driverLoading,
  refetch: driver_refetch,
} = useCustomQuery(driver, id);
// const { result } = useSubscription(subs);

const {
  mutate: updateDriver,
  onDone: onUpdateDriverInfo,
  onError: onUpdateDriverError,
} = useCustomMutation(update_driver_account);

const {
  onDone: onUpdatePassword,
  onError: onUpdatePasswordError,
  mutate: updatePassword,
} = useCustomMutation(updatePasswordgql);

const driver_info = computed(() => {
  return DriverResult.value?.delivery;
});

const handlePasswordChange = handleSubmit(async (value: any) => {
  console.log(value.newpassword);
  const set = {
    inputPassword: {
      newPassword: value.newpassword,
      token: store.token,
    },
  };
  loading.value = true;
  updatePassword(set);
});

const handleProfileChange = handleSubmit(async (value: any) => {
  console.log(value);
  loading.value = true;
  let license = value.license;

  if (typeof license !== "string") {
    const { urls, error } = await uploadImages(license, "/image");
    if (!error && urls?.length > 0) {
      license = urls[0];
    } else {
      showNotification({
        message: "Image Upload Error Please Try Again",
        success_input: false,
      });
      return;
    }
  }
  updateDriver({
    driver_set: {
      car_name: value.car_name,
      platelate_number: value.platlate,
      license: license,
    },

    id: id.value?.id,
    credential: {
      firstName: value.fname,
      lastName: value.lname,
      newEmail: value.email,
      token: store.token,
    },
    userupdate: {
      first_name: value.fname,
      last_name: value.lname,
      phone_number: value.phone,
      email: value.email,
    },
  });
  console.group(value);
});

interface NotificationInterface {
  success_input: boolean;
  message: string;
}

const exceedImageSizeHandler = (size: any) => {
  showNotification({
    message: "The Image Size Exceeds from the Permitted one",
    success_input: false,
  });
};

const showNotification = (data: NotificationInterface) => {
  const { success_input, message } = data;
  show_notification.value = true;
  notification_message.value = message;
  success.value = success_input;
};

onUpdateDriverInfo((result) => {
  loading.value = false;

  driver_refetch();
  showNotification({ message: "Updated Successfully", success_input: true });
});

onUpdateDriverError((error) => {
  loading.value = false;
  showNotification({ message: error.message, success_input: false });
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

definePageMeta({
  layout: "custom",
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
          <div v-if="driverLoading" class="w-full flex justify-center h-full">
            <h-loading class="text-4xl text-primary font-semibold" />
          </div>
          <div v-if="driverError">
            {{ driverError.message }}
          </div>
          <form
            v-if="DriverResult"
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
                  v-model="driver_info.user.first_name"
                  placeholder="e.g kebede"
                ></h-text-field>
                <h-text-field
                  type="text"
                  label="Last Name"
                  rules="required"
                  name="lname"
                  v-model="driver_info.user.last_name"
                  id="lname"
                  placeholder="e.g abineh"
                ></h-text-field>
                <h-text-field
                  type="email"
                  label="Email"
                  placeholder="example@gmail.com"
                  rules="required|email"
                  v-model="driver_info.user.email"
                  name="email"
                  id="email"
                ></h-text-field>

                <h-text-field
                  type="text"
                  label="Phone Number"
                  rules="required|phoneNumber"
                  name="phone"
                  v-model="driver_info.user.phone_number"
                  id="phone"
                  leading-text="+251"
                ></h-text-field>
                <h-text-field
                  type="text"
                  label="Car Name"
                  rules="required"
                  name="car_name"
                  v-model="driver_info.car_name"
                  id="campany_name"
                ></h-text-field>
                <h-text-field
                  type="text"
                  label="Platelate Number"
                  rules="required"
                  name="platlate"
                  v-model="driver_info.platelate_number"
                  id="pnumber"
                  placeholder="AA600"
                ></h-text-field>

                <div class="w-full md:col-span-2 xl:col-span-3">
                  <span class="text-sm font-semibold text-neutral400"
                    >License</span
                  >
                  <h-file-upload
                    name="license"
                    id="license"
                    rules="required"
                    v-model="driver_info.license"
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
