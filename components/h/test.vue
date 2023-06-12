<template>
  <div
    class="min-h-full w-[min(20rem,calc(100vw-theme(spacing.10)))] bg-white shadow-2xl ring-1 ring-black/10 transition"
    id="headlessui-dialog-panel-201"
    data-headlessui-state="open"
  >
    <h2
      class="sr-only"
      id="headlessui-dialog-title-202"
      data-headlessui-state="open"
    >
      Navigation
    </h2>
    <button
      type="button"
      class="absolute right-6 top-5 flex h-8 w-8 items-center justify-center"
      tabindex="0"
    >
      <span class="sr-only">Close navigation</span
      ><svg
        class="h-3.5 w-3.5 overflow-visible stroke-slate-900"
        fill="none"
        stroke-width="1.5"
        stroke-linecap="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L14 14M14 0L0 14"></path>
      </svg>
    </button>
    <nav
      class="divide-y divide-slate-900/10 text-base leading-7 text-slate-900"
    >
      <div class="px-8 py-6">
        <a class="block w-9 overflow-hidden" href="/"
          ><span class="sr-only">Tailwind UI</span
          >
         </a>
      </div>
      <div class="px-8 py-6">
        <div class="-my-2 items-start space-y-2">
          <a class="block w-full py-2 font-semibold" href="/components"
            >Components</a
          ><a
            class="flex w-full items-center py-2 font-semibold"
            href="/templates"
            >Templates
            <div
              class="ml-2 rounded-full bg-sky-500 px-1.5 py-0.5 text-xs text-white sm:hidden"
            >
              New
            </div></a
          ><a class="block w-full py-2 font-semibold" href="/documentation"
            >Documentation</a
          >
        </div>
      </div>
      <div class="px-8 py-6">
        <div class="-my-2 space-y-4">
          <a class="block w-full py-2 font-semibold" href="/login">Sign in</a
          ><a
            class="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full"
            href="/all-access"
            ><span>Get all-access <span aria-hidden="true">→</span></span></a
          >
        </div>
      </div>
    </nav>
  </div>
</template>
