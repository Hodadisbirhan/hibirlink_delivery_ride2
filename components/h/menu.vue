<template>
  <div class="text-right">
    <Menu as="div" class="relative  w-full inline-block text-left">
      <div>
        <MenuButton class="justify-center w-fit items-end" @click.stop="null">
          <div class="w-fit group flex gap-2 items-end hover:cursor-pointer">
            <Icon
              :name="leading_icon"
              class="group-hover:fill-green300 transition-colors ease-in-out duration-300 fill-green200 w-6 h-6"
            />
            <h1
              v-if="label"
              class="transition-colors ease-in-out duration-300 font-semibold"
            >
              {{ label }}
            </h1>
          </div>
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute z-10 min-w-[6rem] w-full mt-0 right-0 top-4 origin-top-right divide-y divide-neutral100 rounded-md bg-light400 shadow-xl ring-1 ring-dark300 ring-opacity-5 focus:outline-none"
        >
          <div
            :class="
              menu.actions.length > 6
                ? 'sm:grid sm:grid-cols-2 sm:gap-x-3 sm:gap-y-1 '
                : ''
            "
            class="px-1 py-1"
          >
            <MenuItem
              v-for="action in menu.actions"
              :key="action"
              v-slot="{ active, close }"
            >
              <h1
                @click="handleClick(action, close)"
                class="transition-all w-full py-1 rounded-md text-start text-sm whitespace-nowrap px-2 capitalize ease-in-out duration-300 font-semibold"
                :class="[
                  active
                    ? ' bg-primary text-light300 cursor-pointer'
                    : 'text-neutral300 ',
                ]"
              >
                {{ $t(action) }}
              </h1>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

interface Menu {
  id: string;
  actions: Array<any>;
}

interface PropInterface {
  leading_icon: string;
  label?: string;
  menu: Menu;
}

const props = defineProps<PropInterface>();
const emit = defineEmits(["optionClicked"]);
const handleClick = (action: string, close: Function): void => {
  emit("optionClicked", { id: props.menu.id, action });
  close();
};
</script>
