<template>
<div class="back">
    <form class="registration-form"
        @submit.prevent = "sendForm">
        <span class="return-btn" @click="$router.push('/')"></span>
        <label style="align-self: center;">Регистрация</label>
        <label class="error-msg" v-if="isErrored">
            {{ errMsg }}</label>
        <form-input v-for="(el, key) in info" :key="key"
            :title="el.name"
            :value="el.value"
            :pattern="el.pattern"
            :type="el.type"
            :help-msg="el.helpMsg"
            @waschanged="changeValues(key, $event)"/>
        <br>
        <button class="btn btn-primary" :disabled="!bttnIsActive">
            Отправить
        </button>
    </form>
</div>
</template>

<script>
import { useUserStore } from "@/store/modules/user";
import FormInput from "./FormInput.vue"

export default {
    name: 'RegistrationForm',
    components: {
        FormInput,
    },
    setup() {
        const user = useUserStore();
        return {user};
    },
    data() {
        return {
            info: [
        {
            name: 'Фамилия',
            value: '',
            pattern: /^[A-Z][a-z]+$/,
            type: 'text',
            helpMsg: 'Фамилия, указанная латинницой'
        },
        {
            name: 'Имя',
            value: '',
            pattern: /^[A-Z][a-z]+$/,
            type: 'text',
            helpMsg: 'Имя, указанное латинницей'
        },
        {
            name: 'Email',
            value: '',
            pattern: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            type: 'email'
        },
        {
            name: 'Пароль',
            value: '',
            pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
            type: 'password',
            helpMsg: 'Пароль должен иметь минимум 8 символов и состоять из цифр, '+
             'заглавных и строчных латинских букв. Пароль не должен содержать спецсимволы или иные знаки.'
        }],
            valid: [],
            errMsg: '',
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
        isErrored() {
            return this.errMsg != '';
        }
    },
    methods: {
        changeValues(index, inField) {
            this.info[index].value = inField.value;
            this.valid[index] = inField.valid;
            if (index == 2) this.errMsg = '';
        },
        sendForm() {
            this.user.userRegistration({
                last: this.info[0].value,
                first: this.info[1].value,
                word: this.info[3].value,
                email: this.info[2].value,
            }).catch(e => {
                console.log(e);
                this.errMsg = e.message;
                this.info[2].value = '';
                this.valid[2] = false;
            });
        },
}
}
</script>

<style>
</style>