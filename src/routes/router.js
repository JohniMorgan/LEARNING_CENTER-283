import Registration from '../components/Registration.vue'
import Main from '../components/NewsPaper.vue'
import Autorization from '../components/AutorizeForm.vue'
import Edit from "../components/NewsEditForm.vue"
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/registration',
        name: 'Registration',
        component: Registration
    },
    {
        path: '/',
        name: 'News',
        component: Main
    },  
    {
        path: '/autorization',
        name: 'Autorization',
        component: Autorization
    },
    {
        path: '/edit',
        name: 'Edit',
        component: Edit
    }

];

export default new createRouter({
    history: createWebHistory(),
    routes,
});

