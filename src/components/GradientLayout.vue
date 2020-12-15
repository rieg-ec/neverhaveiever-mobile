<template>
  <div class="w-full h-70h" :class="$style['gradient-content']">
    <div class="w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default { name: 'GradientLayout' };

</script>

<style module>
.gradient-content {
  background: var(--gradient-primary);
}
</style>
