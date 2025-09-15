<template>
  <svg
      :class="['fi-br-search', className]"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
  >
    <g class="g" clip-path="url(#clip0_1_440)">
      <path
          class="path"
          :d="pathData"
          :fill="color"
      />
    </g>
    <defs class="defs">
      <clipPath class="clip-path" id="clip0_1_440">
        <rect class="rect" fill="white" height="24" width="24" />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  name: "FiBrSearch",
  props: {
    color: {
      type: String,
      default: "#374957",
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    pathData() {
      return "M23.5612 21.4455L18.9161 16.7984C22.3918 12.1536 21.4441 5.57058 16.7993 2.09486C12.1545 -1.38086 5.57153 -0.433144 2.09581 4.21163C-1.37991 8.8564 -0.432198 15.4394 4.21258 18.9151C7.94364 21.7071 13.0682 21.7071 16.7993 18.9151L21.4464 23.5622C22.0304 24.1462 22.9772 24.1462 23.5612 23.5622C24.1452 22.9782 24.1452 22.0314 23.5612 21.4475L23.5612 21.4455ZM10.5447 18.0182C6.41661 18.0182 3.0702 14.6718 3.0702 10.5437C3.0702 6.41566 6.41661 3.06925 10.5447 3.06925C14.6727 3.06925 18.0191 6.41566 18.0191 10.5437C18.0147 14.6699 14.6709 18.0138 10.5447 18.0182Z";
    },
  },
};
</script>

<style>
</style>