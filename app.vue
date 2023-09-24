<template>
  <div>
    <NuxtPage />
  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  transition: 0.4s;
  line-height: 1.6;

  &::before,
  &::after {
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 1.6;
  }
}

body,
html {
  scroll-behavior: smooth;
  font-family: sans-serif;
  height: 100%;
  padding-top: 0;
  width: 100%;
  min-height: 100vh;
}
button {
  cursor: pointer;
}
</style>
