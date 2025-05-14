<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useProducts from '../../composables/useProducts.js'
const route = useRoute()
const router = useRouter()
const localProduct = useProducts().findPr(Number(route.params.id))
const productChange = reactive({
    data: {
        oldName: localProduct.name,
        newName: "",
        newDescription: "",
        newPrice: null,
    }
})

function changeProduct() {
    console.log(useProducts().changeProducts(productChange.data))
    productChange.data.newDescription = ""
}
</script>
<template>
            <button @click="changeProduct">изменить</button>
            описание<input type="text" v-model="productChange.data.newDescription">
</template>
<style scoped>

</style>