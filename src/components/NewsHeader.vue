<template>
    <div class="header">
        <router-link to="/autorization" v-if="!Active">Войти</router-link>
        <div v-else>
        <router-link to="/edit" v-if="user.isAdmin">Добавить статью</router-link>
        <label>{{ userName }}</label>
        <button class="exit-btn"
            @click="leaveSite">Выйти</button>
        </div>
    </div>
    <hr>
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
            this.user.username = null;
            this.user.userId = null;
            this.user.useremail = '';
            this.$router.go(0);
        }
    },
}
</script>

<style>
    .header {
        display:flex;
        max-width: 100%;
        justify-content: flex-end;
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