<template>
  <Swiper
    class="rounded-sm overflow-hidden h-full"
    :modules="[SwiperAutoplay, EffectFade]"
    :slides-per-view="1"
    :preloadImages="true"
    :autoplay="
      autoplay
        ? {
            delay: 2000,
            disableOnInteraction: false,
            waitForTransition: true,
          }
        : undefined
    "
    :loop="true"
    :effect="'fade'"
    :speed="3000"
    :fade-effect="{
      crossFade: true,
    }"
  >
    <SwiperSlide v-for="(image, index) in images" :key="index" class="h-full">
      <div class="overflow-hidden h-full w-full">
        <nuxt-img
          :src="image.content"
          format="webp"
          loading="lazy"
          quality="100"
          fit="inside"
          class="w-full h-full hover:scale-125 object-center object-cover overflow-hidden transition-all ease-in-out duration-300"
        />
      </div>
    </SwiperSlide>
  </Swiper>
</template>
<script setup lang="ts">
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper";

interface Images {
  type: string;
  content: string;
}
interface Props {
  images: Images[];
  autoplay?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
});
</script>
