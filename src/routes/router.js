import Registration from '../components/Registration.vue'
import Main from '../components/NewsPaper.vue'
import Autorization from '../components/AutorizeForm.vue'
import Edit from "../components/AdminInterface/NewsEditForm.vue"
import TextToLink from '@/components/GPT-Laborathory/TextAreaToLink.vue'
import TextEditor from "@/components/GPT-Laborathory/TextEditorLab.vue"

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
        props: true,
        component: Edit
    },
    {
        path: '/lab/texttolink',
        component: TextToLink
    },
    {
        path: '/lab/texteditor',
        component: TextEditor
    }


];

export default new createRouter({
    history: createWebHistory(),
    routes,
});

