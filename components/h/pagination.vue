<template>
  <div v-if="totalPages > 1">
    <div
      v-if="totalPages > 0"
      class="flex w-full flex-wrap justify-between pb-0 mx-2"
    >
      <div>
        <a
          href="#"
          class="relative inline-flex items-center sm:px-2 py-2 text-sm font-medium hover:text-primary"
          :class="[
            pageTracker === 1 || props.disabled
              ? 'text-neutral400 pointer-events-none'
              : ' text-primary',
          ]"
          @click="
            prev();
            backward();
          "
        >
          <Icon
            name="bxs:chevron-left"
            class="h-5 w-6"
            aria-hidden="true"
            :class="[
              pageTracker === 1 || props.disabled
                ? 'text-neutral400 pointer-events-none'
                : 'text-primary',
            ]"
          />
          <span class="ml-1 hidden sm:block font-bold">{{
            $t("previous")
          }}</span>
        </a>
      </div>

      <div
        class="relative z-0 inline-flex -space-x-px -top-0.5"
        aria-label="Pagination"
      >
        <a
          v-for="n in totalPages"
          v-show="totalPages <= 7"
          :key="n"
          href="#"
          aria-current="page"
          class="text-neutral400 relative inline-flex items-center px-4 py-2 text-sm font-semibold"
          :class="{
            ' border-b-2  px-2 z-10 text-primary border-primary ':
              n === pageTracker,
            'text-neutral500 pointer-events-none': props.disabled,
          }"
          :disabled="props.disabled ? 'pointer-events-none' : ''"
          @click="toggle(n)"
        >
          {{ n }}
        </a>

        <a
          v-for="n in range(1, firstThree)"
          v-show="totalPages > 7"
          :key="n"
          href="#"
          aria-current="page"
          class="text-neutral400 font-semibold relative inline-flex items-center px-4 py-2 text-sm"
          :class="{
            'border-b-2 px-2 z-10 text-primary border-primary':
              n === pageTracker,
            'text-neutral500 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
        <a
          v-show="totalPages > 7"
          v-if="middleChecker"
          href="#"
          aria-current="page"
          class="text-neutral400 relative inline-flex items-center px-4 py-2 text-sm font-medium"
          :class="{
            'text-neutral500 pointer-events-none': props.disabled,
          }"
        >
          ...
        </a>
        <!-- <div > -->
        <a
          v-for="n in range(middleStart, middleEnd)"
          v-show="pageTracker > 4 && pageTracker < totalPages - 2"
          :key="n"
          href="#"
          aria-current="page"
          class="text-neutral400 font-semibold relative inline-flex items-center px-4 py-2 text-sm"
          :class="{
            'border-b-2 px-2 z-10 text-primary border-primary':
              n === pageTracker,
            'text-neutral500 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
        <!-- </div> -->
        <a
          v-show="totalPages > 7"
          href="#"
          aria-current="page"
          class="text-neutral400 relative inline-flex items-center px-4 py-2 text-sm font-medium"
          :class="{
            'text-neutral500 pointer-events-none': props.disabled,
          }"
        >
          ...
        </a>
        <a
          v-for="n in range(lastThree, totalPages)"
          v-show="totalPages > 7"
          :key="n"
          href="#"
          aria-current="page"
          class="text-neutral400 font-semibold relative inline-flex items-center px-4 py-2 text-sm"
          :class="{
            'border-b-2 px-2 z-10 text-primary border-primary':
              n === pageTracker,
            'text-neutral500 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
      </div>
      <div>
        <a
          href="#"
          class="relative inline-flex items-center sm:px-2 py-2 text-sm font-medium hover:text-primary"
          :class="[
            pageTracker === totalPages || props.disabled
              ? 'text-neutral400 pointer-events-none'
              : 'text-primary',
          ]"
          @click="
            next();
            forward();
          "
        >
          <span class="mr-1 hidden sm:block font-bold">{{ $t("next") }}</span>
          <Icon
            name="bxs:chevron-right"
            class="h-5 w-6"
            :class="[
              pageTracker === totalPages || props.disabled
                ? 'text-neutral400 pointer-events-none'
                : 'text-primary',
            ]"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
    <div v-else class="flex w-full flex-wrap justify-between mx-10">
      <div>
        <a
          href="#"
          class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-neutral500 hover:bg-light400 pointer-events-none mr-1 hover:text-primary"
        >
          <Icon
            name="uil:angle-left"
            class="h-5 w-6 text-primary"
            aria-hidden="true"
          />
          <span class="ml-5 hidden sm:block">{{ $t("previous") }}</span>
        </a>
      </div>
      <div>
        <a
          href="#"
          class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-neutral500 hover:text-primary pointer-events-none"
        >
          <span class="mr-1 hidden sm:block">{{ $t("next") }}</span>
          <Icon
            name="uil:angle-right"
            class="h-5 w-6 text-primary"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePagination } from "vue-composable";
import type { Ref } from "vue";

interface PaginationPropsInterface {
  modelValue?: number;
  length?: number;
  disabled?: boolean;
  itemsPerPage: number;
  totalData?: number;
  offset?: number;
}

const props = withDefaults(defineProps<PaginationPropsInterface>(), {
  modelValue: 10,
  length: undefined,
  disabled: false,
  itemsPerPage: undefined,
  totalData: undefined,
  offset: undefined,
});

const emit = defineEmits<{
  (e: "update:modelValue", idr: number): void;
  (e: "update:offset", id: number): void;
}>();

const setEvents = () => {
  emit("update:modelValue", pageTracker.value);
  emit("update:offset", offset.value);
};

const totalPages = computed(() => {
  if (props.length !== undefined) {
    return Number(props.length) / 1;
  } else if (
    props.totalData !== undefined &&
    props.itemsPerPage !== undefined
  ) {
    return Math.ceil(props.totalData / props.itemsPerPage);
  }
  return 0;
});

let pageTracker: Ref<number> = ref(0);
if (props.offset === 0) {
  pageTracker.value = 1;
} else if (props.offset !== undefined) {
  pageTracker.value = Math.floor(props.offset / props.itemsPerPage);
} else {
  pageTracker.value = props.modelValue / 1;
}

// Functions two calculate direction of the dots
const offset = computed(() => {
  return (pageTracker.value - 1) * props.itemsPerPage;
});

const pageL1 = computed(() => {
  return pageTracker.value === 1;
});

const page3OR4 = computed(() => {
  return pageTracker.value === 3 || pageTracker.value === 4;
});

const pageBTN = computed(() => {
  return pageTracker.value >= 5 && pageTracker.value < totalPages.value - 2;
});

const pageLASTS = computed(() => {
  return pageTracker.value >= totalPages.value - 2;
});

const firstThree = computed(() => {
  return pageL1.value
    ? 3
    : page3OR4.value
    ? 5
    : pageBTN.value || pageLASTS.value
    ? 1
    : 3;
});

const lastThree = computed(() => {
  return pageL1.value
    ? totalPages.value - 2
    : page3OR4.value || pageBTN.value
    ? totalPages.value
    : pageLASTS.value
    ? totalPages.value - 4
    : totalPages.value - 2;
});

const middleStart = computed(() => {
  return pageBTN.value ? pageTracker.value - 1 : 0;
});

const middleEnd = computed(() => {
  return pageBTN.value ? pageTracker.value + 1 : 0;
});

const middleChecker = computed(() => {
  return pageBTN.value ? true : false;
});

const toggle = (n: number) => {
  pageTracker.value = n;
  setEvents();
};

const backward = () => {
  if (pageTracker.value > 1) {
    pageTracker.value--;
    setEvents();
  }
};

const forward = () => {
  if (pageTracker.value < totalPages.value) {
    pageTracker.value++;
    setEvents();
  }
};

const { prev, next } = usePagination({
  currentPage: pageTracker.value,
  pageSize: totalPages.value,
  total: 0,
});

const range = (start: number, end: number) => {
  return Array<any>(end - start + 1)
    .fill(undefined)
    .map((_, idx) => start + idx);
};
</script>
