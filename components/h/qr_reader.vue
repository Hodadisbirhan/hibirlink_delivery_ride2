<template>
  <div class="w-[20rem] z-50 h-[20rem] relative">
    <qrcode-stream v-if="!result" @decode="onDecode" class="absolute">
      <div v-if="scanStart" class="w-[20rem] h-[20rem] z-50 absolute top-0">
        <div
          class="w-[230px] z-50 rounded-lg h-[230px] m-auto border-2 border-green-400 relative"
        >
          <div
            class="absolute -top-2 -right-2 w-[50px] h-[50px] rounded-tr-xl border-t-4 border-r-4 border-white"
          ></div>
          <div
            class="absolute -top-2 -left-2 w-[50px] h-[50px] rounded-tl-xl border-t-4 border-l-4 border-white"
          ></div>
          <div
            class="absolute -bottom-2 -right-2 w-[50px] h-[50px] rounded-br-xl border-b-4 border-r-4 border-white"
          ></div>
          <div
            class="absolute -bottom-2 -left-2 w-[50px] h-[50px] rounded-bl-xl border-b-4 border-l-4 border-white"
          ></div>
          <div
            class="w-full h-[40px] bg-gradient-to-t from-green-300 to-transparent scan absolute"
          ></div>
        </div>
        <div
          class="absolute top-0 bg-black/30 w-full h-[calc(50vh-110px)]"
        ></div>
        <div
          class="absolute left-0 top-[calc(50vh-110px)] bg-black/30 w-[calc(50vw-115px)] h-[230px]"
        ></div>
        <div
          class="absolute right-0 top-[calc(50vh-110px)] bg-black/30 w-[calc(50vw-115px)] h-[230px]"
        ></div>
        <div
          class="absolute bottom-0 bg-black/30 w-full h-[calc(50vh-120px)]"
        ></div>
      </div>
    </qrcode-stream>
    <div
      v-if="result"
      class="w-full h-full flex flex-col gap-4 items-center justify-center"
    >
      <p>{{ result }}</p>
      <button
        class="outline-none py-1 px-3 text-white bg-green-400 border-none rounded-md"
        @click="scanAgain"
      >
        scan again
      </button>
    </div>
  </div>
</template>
<style>
.scan {
  animation: scan;
  animation-duration: 1250ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes scan {
  from {
    margin-top: 0px;
  }
  to {
    margin-top: 190px;
  }
}
</style>
<script setup lang="ts">
import { QrcodeStream } from "vue3-qrcode-reader";
const scanStart = ref(false);
const result = ref("");
const emits = defineEmits(["getScannedValue"]);
const scan = ref(true);
const onDecode = (decodeResult) => {
  result.value = decodeResult;
  scanStart.value = false;
  console.log(result.value);
  console.log(decodeResult);
  emits("getScannedValue", result.value);
};

const scanAgain = () => {
  scanStart.value = false;
  result.value = "";
};
// const init = async (promise) => {
//   await promise;
//   scanStart.value = true;
// };
</script>
