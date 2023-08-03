<template>
    <header class="header">
        <router-link to="/autorization" v-if="!Active" class="func-btn link">Войти</router-link>
        <div v-else>
        <router-link to="/add" v-if="user.isAdmin" class="func-btn link">Добавить статью</router-link>
        <label>{{ userName }}</label>
        <button class="func-btn link"
            @click="leaveSite">Выйти</button>
        </div>
    </header>
</template>

<script>

import { useUserStore } from '@/store/modules/user';

export default {
    name: "HeaderComponent",
    setup() {
        const user = useUserStore();
        return { user };
    },
    computed: {
        userName() {
            return this.user.getName;
        },
        Active() {
            return this.user.username != null;
        }
    },
    methods: {
        leaveSite() {
            this.$router.go(0);
            this.user.$reset();
        }
    },
}
</script>

<style>
    .header {
        display:flex;
        max-width: 100%;
        justify-content: flex-end;
        border-bottom: solid  1px #bbb;
    }
    .header div > * {
        margin-right: 10px;
    }
    .exit-btn {
        border: 0;
        border-radius: 0;
        background-color: white;
        color: #0e5eb3;
    }
</style>