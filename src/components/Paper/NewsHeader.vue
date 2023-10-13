<template>
    <header class="header">
        <router-link to="/autorization"
            v-if="!isActive"
            class="func-btn link">Войти</router-link>
        <div v-else>
            <router-link to="/add"
                v-if="userStore.isAdmin"
                class="func-btn link">Добавить статью</router-link>
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
        const userStore = useUserStore();
        return { userStore };
    },
    computed: {
        userName() {
            return this.userStore.username;
        },
        isActive() {
            return this.userStore.username != null;
        }
    },
    methods: {
        leaveSite() {
            this.$router.go(0);
            this.userStore.$reset();
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