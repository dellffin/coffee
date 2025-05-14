import {createRouter, createWebHistory} from 'vue-router'
import userList from './components/userList.vue'
import registration from './components/registration.vue'
import account from './components/account.vue'
import products from './components/products.vue'
import profile_product from './components/profile_product.vue'
import authorization from './components/authorization.vue'
import addProduct from './components/addProduct.vue'
import changeName from './components/userChanges/changeName.vue'
import changePassword from './components/userChanges/changePassword.vue'
import priceChange from './components/productChanges/priceChange.vue'
import descriptionChange from './components/productChanges/descriptionChange.vue'
import nameChange from './components/productChanges/nameChange.vue'
import buy from './components/buy.vue'
import about from './components/about.vue'

const routes = [
    {path: "/users", component: userList, name: "userList"},
    {path: "/", component: registration, name: "registration"},
    {path: "/user/:id?", component: account, name: "account", children:[
        {path: 'changeName', component: changeName, name: 'changeName'},
        {path: 'changePassword', component: changePassword, name: 'changePassword'},
    ]},
    {path: "/products", component: products, name: "products"},
    {path: "/product/:id?", component: profile_product, name: "profile_product", children:[
        {path: 'priceChange', component: priceChange, name: 'priceChange'},
        {path: 'descriptionChange', component: descriptionChange, name: 'descriptionChange'},
        {path: 'nameChange', component: nameChange, name: 'nameChange'},
    ]},
    {path: "/authorization", component: authorization, name: "authorization"},
    {path: "/addProduct", component: addProduct, name: "addProduct"},
    {path: "/buy", component: buy, name: "buy"},
    {path: "/about", component: about, name: "about"},
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})