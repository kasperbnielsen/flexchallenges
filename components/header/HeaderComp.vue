<script lang="ts" setup>
import { ref } from "vue";
const menu = ref(false);
</script>
<template>
  <div>
    <div class="header">
      <h1 class="header__h1">FlexChallenges</h1>
    </div>
  </div>
</template>
<style scoped lang="scss">
* {
  color: white;
}
.header {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  padding-bottom: 1rem;
  background-color: #2f2fa2;
  &__h1 {
    margin-top: 1rem;
  }

  &__button {
    background: none;
    border: none;
    width: fit-content;
    margin-top: 1rem;
    margin-left: 2rem;
  }

  &__icon {
    width: 2rem;
    height: auto;
  }
}

.menu {
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 10rem;
  width: 20rem;

  &__div {
    display: flex;
    &__select {
      background-color: #818181;

      border-radius: 25px;
      height: fit-content;
      width: fit-content;
      padding: 1rem 3rem;
      left: 0;
      top: 0;
      position: absolute;
      margin: 1rem;
    }
  }

  &__item {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
    padding-right: 5rem;
    &:hover {
      color: #f1f1f1;
    }
    &--close {
      position: absolute;
      top: 1rem;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
    }
  }
}
</style>
