<script setup lang="ts">
import "@johnmorrisdotca/hata/element/define";

withDefaults(defineProps<{ code?: string }>(), { code: "JP-13" });
</script>

<template>
  <hata-flag :code="code" label="Tokyo"></hata-flag>
</template>
