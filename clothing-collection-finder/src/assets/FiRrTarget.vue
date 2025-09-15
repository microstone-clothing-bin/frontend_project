<template>
  <img
      :class="['fi-rr-target', className]"
      alt="Fi rr target"
      :src="fiRrTarget"
  />
</template>

<script>
export default {
  name: "FiRrTarget",
  props: {
    className: {
      type: String,
      default: "",
    },
    fiRrTarget: {
      type: String,
      default: "https://c.animaapp.com/7dVsVbbk/img/fi-rr-target.svg",
    },
  },
};
</script>

<style>
.fi-rr-target {
  height: 1.25vw;   /* 24px */
  left: 0;
  position: absolute;
  top: 0;
  width: 1.25vw;   /* 24px */
}
</style>