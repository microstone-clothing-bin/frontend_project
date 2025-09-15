<template>
  <svg
      :class="['fi-rs-marker', className]"
      fill="none"
      height="27"
      viewBox="0 0 27 27"
      width="27"
      xmlns="http://www.w3.org/2000/svg"
  >
    <g class="g" clip-path="url(#clip0_1_438)">
      <path
          class="path"
          :d="pathData1"
          :fill="color"
      />
      <path
          class="path"
          :d="pathData2"
          :fill="color"
      />
    </g>
    <defs class="defs">
      <clipPath class="clip-path" id="clip0_1_438">
        <rect class="rect" fill="white" height="27" width="27" />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  name: "FiRsMarker",
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
    pathData1() {
      return "M13.4526 27.0088L12.6684 26.3366C11.5873 25.4314 2.1475 17.2788 2.1475 11.3154C2.1475 5.07175 7.209 0.0102539 13.4526 0.0102539C19.6963 0.0102539 24.7578 5.07175 24.7578 11.3154C24.7578 17.2789 15.318 25.4314 14.2413 26.3411L13.4526 27.0088ZM13.4526 2.45476C8.56137 2.46029 4.59759 6.42407 4.59205 11.3153C4.59205 15.0617 10.3998 21.0464 13.4526 23.7856C16.5055 21.0453 22.3132 15.0572 22.3132 11.3153C22.3077 6.42407 18.344 2.46035 13.4526 2.45476Z";
    },
    pathData2() {
      return "M13.4528 15.7963C10.9778 15.7963 8.97151 13.7899 8.97151 11.315C8.97151 8.84007 10.9778 6.83374 13.4528 6.83374C15.9277 6.83374 17.934 8.84007 17.934 11.315C17.934 13.7899 15.9278 15.7963 13.4528 15.7963ZM13.4528 9.07432C12.2153 9.07432 11.2121 10.0775 11.2121 11.3149C11.2121 12.5524 12.2153 13.5556 13.4528 13.5556C14.6902 13.5556 15.6934 12.5524 15.6934 11.3149C15.6934 10.0775 14.6903 9.07432 13.4528 9.07432Z";
    },
  },
};
</script>

<style>
</style>