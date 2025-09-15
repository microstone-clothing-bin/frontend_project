<template>
  <img
      :class="['fi-rs-marker-2', className]"
      alt="Fi rs marker"
      :src="fiRsMarker"
  />
</template>

<script>
export default {
  name: "FiRsMarker_2",
  props: {
    className: {
      type: String,
      default: "",
    },
    fiRsMarker: {
      type: String,
      default: "https://c.animaapp.com/mWfNph5Y/img/fi-rs-marker.svg",
    },
  },
};
</script>

<style>
.fi-rs-marker-2 {
  height: 1.25vw;       /* 24px */
  width: 1.25vw;        /* 24px */
}
</style>