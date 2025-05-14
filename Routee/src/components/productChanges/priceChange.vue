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
    productChange.data.newPrice = null
}
</script>
<template>
            <button @click="changeProduct">изменить</button>
            цена<input type="number" v-model="productChange.data.newPrice">
</template>
<style scoped>

</style>