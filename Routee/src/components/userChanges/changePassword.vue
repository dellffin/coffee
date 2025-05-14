<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUsers from '../../composables/useUsers.js'
import useProducts from '../../composables/useProducts.js'
const route = useRoute()
const router = useRouter()
const error1 = ref("")
const error2 = ref("")
const localUser = useUsers().findUs(Number(route.params.id))
const changes = reactive({
    data: {
        oldName: localUser?.name,
        name: "",
        oldPassword: "",
        newPassword: ""
    }
})

function changeUser() {
    let flag = 1
    error1.value = ""
    error2.value = ""
    if (changes.data.newPassword.length !== 0) {
        if (changes.data.newPassword.length < 4 || changes.data.newPassword.length > 10) {
            error2.value = "Пароль должен содержать от 4 до 10 символов"
        }
    } else {
        flag -= 1
    }
    if (flag !== 0) {
        error1.value = ""
        error2.value = ""
        console.log(useUsers().changeUser(changes.data))
        useProducts().changeAuthor(changes.data)
        changes.data.newPassword = ""
        changes.data.oldPassword = ""
    }
}
</script>

<template>
  <div class="change-form">
    <h3 class="form-title">Изменение пароля</h3>
    
    <div class="form-group">
      <label class="form-label">Текущий пароль</label>
      <input 
        type="password" 
        v-model="changes.data.oldPassword"
        class="form-input"
        placeholder="Введите текущий пароль"
      >
      <span v-if="error1" class="error-message">{{ error1 }}</span>
    </div>
    
    <div class="form-group">
      <label class="form-label">Новый пароль</label>
      <input 
        type="password" 
        v-model="changes.data.newPassword"
        class="form-input"
        placeholder="Введите новый пароль"
      >
      <span v-if="error2" class="error-message">{{ error2 }}</span>
    </div>
    
    <button @click="changeUser(changes.data)" class="submit-btn">
      Изменить пароль
    </button>
  </div>
</template>

<style scoped>
/* Стили такие же как в changename.vue */
.change-form {
  background-color: #fffdfa;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-title {
  color: #5e340d;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  box-sizing: border-box;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #8c6a46;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #d4c4b2;
  border-radius: 8px;
  background-color: #f9f5f0;
  color: #5e340d;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #a67c52;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #c45e3d;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;
}

.submit-btn:hover {
  background-color: #8c6a46;
}

@media (max-width: 768px) {
  .change-form {
    padding: 20px;
  }
}
</style>