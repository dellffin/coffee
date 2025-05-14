<script setup>
import { useRoute, useRouter } from 'vue-router'
import useUsers from '../composables/useUsers.js'
import { computed } from 'vue'
const router = useRouter()
const current = useUsers()
const role = computed(() => current.currentUser.value.role)
if (role.value == "client") {
    router.push({ name: "authorization" })
}
const users = useUsers().users
</script>

<template>
    <div class="container">

        <div v-for="elem in users">
            <RouterLink :to="{
                name: 'account',
                params: {
                    id: elem.id
                }
            }"> {{ elem.id }} : {{ elem.name }}, {{ elem.role }}
            </RouterLink>

        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    left: 10%;
    justify-content: left;
    align-items: center;
    margin-top: 10vw;
    flex-direction: column;
    gap: 10px;
}
</style>