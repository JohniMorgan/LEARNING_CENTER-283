<template>
    <div class="back">
        <form class="registration-form"
            @submit.prevent = "sendForm">
            <label style="align-self: center;">Авторизация</label>
            <FormInput v-for="(el, key) in info" :key="key"
                :title="el.name"
                :value="el.value"
                :pattern="el.pattern"
                :type="el.type"
                @waschanged="changeValues(key, $event)"/>
            <br>
            <button class="btn btn-primary" :disabled="!bttnIsActive">
                Войти
            </button>
            <router-link to="/registration">Ещё нет аккаунта? Зарегистрируйтесь</router-link>
        </form>
    </div>
</template>
<script>
import { useUserStore } from "@/store/modules/user";
import FormInput from "./FormInput.vue"

export default {
    name: 'AutorizationForm',
    components: {
        FormInput,
    },
    setup() {
        const user = useUserStore();
        return { user };
    },
    data() {
        return {
            info: [
        {
            name: 'Email',
            value: '',
            pattern: null,
            type: 'email'
        },
        {
            name: 'Пароль',
            value: '',
            pattern: null,
            type: 'password'
        }],
            valid: [],
            sended: false,
    }
},
    created() {
        for (let i in this.info) {
            i;
            this.valid.push(false);
        }
    },
    computed: {
        bttnIsActive() {
            let active = true;
            for (let i = 0; i < this.info.length; i++) {
                active = this.valid[i] && active;
            }
            return active
        },
    },
    methods: {
        changeValues(index, inField) {
            this.info[index].value = inField.value;
            this.valid[index] = inField.valid;
        },
        sendForm() {
            this.user.userAutorize({
                email: this.info[0].value,
                word: this.info[1].value,
            })
        },
    }
}
</script>

<style>
    .back {
        height: 100vh;
        background-color:rgb(133, 121, 121);
    }
    .registration-form {
        width: 400px;
        background-color: white;
        border-radius: 5%;
        padding: 1em;
        display:flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%; 
        margin-right: -50%;
        transform:translate(-50%, -50%);
    }
    .btn {
        width: 130px;
        align-self:flex-end;
    }
</style>