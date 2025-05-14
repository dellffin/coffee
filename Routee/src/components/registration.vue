<script setup>
import useUsers from '../composables/useUsers.js'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
// const { addUser, Iduser } = useUsers()
const current = useUsers()
const Id = computed(() => current.currentUser.value.id)
const error = ref("")
const error2 = ref("")
const error3 = ref("")
const router = useRouter()
const user = reactive({
    data: {
        name: "",
        password: "",
    }

})

function addUser() {
    let flag = true
    error.value = ""
    error2.value = ""
    if (user.data.name === "") {
        error.value = "Введите имя"
        flag = false
    } else if (!/^([А-ЯЁ][а-яё]*[\d!\?]?)+$/u.test(user.data.name)) {
        error.value = "Имя должно быть на русском языке и с большой буквы"
        flag = false
    } else if (user.data.name.length < 4 || user.data.name.length > 10) {
        error.value = "Имя должно содержать от 4 до 10 символов"
        flag = false
    }

    if (user.data.password.length < 4 || user.data.password.length > 10) {
        error2.value = "Пароль должен содержать от 4 до 10 символов"
        flag = false
    }

    if (flag) {
        error.value = ""
        error2.value = ""
        const addUser = useUsers().addUser
        console.log(addUser);

        if (addUser(user.data) === 'Это имя уже выбрал другой пользователь. Придумайте другое') {
            error3.value = "Это имя уже выбрал другой пользователь. Придумайте другое"
        } else {
            addUser(user.data)
            user.data.name = ""
            user.data.password = ""
            router.push({ name: "account", params: { id: Id.value } })
        }
    }
}

</script>
<template>
    <div class="container">
      <h2>Регистрация</h2>
      <div class="form-group">
        <input type="text" v-model="user.data.name" placeholder="Придумайте имя">
        <div class="error">{{ error }}</div>
      </div>
      <div class="form-group">
        <input type="password" v-model="user.data.password" placeholder="Придумайте пароль">
        <div class="error">{{ error2 }}</div>
      </div>
      <div class="error">{{ error3 }}</div>
      <button @click="addUser">Создать аккаунт</button>
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