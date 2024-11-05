<script setup lang="ts"></script>

<template>
  <header
    class="large-header bg-gradient-to-b via-45% from-background via-gradient to-background flex flex-col px-6 pt-12 text-primaryText rounded-lg shadow-md"
  >
    <slot></slot>
  </header>
</template>

<style>
.large-header {
  min-height: 210px;
}
</style>
