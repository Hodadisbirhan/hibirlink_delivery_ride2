<script setup lang="ts">
import add_driver_gql from "~/apollo/mutation/add_driver.gql";
import fetch_all_driver from "~/apollo/query/driver/fetch_all_driver.gql";
import fetch_driver_by_email from "~/apollo/query/driver/fetch_driver_by_email.gql";
import update_driver from "~/apollo/mutation/driver/update_driver.gql";
import delete_driver from "~/apollo/mutation/driver/delete_driver.gql";
import { useAuth } from "~/store/auth";
const store = useAuth();
definePageMeta({
  middleware: "auth",
});
const { uploadImages } = useUploadFile();
interface FormInterface {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  license?: string | null;
  platelate_number?: string | null;
  car?: string | null;
}
const is_checked = ref(false);
const is_add_driver = ref(true);
const open_form_dialog = reactive({ value: false });
const loading = ref(false);
const view_license = reactive({ is_viewd: false, license: "" });
const offset = ref(0);
const limit = ref(10);
const enable_query_driver_by_email = ref(false);
const fetch_email_variable: any = ref(null);
const search = ref("");
const show_notification = ref(false);
const success = ref(false);
const notification_message = ref("");
const showDelete = ref(false);
const set_value: FormInterface = reactive({
  first_name: null,
  last_name: null,
  email: null,
  license: null,
  platelate_number: null,
  car: null,
});
const delete_email_value = ref("");
const is_intend_to_delete = ref(false);
const single_driver_id = ref("");
const variable = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,
    where: {
      driver: {
        _and: [
          { worked_at: { _eq: store.$state.delivery_id } },

          {
            _or: [
              { car_name: { _iregex: search.value } },
              { platelate_number: { _iregex: search.value } },
              {
                user: {
                  _or: [
                    { first_name: { _iregex: search.value } },
                    { last_name: { _iregex: search.value } },
                    { email: { _iregex: search.value } },
                    { phone_number: { _iregex: search.value } },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  };
});

const {
  onError: onFetchSingleDriverError,
  onResult: onFetchSingleDriverResult,
  loading: fetchSingleDriverLoading,
} = useCustomQuery(
  fetch_driver_by_email,
  fetch_email_variable,
  0,
  enable_query_driver_by_email
);

const {
  onError: onfetchAllDriverError,
  refetch: refechAllDriver,
  result: allDriverResult,
  loading: loading_fetch_all_driver,
} = useCustomQuery(fetch_all_driver, variable);

const all_driver_result = computed(() => {
  return allDriverResult.value?.drivers?.map((element: any) => {
    return {
      id: element.email,
      first_name: element.first_name,
      last_name: element.last_name,
      email: element.email,
      phone_number: element.phone_number,
      car_name: element.driver.car_name,
      platelate_number: element.driver.platelate_number,
      license: element.driver.license,
    };
  });
});
const total_driver = computed(() => {
  return allDriverResult.value?.total_drivers.total.number;
});

const driverID = computed(() => {
  return allDriverResult.value?.drivers.map((element) => {
    return element.email;
  });
});

const {
  mutate: addDriver,
  onDone: onAddDriver,
  onError: onAddDriverError,
} = useCustomMutation(add_driver_gql);
const {
  mutate: updateDriver,
  onDone: onUpdateDriver,
  onError: onUpdateDriverError,
} = useCustomMutation(update_driver);
const {
  mutate: deleteDriver,
  onDone: onDeleteDriver,
  onError: onDeleteDriverError,
} = useCustomMutation(delete_driver);
const header = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "driver_license",
  "action",
];

const handleFormSubmit = async (formValue) => {
  loading.value = true;
  console.log(typeof formValue.license === "string");
  console.log(typeof formValue.license);
  let url = "";

  if (typeof formValue.license !== "string") {
    const { error, urls } = await uploadImages(formValue.license, "license");
    if (urls && urls.length > 0) {
      url = urls[0];
    } else if (error) {
      show_notification.value = true;
      notification_message.value = "Please Try Again";
      success.value = false;
      return;
    }
  } else if (formValue.license === "string") {
    url = formValue.license;
  }

  if (is_add_driver.value) {
    addDriver({
      input: {
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        phone_number: formValue.phone,
        driver: {
          car_name: formValue.car,
          license: url,
          platelate_number: formValue.platelate_number,
          worked_at: store?.delivery_id,
        },
      },
    });
  } else {
    if (url)
      updateDriver({
        id: single_driver_id.value,
        set: {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          email: formValue.email,
          phone_number: formValue.phone,
        },
        driver: {
          license: url,
          platelate_number: formValue.platelate_number,
          car_name: formValue.car,
        },
      });
    else
      updateDriver({
        id: single_driver_id.value,
        set: {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          email: formValue.email,
          phone_number: formValue.phone,
        },
        driver: {
          platelate_number: formValue.platelate_number,
          car_name: formValue.car,
        },
      });
  }
};

const handleDelete = (is_confirm) => {
  if (is_confirm) {
    loading.value = true;

    deleteDriver({ email: delete_email_value.value });
  } else {
    showDelete.value = false;
  }
};

const editHandler = ({ id, action }) => {
  const email = id;
  store;
  if (action === "Edit") {
    is_add_driver.value = false;
    console.log(email);

    fetch_email_variable.value = { email };
    enable_query_driver_by_email.value = true;
  } else if (action === "Delete") {
    // deleteDriver({email:[id]});
    delete_email_value.value = id;
    showDelete.value = true;
  }
};

onAddDriver((result) => {
  console.log(result);
  loading.value = false;
  show_notification.value = true;
  notification_message.value = "Driver Add Successfully";
  success.value = true;
  open_form_dialog.value = false;
  refechAllDriver();
});

onAddDriverError((error) => {
  show_notification.value = true;
  notification_message.value = "Error" + error.message;
  success.value = false;
  console.log(error);
  loading.value = false;
});

onUpdateDriver((result) => {
  show_notification.value = true;
  notification_message.value = "Driver Updated Successfully";
  success.value = true;
  loading.value = false;
  open_form_dialog.value = false;
  refechAllDriver();
});

onUpdateDriverError((error) => {
  show_notification.value = true;
  notification_message.value = "Error:" + error.message;
  success.value = true;
  loading.value = false;
});
onDeleteDriver((result) => {
  show_notification.value = true;
  showDelete.value = false;

  notification_message.value = "Deleted Successfully";
  success.value = true;
  loading.value = false;
  refechAllDriver();

  console.log(result);
});
onDeleteDriverError((error) => {
  showDelete.value = false;
  success.value = false;
  show_notification.value = true;
  loading.value = false;
  notification_message.value = error.message;
  console.log(error);
});

onFetchSingleDriverError((error) => {
  console.log(error);
});

onFetchSingleDriverResult((result) => {
  console.log(result.data.users[0]);
  console.log(result.error);

  if (result.data.users.length > 0) {
    const driver = result.data.users[0];
    single_driver_id.value = driver.id;
    console.log(result.data.users[0]);
    set_value.first_name = driver.first_name;
    set_value.last_name = driver.last_name;
    set_value.email = driver.email;
    set_value.license = driver.driver.license;
    set_value.platelate_number = driver.driver.platelate_number;
    set_value.phone = driver.phone_number;
    set_value.car = driver.driver.car_name;
    console.log(set_value);

    enable_query_driver_by_email.value = false;

    open_form_dialog.value = true;
  }
});

onfetchAllDriverError((error) => {
  console.log(error);
});

const getOffset = (value: number) => {
  offset.value = value;
};

const selectedRowHandler = (ids) => {
  console.log(ids);
  if (ids.length > 0) {
    delete_email_value.value = ids;
    is_checked.value = true;
  } else {
    is_checked.value = false;
  }
};

const handleMultipleDelete = () => {
  showDelete.value = true;
};

const gPDF = () => {
  generatePdf({
    head: [["First Name", "Last Name", "phone", "Email"]],
    body: all_driver_result.value.map((element) => {
      return [
        element.first_name,
        element.last_name,
        element.phone_number,
        element.email,
      ];
    }),
    file: "drivers.pdf",
  });
};
</script>

<template>
  <div class="">
    <h-notification
      :message="notification_message"
      :success="success"
      v-model="show_notification"
    />
    <h-dialog
      title="confirmation_message"
      titleClass="text-red font-bold"
      :hideClosIcon="true"
      @form-submit="handleDelete"
      v-model="showDelete"
    >
      <template #content>
        <div class="w-full flex justify-end items-center gap-4 pt-6">
          <div v-if="loading" class="flex justify-center items-center">
            <h-loading class="text-2xl font-bold text-primary" />
          </div>

          <div
            class="flex flex-row items-center gap-5 lg:w-[20rem] justify-center"
            v-else
          >
            <h-button
              type="button"
              btn-name="no"
              @click="handleDelete(false)"
              class="w-fit"
              :gradient="false"
              rounded-class="rounded-md"
              btn-class="overflow-hidden border-2 border-darkblue text-darkblue hover:bg-darkblue hover:text-light400"
              btn-name-class="font-bold w-16"
            />
            <h-button
              type="button"
              btn-name="yes"
              @click="handleDelete(true)"
              class="w-fit"
              :gradient="false"
              rounded-class="rounded-md"
              btn-class="overflow-hidden border-2 border-red text-red hover:bg-red hover:text-light400"
              btn-name-class="font-bold w-16"
            />
          </div>
        </div>
      </template>
    </h-dialog>

    <h-dialog
      class="sm:w-[70%] w-[90%] lg:w-[60%]"
      content-class="overflow-y-auto max-h-[100vh-5rem]"
      :title="is_add_driver ? 'Add Driver' : 'Edit Driver'"
      v-model="open_form_dialog.value"
      :set-value="set_value"
      @form-submit="handleFormSubmit"
    >
      <template #content>
        <div class="max-h-[calc(100vh-7rem)]">
          <div
            class="bg-light400 grid grid-cols-1 md:grid-cols-2 gap-x-6 overflow-y-auto pr-2 max-h-[calc(100vh-8rem)]"
          >
            <h-text-field
              name="first_name"
              label="first_name"
              rules="required"
              placeholder="e.g sombody"
              type="text"
              v-model="set_value.first_name"
            >
            </h-text-field>
            <h-text-field
              type="text"
              label="Last Name"
              name="last_name"
              placeholder="e.g musk"
              rules="required"
              v-model="set_value.last_name"
            >
            </h-text-field>
            <h-text-field
              type="email"
              label="email"
              name="email"
              placeholder="e.g: someone@gmail.com"
              v-model="set_value.email"
              rules="required|email"
            >
            </h-text-field>
            <h-text-field
              type="tel"
              label="phone"
              name="phone"
              v-model="set_value.phone"
              placeholder="99767642"
              rules="required|phoneNumber"
              leading-text="+251"
            >
            </h-text-field>
            <h-text-field
              type="text"
              label="Car Name"
              name="car"
              v-model="set_value.car"
              placeholder="Marchedise"
              rules="required"
            >
            </h-text-field>
            <h-text-field
              type="text"
              label="Platelate Number"
              name="platelate_number"
              v-model="set_value.platelate_number"
              rules="required"
              placeholder="78424"
            >
            </h-text-field>
            <div class="flex flex-col gap-1">
              <label for="license" class="text-sm text-neutral400 font-semibold"
                >License</label
              >

              <h-file-upload
                :limit="1"
                accept="image/*"
                rules="required"
                name="license"
                v-model="set_value.license"
                id="license"
              />
            </div>
          </div>

          <div
            class="flex justify-end items-end h-9 border-t-2 drop-shadow-md backdrop-blur"
          >
            <h-button
              type="submit"
              btn-name="Save"
              btn-class="px-4"
              :is-loading="loading"
              btn-name-class="text-light400"
            ></h-button>
          </div>
        </div>
      </template>
    </h-dialog>

    <div
      class="relative flex flex-wrap items-center md:justify-between gap-2 md:gap-10 mb-5"
    >
      <div class="w-fit flex justify-start">
        <strong class="text-2xl font-semibold text-dark300 place-content-start"
          >Driver List</strong
        >
      </div>
      <div class="flex md:gap-10 gap-2 justify-end flex-wrap-reverse">
        <h-button
          btn-name="delete"
          type="button"
          v-if="is_checked"
          @click="handleMultipleDelete"
        ></h-button>
        <button
          @click="gPDF"
          class="text-sm font-medium text-primary border border-primary px-3 py-1 rounded-md hover:text-light400 hover:bg-primary"
        >
          PDF
        </button>
        <div class="relative md:w-[20rem] w-full">
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
        <h-button
          type="button"
          btn-class="h-[2.5rem] min-w-[10rem] bg-darkblue"
          leading-icon="uil:user"
          leading-icon-class="text-light400 bg-primary w-[3rem] -ml-6 rounded-l-md"
          btnName="Add Driver"
          btn-name-class="text-light400 text-sm font-semibold"
          :rounded="true"
          rounded-class="rounded-md bg-darkblue"
          @click="
            () => {
              open_form_dialog.value = true;
              is_add_driver = true;
              set_value.first_name = null;
              set_value.last_name = null;
              set_value.email = null;
              set_value.license = null;
              set_value.platelate_number = null;
              set_value.phone = null;
              set_value.car = null;
            }
          "
        ></h-button>
      </div>
    </div>

    <h-modal
      v-model="view_license.is_viewd"
      content-parent-class="flex relative flex-col justify-center md:w-fit w-[90%]  sm:w-[80%] items-center"
      sub-parent-class="flex justify-center items-center"
    >
      <template #content>
        <div
          class="flex flex-row bg-light400 pt-[2rem] pb-7 h-[28rem] md:w-[40rem] w-full lg:w-[50rem] rounded-lg shadow-md drop-shadow-md"
        >
          <nuxt-img
            :src="view_license.license"
            class="object-center object-contain h-[25rem] w-full"
            alt="license"
          >
          </nuxt-img>
        </div>
      </template>
    </h-modal>

    <h-table
      :headers="header"
      header-class="bg-darkblue"
      body-class="py-2"
      :body="all_driver_result"
      :item-i-d="driverID"
      :is-checked="true"
      @select:row="selectedRowHandler"
      :loading="loading_fetch_all_driver"
    >
      <template #first_name="{ item }">
        {{ item.first_name }}
      </template>
      <template #last_name="{ item }">
        {{ item.last_name }}
      </template>
      <template #phone="{ item }">
        {{ item.phone_number }}
      </template>
      <template #email="{ item }">
        {{ item.email }}
      </template>
      <template #driver_license="{ item }">
        <button
          class="text-sm font-smibold border border-primary px-1 py-[1px] rounded-sm hover:text-light400 hover:bg-primary flex justify-center items-center gap-2 text-primaryvar2"
          @click.stop="
            () => {
              view_license.is_viewd = true;
              view_license.license = item.license;
            }
          "
        >
          <Icon name="mdi:license" class="text-lg font-semibold" />
          <span>View</span>
        </button>
      </template>
      <template #action="{ item }">
        <h-menu
          @option-clicked="editHandler"
          leading_icon="ph:dots-three-outline-vertical-fill"
          :menu="{ id: item.email, actions: ['Edit', 'Delete'] }"
        >
        </h-menu>
      </template>
      <!-- <template #first_name="{item}"></template> -->
    </h-table>
    <div
      class="text-sm font-semibold w-full text-center text-primary"
      v-if="all_driver_result && all_driver_result.length < 1"
    >
      No Result
    </div>
    <h-pagination
      :items-per-page="limit"
      :total-data="total_driver"
      :offset="offset"
      @update:offset="getOffset"
    />
  </div>
</template>
