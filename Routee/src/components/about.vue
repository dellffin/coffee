<script setup>

</script>
<template>
  <div class="about-wrapper">
    <div class="about-container">
      <!-- Первый блок: фото слева, текст справа -->
      <section class="about-section">
        <div class="about-image">
          <img src="../assets/coffeeBeans.jpg" alt="Наша команда">
        </div>
        <div class="about-text">
          <h2>Наша философия</h2>
          <p>Мы считаем, что хороший кофе - это искусство. Каждая чашка должна быть приготовлена с любовью и вниманием к деталям. Мы работаем только с проверенными поставщиками зерна и обучаем наших бариста лучшим техникам приготовления.</p>
        </div>
      </section>

      <!-- Второй блок: фото справа, текст слева -->
      <section class="about-section reversed">
        <div class="about-text">
          <h2>Наша история</h2>
          <p>Начав с маленькой кофейни в 2010 году, мы выросли в сеть уютных заведений. Наш секрет - в сочетании качественных ингредиентов, мастерства бариста и тёплой атмосферы.</p>
        </div>
        <div class="about-image">
          <img src="../assets/coffeeInCups.jpg" alt="Наша кофейня">
        </div>
      </section>

      <!-- Третий блок: фото слева, текст справа -->
      <section class="about-section">
        <div class="about-image">
          <img src="../assets/coffeInCup.jpg" alt="Отборные зерна">
        </div>
        <div class="about-text">
          <h2>Наши ингредиенты</h2>
          <p>Мы тщательно отбираем только лучшие кофейные зерна с плантаций Южной Америки и Африки. Каждая партия проходит строгий контроль качества.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-wrapper {
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f9f5f0;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 60px;
}

.about-section.reversed {
  flex-direction: row-reverse;
}

.about-image {
  flex: 1;
  min-width: 0;
}

.about-image img {
  width: 350px;
  height: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 52, 13, 0.1);
}

.about-text {
  flex: 1;
  min-width: 0;
}

h2 {
  color: #5e340d;
  font-size: 28px;
  margin-bottom: 20px;
}

p {
  color: #8c6a46;
  line-height: 1.6;
  font-size: 16px;
}

@media (max-width: 768px) {
  .about-section, 
  .about-section.reversed {
    flex-direction: column;
    gap: 20px;
  }
  
  .about-wrapper {
    padding-top: 60px;
  }
}
</style>