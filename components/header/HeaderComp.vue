<script lang="ts" setup>
import { ref } from "vue";
const menu = ref(false);
</script>
<template>
  <div>
    <div class="header">
      <button @click="menu = !menu" class="header__button">
        <font-awesome-icon :icon="['fas', 'bars']" class="header__icon" />
      </button>
      <h1 class="header__h1">FlexChallenges</h1>
      <div v-if="menu" class="menu">
        <div class="menu__div">
          <select class="menu__div__select">
            <option>EUW</option>
            <option>EUNE</option>
            <option>NA</option>
            <option>OCE</option>
          </select>
          <a href="#" class="menu__item--close" @click="menu = !menu"
            ><font-awesome-icon :icon="['fas', 'xmark']"
          /></a>
        </div>

        <a href="/" class="menu__item">Home</a>
        <a href="#" class="menu__item">Tools</a>
        <a href="#" class="menu__item">Contact</a>
        <a href="/about" class="menu__item">About</a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
  background-color: #818181;
  padding-bottom: 1rem;
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
