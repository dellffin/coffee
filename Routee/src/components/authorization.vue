<script setup>
import useUsers from '../composables/useUsers.js'
import { useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'
const error = ref("")
const Iduser = computed(() => useUsers().Iduser.value)
console.log(Iduser)
const router = useRouter()
const user = reactive({
    data: {
        name: "",
        password: "",
    }

})
function logIn() {
    if (useUsers().logIn(user.data) === 'Успех') {// проверка на правильные имя и пароль. далее действия в случае правильных значений
        router.push({ name: "account", params: { id: Iduser.value } }) // переход в личный кабинет
        user.data.name = ""  //очистка полей здесь и ниже
        user.data.password = ""
    } else {
        if(useUsers().logIn(user.data) === 'Пользователя с таким именем не существует'){
            error.value = "Пользователя с таким именем не существует"
        }else{
            error.value = "Неверный пароль"
        } // вывод в случае неверного ввода
    }
}
</script>
<template>
    <div class="container">
      <h2>Вход в кофейный мир</h2>
      <div class="form-group">
        <input type="text" v-model="user.data.name" placeholder="Ваше имя">
      </div>
      <div class="form-group">
        <input type="password" v-model="user.data.password" placeholder="Пароль">
      </div>
      <div class="error">{{ error }}</div>
      <button @click="logIn">Войти</button>
    </div>
  </template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 5%;
  width: 350px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
  background-color: #f9f5f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input {
  padding: 12px 16px;
  border: 1px solid #d4b78f;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  background-color: #fffdfa;
  color: #5e340d;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #a67c52;
  box-shadow: 0 0 0 2px rgba(166, 124, 82, 0.2);
}

button {
  padding: 12px 24px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #8c6a46;
}

.error {
  color: #c45e3d;
  font-size: 14px;
  margin-top: 5px;
}

h2 {
  color: #5e340d;
  margin-bottom: 20px;
  font-size: 24px;
}
</style>