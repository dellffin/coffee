<script setup>
import { RouterLink, RouterView } from "vue-router";
import useUsers from "./composables/useUsers.js";
import { computed } from "vue";

const current = useUsers();

const isAuthenticated = computed(() => {
  return (
    current.currentUser.value?.name !== undefined &&
    current.currentUser.value?.name !== ""
  );
});
const ifAdmin = computed(() => {
  return current.currentUser.value?.role === "admin";
});
</script>

<template>
<div class="app-layout">
  <nav class="menu-container">
    <!-- <div class="menu-wrapper"> -->
      <RouterLink :to="{ name: 'registration' }" class="menu-item" active-class="active-link">Регистрация</RouterLink>

      <RouterLink :to="{ name: 'authorization' }" class="menu-item" active-class="active-link">Авторизация</RouterLink>

      <RouterLink v-if="ifAdmin" :to="{ name: 'userList' }" class="menu-item" :class="{ hidden: !isAuthenticated }"
        active-class="active-link">Список пользователей</RouterLink>

      <RouterLink :to="{ name: 'products' }" class="menu-item" :class="{ hidden: !isAuthenticated }"
        active-class="active-link">Товары</RouterLink>

      <RouterLink :to="{ name: 'about' }" class="menu-item" :class="{ hidden: !isAuthenticated }"
        active-class="active-link">О нас</RouterLink>

      <RouterLink v-if="isAuthenticated" :to="{
        name: 'account',
        params: { id: current.currentUser.value?.id || 0 },
      }" class="menu-item" :class="{ hidden: !isAuthenticated }" active-class="active-link">Личный кабинет
      </RouterLink>

      <RouterLink v-if="ifAdmin" :to="{ name: 'addProduct' }" class="menu-item" :class="{ hidden: !isAuthenticated }"
        active-class="active-link">Добавить товар</RouterLink>
    <!-- </div> -->
  </nav>
      <main class="content-area">
      <RouterView />
    </main>
</div>
</template>

<style>

body {
    margin: 0;
  padding: 0;
  overflow-x: hidden;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./assets/coffee.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #f9f5f0;
  box-shadow: 0 2px 8px rgba(94, 52, 13, 0.1);
  padding: 15px 0;
  width: 100%;
  height: 60px;
}

.content-area {
  flex: 1;
  margin-top: 60px; /* Отступ = высота меню */
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.menu-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.menu-item {
  /* color: #5e340d; */
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item:hover {
  background-color: rgba(166, 124, 82, 0.1);
  color: #8c6a46;
}

.active-link {
  color: #a67c52;
  font-weight: 600;
}

.active-link::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 12px;
  right: 12px;
  height: 2px;
  background-color: #a67c52;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {
  .menu-wrapper {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: flex-start;
    padding: 0 15px;
  }

  .menu-item {
    font-size: 14px;
    padding: 6px 10px;
  }
}
</style>
