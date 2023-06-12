<template>
  <div :class="supporterClass" class="text-sm my-2 h-full overflow-x-auto">
    <table class="border-collapse w-full rounded font-body min-w-[1000px]">
      <thead
        :class="['text-sm text-light400 capitalize bg-primaryvar5', theadClass]"
      >
        <tr>
          <th :class="headerClass" v-if="isChecked">
            <span
              @click="allSelectFromPartialSelect"
              v-if="isChecked && isPartiallySelected"
              :class="[
                'flex justify-center py-3  items-center relative  mx-2',
                headerClass,
              ]"
            >
              <input
                name="minus"
                class="cursor-pointer bg-primaryvar1 w-4 h-4 appearance-none rounded"
                type="checkbox"
                v-model="selectedAll"
                value="minus"
              />
              <Icon
                name="uil:minus"
                class="text-light200 absolute top-[30%] z-10 text-base"
              />
            </span>

            <span
              v-else-if="isChecked"
              :class="[
                'flex justify-center py-3 items-center mx-2 ',
                headerClass,
              ]"
            >
              <input
                name="all"
                class="cursor-pointer bg-gray/5 w-4 h-4 rounded"
                type="checkbox"
                v-model="selectedAll"
                @change="selectAll"
                @click="null"
                value="all"
              />
            </span>
          </th>

          <th
            scope="col"
            v-for="head in headers"
            :key="head"
            class="text-left"
            :class="headerClass"
          >
            {{ $t(head) }}
          </th>
        </tr>
      </thead>

      <tbody v-if="loading">
        <tr class="odd:bg-green400/5 text-gray">
          <td v-for="head in headers" class="cursor-pointer" :key="head">
            <div
              class="h-8 my-0.5 rounded-sm bg-neutral500 flex items-center justify-center text-neutral300 animate-pulse"
            >
              <Icon name="svg-spinners:3-dots-fade" />
            </div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr
          v-for="row in body"
          :key="row.id"
          @click="emits('click:row', row.id)"
          class="odd:bg-light300 text-gray"
        >
          <td v-if="isChecked">
            <span
              :class="[bodyClass]"
              class="flex items-center justify-center"
              @change.stop="clickRow"
              @click.stop="null"
            >
              <input
                type="checkbox"
                name="row"
                v-model="selectedRows"
                class="cursor-pointer w-4 h-4 rounded bg-gray/5"
                :value="row.id"
              />
            </span>
          </td>
          <td
            v-for="head in headers"
            class="py-1 cursor-pointer"
            :key="head"
            :class="bodyClass"
          >
            <slot :item="row" :name="head"> </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  itemID: {
    type: Array,
    default: [],
  },
  headers: {
    type: Array<string>,
    default: [],
  },
  body: {
    type: [Array, Object],
    default: [],
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bodyClass: { type: String, default: "" },
  headerClass: { type: String, default: "" },
  supporterClass: { type: String, default: "" },
  theadClass: { type: String, default: "" },
});

const emits = defineEmits(["click:row", "select:row"]);
const selectedAll: any = ref([""]);
const selectedRows: any = ref([]);

const isPartiallySelected = computed(() => {
  return (
    selectedRows.value.length > 0 &&
    selectedRows.value.length < props.itemID.length
  );
});

const selectAll = () => {
  selectedAll.value = ["all"];
  console.log(selectedAll.value.length, "length");
  if (selectedRows.value.length > 0) {
    selectedAll.value = [];
    selectedRows.value = [];
    console.log(selectedAll.value.length > 0);
    emits("select:row", selectedRows.value);
  } else {
    selectedRows.value = [...props.itemID];
    console.log(selectedRows.value);
    selectedAll.value = ["all"];
    emits("select:row", selectedRows.value);
  }
};

const allSelectFromPartialSelect = () => {
  selectedAll.value = ["all"];
  selectedRows.value = [...props.itemID];
  emits("select:row", selectedRows.value);
};

const clickRow = () => {
  if (selectedRows.value.length === props.itemID.length)
    selectedAll.value = ["all"];
  emits("select:row", selectedRows.value);
  if (selectedRows.value.length > 0) emits("select:row", selectedRows.value);
};

watch(selectedRows, (newValue) => {
  if (newValue.length === props.itemID.length) {
    selectedAll.value = ["all"];
  }
});

// watchEffect(()=>{

//   console.log(selectedRows.value)
// })
</script>
