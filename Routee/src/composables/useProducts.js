import {computed, reactive, watch, ref} from 'vue'

const products = reactive({
    goods: [
        {id: 0, name: "DARK MEDIUM", description: "Крепкий кофе с насыщенным вкусом и средней степенью обжарки. Идеален для любителей сбалансированного вкуса с легкой горчинкой и плотным телом.", price: 1200, author: "Арабика", image: "first.jpg"},
        {id: 1, name: "PARETTO CELESTO", description: "Элегантный и мягкий кофе с нежным вкусом и легкой сладостью. 100% арабика с чистыми нотами карамели и молочного шоколада.", price: 1500, author: "Арабика", image: "second.jpg"},
        {id: 2, name: "LAVATIA", description: "Изысканный итальянский кофе с нотами мускатного ореха и ореховой пасты. Благородный вкус с долгим сладковатым послевкусием.", price: 3000, author: "Арабика", image: "third.jpg"},
        {id: 3, name: "Pull! SOMETHING BLEND", description: "Спешелти-смесь с фруктовыми и цветочными нотами. Умеренная кислотность и сложный букет, подходит для альтернативных способов заваривания.", price: 1800, author: "Арабика", image: "fours.jpg"},
        {id: 4, name: "CafeRat ESPREXO ITALIANO", description: "Итальянская классика с ярким ароматом и богатым вкусом. 100% арабика с бархатистой крема и долгим послевкусием.", price: 2000, author: "Арабика", image: "fives.jpg"},
        {id: 5, name: "SECOND CUP COFFEE", description: "Свежеобжаренный зерновой кофе с классическим вкусом. Универсальный вариант для фильтр-кофе или френч-пресса.", price: 1400, author: "Бленд", image: "sixs.webp"},
        {id: 6, name: "Nero NOBILE", description: "Премиальный итальянский бленд с интенсивным вкусом и густой консистенцией. Идеален для эспрессо с нотами темного шоколада и специй.", price: 2500, author: "Бленд", image: "sevens.webp"},
        {id: 7, name: "Bluebeard Coffee Roasters", description: "Крафтовый кофе, обжаренный в Такоме (США). Вкус: шоколад, ягоды, цитрус, специи.", price: 1500, author: "Робуста", image: "eights.webp"},
        {id: 8, name: "Reza Forte", description: "Густой, плотный вкус с пикантными сложными нотами и приятной легкой горчинкой насыщенный аромат, хорошо выраженная крепость и красивая стойкая пенка.", price: 1500, author: "Робуста", image: "nines.jpg"},
        {id: 9, name: "BiGi Coffee", description: "Biji Coffee — молодая российская компания обжарщиков кофе, экспертов по спешиалти кофейным зернам, которые выращиваются в высокогорных районах и отбираются вручную. ", price: 1600, author: "Арабика", image: "tens.jpg"},
        {id: 10, name: "Жокей", description: "Уникальный бленд сортов арабики из Бразилии, Эфиопии и Индии. Жокей По-восточному обладает насыщенным выраженным вкусом с пряно-перечной нотой, легким мускатным послевкусием и шоколадным оттенком в аромате.", price: 600, author: "Арабика", image: "elevens.webp"},
        {id: 11, name: "NESCAFÉ CLASSIC", description: "Классический растворимый кофе с узнаваемым вкусом. Подходит для быстрого приготовления.", price: 500, author: "Арабика", image: "twelfs.webp"},
        {id: 12, name: "LANE", description: "Market Lane Coffee — это розничная компания по обжарке и розничной торговле спешиэлти кофе, занимающаяся поиском, обжаркой и распространением исключительного кофе устойчивым, уважительным и ответственным образом. ", price: 1300, author: "Робуста", image: "theertins.webp"},
        {id: 13, name: "La Habana Cafecito Cubano", description: "Традиционный кубинский кофе с насыщенным вкусом и сладковатыми нотами.", price: 700, author: "Бленд", image: "fourtins.jpg"},
        {id: 14, name: "Vivet Espresso Black", description: "Эспрессо с ярким вкусом и ароматом. Подходит для любителей насыщенного кофе.", price: 800, author: "Робуста", image: "fiveteens.jpg"},
        {id: 15, name: "Colombia Streetto Dark", description: "Тёмная обжарка с глубоким вкусом, подходит для эспрессо.", price: 900, author: "Бленд", image: "sixteens.webp"},
        {id: 16, name: "Staric Hacienda Sonora", description: "Кофе с плантации Hacienda Sonora, с фруктовыми нотами.", price: 1200, author: "Арабика", image: "seventeens.png"},
        {id: 17, name: "Coffee Drink", description: "Упор на вкус без кофеина. Подходит для тех, кто избегает кофеин.", price: 600, author: "Арабика", image: "eighteens.jpg"},
        {id: 18, name: "Costa Coffee", description: "Популярный бренд кофе с балансом вкуса и доступностью.", price: 400, author: "Арабика", image: "nineteens.jpeg"},
        {id: 19, name: "Roastopus", description: "Главным персонажем стал осьминог – специалист обжаривания и приготовления кофе. Фантазийное название кофейни Roastopus произошло от слияния двух слов «roast» (обжаривать) и «octopus» (осьминог).", price: 5000, author: "Робуста", image: "twenty.webp"},
    ]
})

try{
    if(localStorage.getItem('products.goods')){
        products.goods = JSON.parse(localStorage.getItem('products.goods'))
    }
} catch(error){
    products.goods = []
}
watch(products.goods, (newValue) =>{
    localStorage.setItem('products.goods', JSON.stringify(newValue))
},
{deep:true}
)

const goods = computed(()=>products.goods)

function addProduct(data){
  let usedProduct = false
  for(let i = 0; i < products.goods.length; i++){
      if(products.goods[i].name === data.name){
          usedProduct = true
          alert("Это имя товара уже есть на странице. Придумайте другое")
          break
      }
  }
  if(!usedProduct){
      const newProductId = products.goods[products.goods.length-1].id + 1
      products.goods.push({
          id: newProductId,
          name: data.name,
          description: data.description,
          price: data.price,
          author: data.author,
      })
  }
}

function changeAuthor(data){
  const authorChange = products.goods.find((user)=>user.author===data.oldName)
  if(authorChange){
    if(data.name !== ""){
      authorChange.author = data.name
    }
  }
}

function changeProducts(data){
  const productChange = products.goods.find((product)=>product.name===data.oldName)
  if (productChange) {
      if (data.newName !== "") {
        productChange.name = data.newName
      }
      if (data.newDescription !== "") {
        productChange.description = data.newDescription
      }
      if (data.newPrice !== null) {
        productChange.price = data.newPrice
      }
  } else {
      return 'товар не найден'
  }
}

function delProduct(productId){
  const delPr = products.goods.find((product)=>product.id === productId)
  while(delPr){
    const delPrId = products.goods.indexOf(delPr)
    products.goods.splice(delPrId, 1)
  }
}

function delUser(name){
  products.goods = products.goods.filter((user)=>user.author !== name)
}

function findPr (productId){
  return products.goods.find((product)=>product.id == productId)
}

export default function useProducts(){
  return { products, goods, addProduct, delProduct, findPr, changeProducts, changeAuthor, delUser}
}