<script setup>
import { ref, computed } from 'vue'
import useProducts from '../composables/useProducts.js'
import useUsers from '../composables/useUsers.js'
const products = useProducts().goods
const { addToCart } = useUsers()
const getProductImage = (imageName) => {
  try {
    // Измените путь на /assets/ вместо /src/assets/products/
    return new URL(`../assets/${imageName}`, import.meta.url).href
  } catch (e) {
    console.error('Error loading image:', e)
    return ''
  }
}

const priceRange = ref([0, 5000]) // Диапазон цен по умолчанию
const selectedSort = ref('') // Выбранный сорт
const sortOptions = ref([
  { value: '', label: 'Все сорта' },
  { value: 'Арабика', label: 'Арабика' },
  { value: 'Робуста', label: 'Робуста' },
  { value: 'Бленд', label: 'Бленд' }
])

const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Фильтрация по цене
  result = result.filter(product => 
    product.price >= priceRange.value[0] && 
    product.price <= priceRange.value[1]
  )
  
  // Фильтрация по сорту
  if (selectedSort.value) {
    result = result.filter(product => product.author === selectedSort.value)
  }
  
  return result
})
</script>

<template>
  <div class="products-wrapper">
  <div class="products-container">
    <h2 class="page-title">Наш ассортимент кофе</h2>
    
    <!-- Панель фильтров -->
    <div class="filters-panel">
      <div class="filter-group">
        <label for="price-range">Ценовой диапазон:</label>
        <div class="price-range-display">
          {{ priceRange[0] }} ₽ - {{ priceRange[1] }} ₽
        </div>
        <input 
          id="price-range" 
          type="range" 
          v-model="priceRange[0]" 
          :min="0" 
          :max="5000" 
          step="50"
          class="price-slider"
        >
        <input 
          type="range" 
          v-model="priceRange[1]" 
          :min="0" 
          :max="5000" 
          step="50"
          class="price-slider"
        >
      </div>
      
      <div class="filter-group">
        <label for="coffee-sort">Сорт кофе:</label>
        <select id="coffee-sort" v-model="selectedSort" class="sort-select">
          <option 
            v-for="option in sortOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="products-grid">
      <div v-for="elem in filteredProducts" :key="elem.id" class="product-card">
        <RouterLink :to="{ name: 'profile_product', params: { id: elem.id } }" class="product-link">
          <div class="product-image-placeholder">
            <img 
              v-if="elem.image && getProductImage(elem.image)" 
              :src="getProductImage(elem.image)" 
              :alt="elem.name"
              class="product-image"
            >
            <div v-else class="image-fallback">
              <span class="coffee-icon">☕</span>
              <span class="fallback-text">Нет изображения</span>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ elem.name }}</h3>
            <div class="product-meta">
              <span class="product-price">{{ elem.price }} ₽</span>
              <span class="product-author">Сорт: {{ elem.author }}</span>
            </div>
          </div>
        </RouterLink>
        <button @click.stop="addToCart(elem)" class="add-to-cart-btn">
          Добавить в корзину
        </button>
      </div>
    </div>
    
    <div v-if="filteredProducts.length === 0" class="no-results">
      Товары по выбранным критериям не найдены
    </div>
  </div>
  </div>
</template>

<style scoped>
.products-wrapper {
  padding-top: 80px;
  min-height: calc(100vh - 60px); /* Минимальная высота - высота меню */
  box-sizing: border-box;
  background-color: #f5f0e8; /* Цвет фона, если нужен */
  /* margin-top: 7050px; */
}
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  padding-top: 0;
  /* position: relative;
  z-index: 1; */
}

.page-title {
  color: #a0662c;
  text-align: center;
   margin-top: 0;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
   transition: all 0.3s ease;
}

.filters-panel {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fffdfa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #5e340d;
}

.price-range-display {
  margin-bottom: 10px;
  font-size: 14px;
  color: #8c6a46;
}

.price-slider {
  width: 100%;
  margin-bottom: 5px;
  accent-color: #a67c52;
}

.sort-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d4c4b2;
  border-radius: 6px;
  background-color: #f9f5f0;
  color: #5e340d;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #8c6a46;
  font-size: 18px;
}

.product-card {
  position: relative;
  background-color: #fffdfa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* Занимает всю доступную высоту */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(94, 52, 13, 0.15);
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.product-image-placeholder {
  height: 200px;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.coffee-icon {
  font-size: 60px;
  color: #a67c52;
}

.fallback-text {
  margin-top: 10px;
  color: #8c6a46;
}

.product-info {
  padding: 15px 20px 10px; /* Уменьшен нижний отступ (top right bottom) */
  flex-grow: 1; /* Занимает все доступное пространство */
}

.product-name {
  color: #5e340d;
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
}

.product-meta {
  margin-bottom: 5px; /* Уменьшен отступ между мета-данными и кнопкой */
}

.product-price {
  color: #a67c52;
  font-weight: 700;
  font-size: 18px;
}

.product-author {
  color: #8c6a46;
  font-size: 14px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 15px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .product-image-placeholder {
    height: 160px;
  }

  .add-to-cart-btn {
    width: calc(100% - 20px); /* Меньшие отступы на мобильных */
    margin: 10px;
    padding: 8px;
  }
}

.add-to-cart-btn {
  width: calc(100% - 40px); /* Ширина минус отступы */
  margin: 0 20px 15px; /* Верхний отступ 0, боковые 20px, нижний 15px */
  padding: 8px 12px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center; /* Выравнивание по центру */
}

.add-to-cart-btn:hover {
  background-color: #8c6a46;
}
</style>