import {computed, reactive, watch, ref} from 'vue'

const state = reactive({
    users: [
        {id: 0, name: "Админ", password: "1234", role: "admin", cart: [],},
        {id: 1, name: "Юзер", password: "1234", role: "client", cart: []},
    ],
})



try{
    if(localStorage.getItem('stateusers')){
        state.users = JSON.parse(localStorage.getItem('stateusers'))
    }
} catch(error){
    state.users = [{id: 0, name: "Админ", password: "1234", role: "admin", cart: []},
        {id: 1, name: "Юзер", password: "1234", role: "client", cart: []}, // Также добавлен в блок catch на случай ошибки
    ]
}
watch(state.users, (newValue) =>{
    localStorage.setItem('stateusers', JSON.stringify(newValue))
},
{deep:true}
)

const users = computed(()=>state.users)

const Iduser = ref(null) // переменная для айди пользователя

if(localStorage.getItem('activeUserId')){   //проверка на существование нужного айди. далее действия в случае его существования
    Iduser.value = Number(localStorage.getItem('activeUserId')) //запись в переменную Iduser существующего айди
}else {
    // Если нет сохраненного пользователя, авторизуем "Юзера" по умолчанию
    Iduser.value = 1
}
watch(Iduser, (newValue) =>{          //штука для отслеживания изменений переменной Iduser
    if(newValue !== null){
        localStorage.setItem('activeUserId', newValue)  //запись в переменную нового значения 
    }else{
        localStorage.removeItem('activeUserId')
    }
})

const currentUser = computed(()=>findUs(Iduser.value))

function addUser(user){
    let usedName = false
    for(let i = 0; i < state.users.length; i++) {
        if(state.users[i].name === user.name) {
            usedName = true
            return 'Это имя уже выбрал другой пользователь. Придумайте другое'
        }
    }
    if(!usedName){
        const newUserId = state.users[state.users.length-1].id + 1
        state.users.push({
            id: newUserId,
            name: user.name,
            password: user.password,
            role: "client"
        })
    }
    }

function logIn(data){  // функция авторизации, передаем в нее объект с именем и паролем
    const logUser = state.users.find((user)=>user.name===data.name)  // записываем в logUser имя из state.users с помощью поиска find 
    if (logUser) { //если значение logUser не равно undifined
        if (logUser.password===data.password) { // и если совпадает пароль
            Iduser.value=logUser.id //присваеваем новое значение для Iduser - это айди из logUser
            return 'Успех' //отправляем сообщение
        } else {
             return 'Неверный пароль' //отправляем сообщение
        }
    } else {
        return 'Пользователя с таким именем не существует' //отправляем сообщение
    }
}

function changeUser(data){
    const userChange = state.users.find((user)=>user.name===data.oldName)
    if (userChange) {
        if (data.name !== "") {
            userChange.name = data.name
            if (Iduser.value === userChange.id) {
                Iduser.value = userChange.id 
            }
        }
        if (userChange.password===data.oldPassword) {
            if(data.newPassword !== ""){
                userChange.password = data.newPassword
                // if(data.oldName === current.user.name){
                //     current.user.password = data.newPassword
                // }
            }
            return 'верно введен старый пароль'
        } else { 
            return 'неверно введен старый пароль'
        }
    } else {
        return 'пользователль не найден'
    }
}

function delUser(userId){
    const delUs = state.users.find((user)=>user.id === userId)
    const delUsId = state.users.indexOf(delUs)
    if(delUsId !== -1){
        if(Iduser.value === userId){
            Iduser.value = null
        }
        state.users.splice(delUsId, 1)
    }
}

function findUs (userId){
    return state.users.find((user)=>user.id == userId)
}

function upgradeUs(UserName){
 const user = state.users.find((user)=>user.name == UserName)
 user.role = "admin"
}

function exitUser() {
   Iduser.value = null // Сбрасываем ID текущего пользователя
  localStorage.removeItem('activeUserId') // Очищаем localStorage
}

function addToCart(product) {
    if (!currentUser.value.cart) currentUser.value.cart = []
    const existingItem = currentUser.value.cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      currentUser.value.cart.push({
        ...product,
        quantity: 1
      })
    }
    saveUsersToStorage()
  }
  
  function removeFromCart(productId) {
    currentUser.value.cart = currentUser.value.cart.filter(item => item.id !== productId)
    saveUsersToStorage()
  }
  
  function clearCart() {
    currentUser.value.cart = []
    saveUsersToStorage()
  }
  
  function saveUsersToStorage() {
    localStorage.setItem('stateusers', JSON.stringify(state.users))
  }

export default function useUsers(){
    return {state, users, currentUser, addUser, delUser, findUs, logIn, Iduser, changeUser, upgradeUs, exitUser, addToCart, removeFromCart, clearCart, exitUser}
}