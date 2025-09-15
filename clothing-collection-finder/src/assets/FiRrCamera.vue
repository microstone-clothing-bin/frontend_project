<template>
  <img
      :class="['fi-rr-camera', className]"
      alt="Fi rr camera"
      :src="fiRrCamera"
  />
</template>

<script>
export default {
  name: "FiRrCamera",
  props: {
    className: {
      type: String,
      default: "",
    },
    fiRrCamera: {
      type: String,
      default: "https://c.animaapp.com/7dVsVbbk/img/fi-rr-camera.svg",
    },
  },
};
</script>

<style>
.fi-rr-camera {
  height: 1.25vw;   /* 24px */
  left: 0;
  position: absolute;
  top: 0;
  width: 1.25vw;   /* 24px */
}
</style>