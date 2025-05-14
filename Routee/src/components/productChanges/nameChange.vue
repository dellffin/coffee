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
    productChange.data.newName = ""
}
</script>
<template>
            <button @click="changeProduct">изменить</button>
            название<input type="text" v-model="productChange.data.newName">
</template>
<style scoped>

</style>