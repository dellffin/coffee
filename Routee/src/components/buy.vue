<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useUsers from '../composables/useUsers.js'

const router = useRouter()
const { currentUser, clearCart } = useUsers()

// Состояния формы
const deliveryMethod = ref('pickup') // 'pickup' или 'courier'
const paymentMethod = ref('online') // 'online' или 'cash'
const pickupPoint = ref('')
const deliveryAddress = ref('')
const promoCode = ref('')
const deliveryFee = 300 // Стоимость доставки
const showSuccessModal = ref(false)

// Данные карты
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardName = ref('')

// Доступные пункты выдачи (можно заменить на реальные данные)
const pickupPoints = ref([
  'ул. Кофейная, 10',
  'пр. Арабики, 25',
  'ул. Эспрессо, 5',
  'бул. Капучино, 15'
])

// Примененные промокоды (пример)
const validPromoCodes = {
  'COFFEE10': 0.1, // 10% скидка
  'FREE300': 300, // 300 руб скидки
  'ESPRESSO': 0.15 // 15% скидка
}

const discount = ref(0)
const isPromoValid = ref(false)

// Проверка промокода
const checkPromoCode = () => {
  if (validPromoCodes[promoCode.value.toUpperCase()]) {
    isPromoValid.value = true
    discount.value = validPromoCodes[promoCode.value.toUpperCase()]
  } else {
    isPromoValid.value = false
    discount.value = 0
  }
}

// Форматирование номера карты
const formatCardNumber = () => {
  cardNumber.value = cardNumber.value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim()
}

// Расчет итоговой суммы
const totalPrice = computed(() => {
  const subtotal = currentUser.value.cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  )
  
  const deliveryCost = deliveryMethod.value === 'courier' ? deliveryFee : 0
  
  let finalDiscount = 0
  if (isPromoValid.value) {
    if (typeof discount.value === 'number' && discount.value < 1) {
      // Процентная скидка
      finalDiscount = subtotal * discount.value
    } else {
      // Фиксированная скидка
      finalDiscount = Math.min(discount.value, subtotal)
    }
  }
  
  return (subtotal + deliveryCost - finalDiscount).toFixed(2)
})

// Валидация данных карты
const isCardValid = computed(() => {
  return (
    cardNumber.value.replace(/\s/g, '').length === 16 &&
    cardExpiry.value.length === 5 &&
    cardCvc.value.length === 3 &&
    cardName.value.trim().length > 0
  )
})

// Оформление заказа
const placeOrder = async () => {
  if (paymentMethod.value === 'online' && !isCardValid.value) {
    alert('Пожалуйста, заполните все данные карты корректно')
    return
  }

  // Здесь должна быть реальная интеграция с платежной системой
  // Для примера просто имитируем успешную оплату
  const paymentSuccess = await simulatePayment()
  
  if (paymentSuccess) {
    const order = {
      items: [...currentUser.value.cart],
      delivery: {
        method: deliveryMethod.value,
        address: deliveryMethod.value === 'pickup' ? pickupPoint.value : deliveryAddress.value
      },
      payment: paymentMethod.value,
      promoCode: isPromoValid.value ? promoCode.value : null,
      discount: discount.value,
      total: totalPrice.value,
      date: new Date().toISOString()
    }
    
    console.log('Order placed:', order)
    clearCart()
    showSuccessModal.value = true
  } else {
    alert('Ошибка оплаты. Пожалуйста, проверьте данные карты')
  }
}

// Имитация платежа
const simulatePayment = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000)
  })
}

// Переход в личный кабинет
const goToAccount = () => {
  router.push({ name: 'account' })
}
</script>

<template>
  <div class="order-container">
    <h2>Оформление заказа</h2>
    
    <div class="order-section">
      <h3>Способ получения</h3>
      <div class="delivery-options">
        <label>
          <input 
            type="radio" 
            v-model="deliveryMethod" 
            value="pickup"
          >
          Самовывоз (бесплатно)
        </label>
        
        <label>
          <input 
            type="radio" 
            v-model="deliveryMethod" 
            value="courier"
          >
          Доставка курьером (+{{ deliveryFee }} ₽)
        </label>
      </div>
      
      <div v-if="deliveryMethod === 'pickup'" class="pickup-points">
        <h4>Пункт выдачи</h4>
        <select v-model="pickupPoint" required>
          <option value="" disabled>Выберите пункт выдачи</option>
          <option 
            v-for="(point, index) in pickupPoints" 
            :key="index" 
            :value="point"
          >
            {{ point }}
          </option>
        </select>
      </div>
      
      <div v-else class="delivery-address">
        <h4>Адрес доставки</h4>
        <input 
        class="inputAdress"
          type="text" 
          v-model="deliveryAddress" 
          placeholder="Введите адрес доставки" 
          required
        >
      </div>
    </div>
    
    <div class="order-section">
      <h3>Способ оплаты</h3>
      <div class="payment-options">
        <label>
          <input 
            type="radio" 
            v-model="paymentMethod" 
            value="online"
          >
          Онлайн оплата картой
        </label>
        
        <label>
          <input 
            type="radio" 
            v-model="paymentMethod" 
            value="cash"
          >
          Оплата при получении
        </label>
      </div>
    </div>

     <!-- Поля для карты -->
     <div v-if="paymentMethod === 'online'" class="card-details">
        <div class="card-input">
          <label>Номер карты</label>
          <input 
            type="text" 
            v-model="cardNumber" 
            @input="formatCardNumber"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
          >
        </div>
        
        <div class="card-row">
          <div class="card-input">
            <label>Срок действия</label>
            <input 
              type="text" 
              v-model="cardExpiry" 
              placeholder="MM/YY"
              maxlength="5"
            >
          </div>
          
          <div class="card-input">
            <label>CVV/CVC</label>
            <input 
              type="text" 
              v-model="cardCvc" 
              placeholder="000"
              maxlength="3"
            >
          </div>
        </div>
        
        <div class="card-input">
          <label>Имя на карте</label>
          <input 
            type="text" 
            v-model="cardName" 
            placeholder="Имя Фамилия"
          >
        </div>
      </div>
    </div>
    
    <div class="order-section">
      <h3>Промокод</h3>
      <div class="promo-code">
        <input 
          type="text" 
          v-model="promoCode" 
          placeholder="Введите промокод"
          @change="checkPromoCode"
        >
        <button @click="checkPromoCode">Применить</button>
        <span v-if="isPromoValid" class="promo-valid">✓ Промокод применен</span>
        <span v-else-if="promoCode && !isPromoValid" class="promo-invalid">Неверный промокод</span>
      </div>
    </div>
    
    <div class="order-summary">
      <h3>Итого к оплате: {{ totalPrice }} ₽</h3>
      <button 
        @click="placeOrder" 
        class="confirm-btn"
        :disabled="!pickupPoint && deliveryMethod === 'pickup' || !deliveryAddress && deliveryMethod === 'courier'"
      >
        Подтвердить заказ
      </button>
    </div>
  <!-- </div> -->

  <div v-if="showSuccessModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Оплата прошла успешно!</h3>
      <p>Ваш заказ оформлен и будет доставлен в ближайшее время.</p>
      <p>Номер заказа: #{{ Math.floor(Math.random() * 10000) }}</p>
      <button @click="goToAccount" class="modal-btn">
        Перейти в личный кабинет
      </button>
    </div>
  </div>
</template>

<style scoped>
.order-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  background-color: #fffdfa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
  /* position: relative; */
}

.card-details {
  margin-top: 15px;
  padding: 20px;
  background-color: #f9f5f0; /* Слегка отличающийся фон для выделения */
  border-radius: 8px;
  border: 1px solid #e0d6c9;
}

.card-input {
  margin-bottom: 15px;
  width: 100%;
}

.card-input label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #5e340d;
}

.card-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d4c4b2;
  border-radius: 6px;
  background-color: white;
}

/* Стили для номер карты с пробелами */
input[data-card-number] {
  letter-spacing: 1px;
}

.card-row {
  display: flex;
  gap: 15px;
  width: 100%;
}

.card-row .card-input {
  flex: 1;
  min-width: 0; /* Фикс для переполнения в flex-контейнере */
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #4caf50;
  margin-bottom: 15px;
}

.modal-content p {
  margin-bottom: 10px;
  color: #5e340d;
}

.modal-btn {
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-btn:hover {
  background-color: #8c6a46;
}

.order-section {
  margin-bottom: 25px;
  padding: 20px;
  background-color: #fffdfa; /* Дублируем фон для надежности */
  border-radius: 8px;
  border: 1px solid #f0e6d9; /* Легкая граница для разделения */
}

h2, h3, h4 {
  color: #5e340d;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

h3 {
  margin-bottom: 15px;
}

/* Поле адреса доставки */
.delivery-address {
  width: 100%;
  margin-top: 10px;
}

.delivery-address input {
  width: 100%;
}

.delivery-options, .payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

input[type="radio"] {
  accent-color: #a67c52;
}


input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d4c4b2;
  border-radius: 6px;
  background-color: #f9f5f0;
  box-sizing: border-box; /* Важно - учитывает padding в ширине */
  font-size: 14px;
}

.pickup-points select, 
.delivery-address input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d4c4b2;
  border-radius: 6px;
  background-color: #f9f5f0;
}

.promo-code {
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: transparent; /* Убираем фон, так как есть у родителя */
  padding: 0; /* Убираем лишние отступы */
}

.promo-code input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #d4c4b2;
  border-radius: 6px;
}

.promo-code button {
  padding: 10px 15px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.promo-valid {
  color: #4caf50;
}

.promo-invalid {
  color: #f44336;
}

.order-summary {
  background-color: #fffdfa; /* Соответствует фону формы */
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  border: 1px solid #f0e6d9; /* Граница как у других секций */
  width: 100%; /* Занимает всю ширину родителя */
  box-sizing: border-box; /* Учитывает padding в общей ширине */
}

.order-summary h3 {
  margin-bottom: 15px;
  color: #5e340d;
}

.confirm-btn {
  width: 100%; /* Кнопка на всю ширину блока */
  padding: 12px;
  background-color: #a67c52;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #8c6a46;
}

.confirm-btn:disabled {
  background-color: #d4c4b2;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .order-container {
    padding: 15px;
  }
  
  .order-section {
    padding: 15px;
  }
  
  .promo-code {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .promo-code button {
    width: 100%;
  }
}
</style>