<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'
import useUsers from '../composables/useUsers.js'
import useProducts from '../composables/useProducts.js'

const route = useRoute()
const router = useRouter()
const current = useUsers()
const author = computed(() => current.currentUser.value.name)
const localProduct = useProducts().findPr(Number(route.params.id))
const { addToCart } = useUsers()

const getProductImage = (imageName) => {
  try {
    return new URL(`../assets/${imageName}`, import.meta.url).href
  } catch (e) {
    console.error('Error loading image:', e)
    return ''
  }
}

function delProduct() {
  useProducts().delProduct(localProduct.id)
  router.push({ name: "products" })
}

</script>
<template>
  <div class="product-container">
    <div class="product-header">
      <h2>Карточка товара</h2>
      <div class="coffee-divider"></div>
    </div>

    <div class="product-content">
      <div class="product-card">
        <div class="product-image-placeholder">
          <!-- Отображаем изображение если оно есть, иначе fallback -->
          <img 
            v-if="localProduct.image && getProductImage(localProduct.image)" 
            :src="getProductImage(localProduct.image)" 
            :alt="localProduct.name"
            class="product-image"
          >
          <div v-else class="image-fallback">
            <span class="coffee-icon">☕</span>
          </div>
        </div>

        <div class="product-details">
          <div class="detail-row">
            <span class="detail-label">Название:</span>
            <span class="detail-value">{{ localProduct.name }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Описание:</span>
            <p class="detail-description">{{ localProduct.description }}</p>
          </div>

          <div class="detail-row">
            <span class="detail-label">Цена:</span>
            <span class="detail-price">{{ localProduct.price }} ₽</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Сорт:</span>
            <span class="detail-value">{{ localProduct.author }}</span>
          </div>

          <button @click="addToCart(localProduct)" class="add-to-cart-btn">
            Добавить в корзину
          </button>

          <button v-if="author == localProduct.author" @click="delProduct" class="danger-btn">
            Удалить товар
          </button>
        </div>
      </div>

      <div v-if="author == localProduct.author" class="product-actions">
        <h3>Управление товаром</h3>

        <RouterLink :to="{ name: 'nameChange' }" class="action-link">
          <span>✏️</span> Изменить название
        </RouterLink>

        <RouterLink :to="{ name: 'descriptionChange' }" class="action-link">
          <span>📝</span> Изменить описание
        </RouterLink>

        <RouterLink :to="{ name: 'priceChange' }" class="action-link">
          <span>💰</span> Изменить цену
        </RouterLink>

        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-container {
  max-width: 1200px;
  margin: 0 auto 50px;
  padding: 0 20px;
}

.product-header {
  text-align: center;
  margin-bottom: 40px;
}

.product-header h2 {
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

.product-content {
  gap: 30px;
  display: flex;           /* Добавляем flex контейнер */
  flex-direction: column;  /*  Располагаем элементы в колонку*/
  align-items: center; 
}

.product-card {
  background-color: #fffdfa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  max-width: 600px; /* Пример: задаем максимальную ширину */
  margin: 0 auto; 
}

.product-image-placeholder {
  height: 300px;
  background-color: #f9f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.coffee-icon {
  font-size: 80px;
  color: #a67c52;
}

.product-details {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  color: #8c6a46;
  font-weight: 500;
  font-size: 14px;
}

.detail-value {
  color: #5e340d;
  font-weight: 600;
  font-size: 16px;
}

.detail-description {
  color: #5e340d;
  margin: 0;
  line-height: 1.5;
}

.detail-price {
  color: #a67c52;
  font-weight: 700;
  font-size: 20px;
}

.product-actions {
  background-color: #fffdfa;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  height: fit-content;
  margin-top: 20px;
}

.product-actions h3 {
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

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }

  .product-header h2 {
    font-size: 26px;
  }

  .product-card,
  .product-actions {
    padding: 20px;
  }

  .product-image-placeholder {
    height: 200px;
  }
}

.add-to-cart-btn {
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  width: 100%;
}
</style>