<script setup>
import { useRoute, useRouter } from 'vue-router'
import useUsers from '../composables/useUsers.js'
import useProducts from '../composables/useProducts.js'
import { ref, reactive, computed } from 'vue'
const router = useRouter()
const current = useUsers()

const role = computed(() => current.currentUser.value.role)
if (role.value == "client") {
  router.push({ name: "authorization" })
}
const error1 = ref("")
const error2 = ref("")
const error3 = ref("")
const product = reactive({
  data: {
    name: "",
    description: "",
    price: null,
    author: computed(() => current.currentUser.value.name).value,
  }
})

function addProduct() {
  let flag = true
  error1.value = ""
  error2.value = ""
  error3.value = ""
  if (product.data.name == "") {
    error1.value = "Введите название для товара"
    flag = false
  }
  if (product.data.description == "") {
    error2.value = "Введите описание для товара"
    flag = false
  }
  if (product.data.price == null) {
    error3.value = "Укажите цену для товара"
    flag = false
  }
  if (flag) {
    error1.value = ""
    error2.value = ""
    error3.value = ""
    product.data.author = current.currentUser.value.name
    useProducts().addProduct(product.data)
    console.log(product.data)
    product.data.name = ""
    product.data.description = ""
    product.data.price = null
  }
}
</script>

<template>
  <div class="container">
    название <input type="text" v-model="product.data.name">
    {{ error1 }}<br>
    описание <input type="text" v-model="product.data.description">
    {{ error2 }}<br>
    цена <input type="number" v-model="product.data.price">
    {{ error3 }}
    <button @click="addProduct">добавить товар</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 10%;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}
</style>