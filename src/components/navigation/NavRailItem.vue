<template>
  <div
    class="nav-row flex items-center cursor-pointer w-full overflow-hidden"
    style="padding: 12px 20px;"
    :aria-label="label"
  >
    <!-- Icon box: fixed 22px so 18px icons align with 22px icons -->
    <span class="shrink-0 flex items-center justify-center" style="width: 22px; height: 22px;">
      <img
        class="item-icon"
        :class="active ? 'icon-active' : 'icon-inactive'"
        :src="active && iconActive ? iconActive : icon"
        :alt="label"
        :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
      />
    </span>

    <!-- Label: fades + slides in when expanded -->
    <span
      class="nav-label"
      :class="[{ 'nav-label--shown': expanded }, active ? 'label-active' : 'label-inactive']"
      :style="{ fontSize: labelSize + 'px', fontWeight: active ? 500 : 400 }"
    >{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  iconActive: { type: String, default: null },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  iconSize: { type: Number, default: 22 },
  labelSize: { type: Number, default: 13 },
  expanded: { type: Boolean, default: false },
})
</script>

<style scoped>
/* Per-item hover: subtle Grey/50 fill, icon + label darken to Text/500 */
.nav-row {
  transition: background-color 150ms ease;
}
.nav-row:hover {
  background: #fcfcfd;
}

.item-icon {
  transition: filter 150ms ease;
}
/* Text/400 #61667c */
.icon-inactive {
  filter: invert(39%) sepia(18%) saturate(461%) hue-rotate(192deg) brightness(96%) contrast(90%);
}
/* Primary/500 #2465de */
.icon-active {
  filter: invert(30%) sepia(56%) saturate(2339%) hue-rotate(205deg) brightness(94%) contrast(94%);
}
/* Text/500 #03102f on hover (inactive icons only) */
.nav-row:hover .icon-inactive {
  filter: invert(9%) sepia(19%) saturate(4811%) hue-rotate(203deg) brightness(89%) contrast(107%);
}

.nav-label {
  margin-left: 0;
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  line-height: 1.5;
  overflow: hidden;
  transition:
    max-width 250ms cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 180ms ease-out,
    color 150ms ease;
}
.nav-label--shown {
  margin-left: 8px;
  max-width: 120px;
  opacity: 1;
}
.label-active {
  color: #03102f;
}
.label-inactive {
  color: #61667c;
}
.nav-row:hover .label-inactive {
  color: #03102f;
}
</style>
