<template>
  <v-snackbar
    v-model="$snack.value"
    variant="flat"
    location="bottom right"
    color="error"
    transition="slide-x-reverse-transition"
  >
    {{ $error.value }}<span class="float-right font-weight-bold">ERROR</span>
  </v-snackbar>
</template>
