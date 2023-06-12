<script setup>
const transcript = ref("");
const recording = ref(false);
const isRecording = ref(false);
// const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const sr = new Recognition();
// onMounted(() => {
//   sr.continuous = true;
//   sr.interimResults = true;
//   sr.onstart = () => {
//     isRecording.value = true;
//   };
//   sr.start();
//   sr.onend = () => {
//     console.log("Sr stopped");
//   };
//   sr.onresult = (eva) => {
//     const t = Array.from(eva.results)
//       .map((result) => result[0])
//       .map((result) => {
//         return result.transcript;
//       })
//       .join("");

//     transcript.value = t;
//   };
// });

definePageMeta({

middleware:"auth"

})
</script>

<template>
  <div
    class="w-full min-h-[calc(100vh-4rem)] flex flex-col-reverse md:flex-row justify-between gap-[3rem] mb-[2rem] md:gap-[20%] items-center px-[7%]"
  >
    <div class="flex flex-col gap-10" data-aos="fade-right">
      <h1
        class="text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-7xl lg:font-bold font-bold flex flex-wrap gap-2"
      >
        <p>{{ transcript }}</p>
        <span class="text-primary tracking-wide whitespace-nowrap"
          >HibirLink + ride</span
        >
        <span class="whitespace-nowrap">Delivery Portal</span>
      </h1>
      <p class="md:text-base text-sm font-medium text-neutral-600">
        Ride Detail Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s, when an unknown printer took a galley of type
        and scrambled it to make a type specimen book. Some additional not will
        added and it should be at most five lines. no more than five lines.
      </p>
      <div class="flex flex-col sm:flex-row gap-7">
        <NuxtLink
          :to="{ name: 'order' }"
          class="w-full h-[3rem] bg-gradient-to-r font-semibold tracking-wide focus:ring-2 ring-primary focus:ring-offset-2 from-darkblue to-primary hover:from-primary hover:to-darkblue transition-colors duration-300 flex justify-center items-center rounded text-light400"
          >Order</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'driver' }"
          class="w-full h-[3rem] border-[2px] font-semibold tracking-wide rounded border-primary bg-light400 flex justify-center items-center text-primary hover:bg-primary hover:text-light400"
        >
          Driver
        </NuxtLink>
      </div>
    </div>
    <div class="w-full" data-aos="fade-left">
      <img
        src="/images/delivery.png"
        class="object-cover object-center min-w-[18rem] bg-blend-multiply"
        alt="delivery photo"
      />
    </div>
  
  </div>
</template>
