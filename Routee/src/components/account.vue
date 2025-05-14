<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'
import useUsers from '../composables/useUsers.js'
import useProducts from '../composables/useProducts.js'
import cupOfCoffee from '../assets/cupOfCoffee.jpg'
const route = useRoute()
const router = useRouter()
const error = ref("")
const current = useUsers()
const { addToCart, removeFromCart, clearCart, currentUser, exitUser } = useUsers()

const handleExit = () => {
  exitUser()
  router.push({ name: "authorization" })
}

const totalPrice = computed(() => {
  return currentUser.value.cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
})

function delUser() {
  if (currentUser.value.id != 0) {
    if (currentUser.value?.name === current.currentUser.value.name) {
      router.push({ name: "authorization" })
    } else {
      router.push({ name: "userList" })
    }
    useUsers().delUser(currentUser.value.id)
    useProducts().delUser(currentUser.value?.name)
  }
  else {
    error.value = "Админа удалить нельзя"
  }
}

function upgrade() {
  useUsers().upgradeUs(currentUser.value?.name)
}

function pushBuy(){
  router.push({ name: "buy" })
}

const getProductImage = (imageName) => {
  try {
    return new URL(`../assets/${imageName}`, import.meta.url).href
  } catch (e) {
    console.error('Error loading image:', e)
    return ''
  }
}
</script>

<template>
  <div class="account-wrapper">
    <div class="account-container">
      <div class="account-header">
        <h2>Личный кабинет</h2>
        <div class="coffee-divider"></div>
      </div>

      <div class="account-content">
        <div class="user-card">
          <div class="user-avatar">
            <img :src="cupOfCoffee" alt="Аватар пользователя" class="avatar-image">
          </div>

          <div class="user-details">
            <div class="detail-row">
              <span class="detail-label">Имя:</span>
              <span class="detail-value">{{ currentUser?.name }}</span>
            </div>

            <button
              v-if="currentUser?.name === current.currentUser.value.name || current.currentUser.value.name === 'Админ' || (current.currentUser.value.role === 'admin' && currentUser?.role === 'client')"
              @click="delUser" class="danger-btn">
              Удалить аккаунт
            </button>

            <button @click="handleExit" class="exit-btn">Выйти из аккаунта</button>

            <div class="error-message">{{ error }}</div>
          </div>
        </div>

        <div class="actions-panel">
          <h3>Управление аккаунтом</h3>

          <RouterLink :to="{ name: 'changeName' }"
            v-if="currentUser?.name === current.currentUser.value.name && current.currentUser.value.name !== 'Админ'"
            class="action-link">
            <span>✏️</span> Изменить имя
          </RouterLink>

          <RouterLink :to="{ name: 'changePassword' }"
            v-if="currentUser?.name === current.currentUser.value.name && current.currentUser.value.name !== 'Админ'"
            class="action-link">
            <span>🔒</span> Изменить пароль
          </RouterLink>

          <button v-if="currentUser?.role === 'client' && current.currentUser.value.role == 'admin'" @click="upgrade"
            class="primary-btn">
            Повысить до администратора
          </button>

          <RouterView />
        </div>

        <div class="basket">
          <h3>Корзина</h3>
          <div v-if="currentUser.cart?.length">
            <div v-for="item in currentUser.cart" :key="item.id" class="cart-item">
              
              <div class="cart-item-image">
          <img 
            v-if="item.image" 
            :src="getProductImage(item.image)" 
            :alt="item.name"
            class="product-thumbnail"
          >
          <div v-else class="image-fallback">
            <span class="coffee-icon">☕</span>
          </div>
        </div>
              
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.price }} ₽ × {{ item.quantity }} = {{ item.price * item.quantity }} ₽</p>
              </div>
              <button @click="removeFromCart(item.id)" class="remove-btn">×</button>
            </div>
            <div class="cart-total">
              <strong>Итого: {{ totalPrice }} ₽</strong>
            </div>
            <button @click="clearCart" class="clear-cart-btn">Очистить корзину</button>
            <button @click="pushBuy" class="checkout-btn">Оформить заказ</button>
          </div>
          <p v-else class="empty-cart">Корзина пуста</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.account-wrapper{

  min-height: calc(100vh - 80px);
  box-sizing: border-box;
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.account-header {
  text-align: center;
  margin-bottom: 40px;
}

.account-header h2 {
  color: #f0e4d8;
  font-size: 32px;
  margin-bottom: 15px;
}

.coffee-divider {
  height: 2px;
  width: 100px;
  background-color: #a67c52;
  margin: 0 auto;
}

.account-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

.user-card {
  background-color: #fffdfa;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  height: fit-content;
}

.user-avatar {
  width: 100px;
  height: 100px;
  background-color: #f9f5f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0e6d9;
}

.detail-label {
  color: #8c6a46;
  font-weight: 500;
}

.detail-value {
  color: #5e340d;
  font-weight: 600;
}

.admin-role {
  color: #a67c52;
}

.actions-panel {
  background-color: #fffdfa;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
}

.actions-panel h3 {
  color: #5e340d;
  margin-bottom: 25px;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0e6d9;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background-color: #f9f5f0;
  border-radius: 8px;
  color: #5e340d;
  text-decoration: none;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.action-link:hover {
  background-color: #f0e6d9;
  transform: translateX(5px);
}

.action-link span {
  font-size: 18px;
}

.primary-btn {
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.primary-btn:hover {
  background-color: #8c6a46;
}

.danger-btn {
  background-color: #f9f5f0;
  color: #c45e3d;
  border: 1px solid #c45e3d;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.danger-btn:hover {
  background-color: #ffece6;
}

.exit-btn {
  background-color: #f9f5f0;
  color: #5e340d;
  border: 1px solid #d4c4b2;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.exit-btn:hover {
  background-color: #f0e6d9;
}

.error-message {
  color: #c45e3d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
  }

  .account-header h2 {
    font-size: 26px;
  }

  .user-card,
  .actions-panel {
    padding: 20px;
  }
}

.basket {
  max-height: 60vh; /* Ограничиваем высоту корзины */
  overflow-y: auto; /* Добавляем скролл при необходимости */
  padding-right: 10px; /* Чтобы скролл не перекрывал контент */
  background-color: #fffdfa;
  border-radius: 12px;
}

.basket::-webkit-scrollbar {
  width: 8px;
}

.basket::-webkit-scrollbar-track {
  background: #f9f5f0;
}

.basket::-webkit-scrollbar-thumb {
  background-color: #a67c52;
  border-radius: 4px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0e6d9;
}

.cart-item-info {
  flex-grow: 1;
  min-width: 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #c45e3d;
  font-size: 20px;
  cursor: pointer;
  padding: 0 10px;
}

.cart-total {
  text-align: right;
  padding: 15px 0;
  font-size: 18px;
}

.clear-cart-btn {
  background-color: #f9f5f0;
  color: #c45e3d;
  border: 1px solid #c45e3d;
  border-radius: 4px;
  padding: 8px 12px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.checkout-btn {
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
}

.empty-cart {
  color: #8c6a46;
  text-align: center;
  padding: 20px 0;
}

.cart-item-image {
  width: 90px;
  height: 90px;
  margin-right: 15px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f5f0;
  border-radius: 6px;
  overflow: hidden;
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0e6d9;
}

.coffee-icon {
  font-size: 20px;
  color: #8c6a46;
}
</style>