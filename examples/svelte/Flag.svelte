<script lang="ts">
  import "@johnmorrisdotca/hata/element/define";

  let { code = "JP-13" }: { code?: string } = $props();
</script>

<hata-flag {code} label="Tokyo"></hata-flag>
