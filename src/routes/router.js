import Registration from '@/components/UserForms/Registration.vue'
import Main from '@/components/Paper/NewsPaper.vue'
import Autorization from '@/components/UserForms/AutorizeForm.vue'
import Add from "@/components/AdminInterface/NewsAddForm.vue"
import Edit from "@/components/AdminInterface/NewsEditForm.vue"
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
        path: '/add',
        name: 'Add',
        component: Add
    },
    {
        path: '/edit',
        name: "Edit",
        component: Edit,
        props: true,
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

