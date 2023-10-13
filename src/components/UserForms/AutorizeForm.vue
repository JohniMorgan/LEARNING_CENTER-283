<template>
    <div class="back">
        <form class="registration-form"
            @submit.prevent = "sendForm">
            <span class="return-btn" @click="$router.push('/')"></span>
            <label style="align-self: center;">Авторизация</label>
            <label class="error-msg" v-if="isErrored">
                {{ errMsg }}
            </label>
            <FormInput v-for="(el, index) in info" :key="el.name"
                :title="el.name"
                :value="el.value"
                :type="el.type"
                @waschanged="changeValues(index, $event)"/>
            <br>
            <button class="btn btn-primary" :disabled="!btnIsActive">
                Войти
            </button>
            <router-link to="/registration" class="link-btn">Ещё нет аккаунта? Зарегистрируйтесь</router-link>
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
        const userStore = useUserStore();
        return { userStore };
    },
    data() {
        return {
            info: [
        {
            name: 'Email',
            value: '',
            type: 'email'
        },
        {
            name: 'Пароль',
            value: '',
            type: 'password'
        }],
            valid: [],
            errMsg: '',
    }
},
    created() {
        this.info.forEach(() => {
            this.valid.push(false);
        })
    },
    computed: {
        btnIsActive() {
            return this.valid.every((validValue) => validValue);
        },
        isErrored() {
            return this.errMsg != '';
        },
    },
    methods: {
        changeValues(index, inField) {
            this.info[index].value = inField.value;
            this.valid[index] = inField.valid;
            this.errMsg='';
        },
        sendForm() {
            this.userStore.userAutorize({
                email: this.info[0].value,
                word: this.info[1].value,
            }).catch(e => {
                this.errMsg = e.message;
                this.info[1].value = '';
                this.valid[1] = false;
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
        /*Общие свойства для контейнера*/ 
        flex-direction: column; /*Компановка элементов*/
        position: absolute; /*Абсолютное расположение */
        top: 50%; /*Здесь и далее сдвиг элемента в середину экрана*/
        left: 50%; 
        margin-right: -50%;
        transform:translate(-50%, -50%);
        display:flex; /*Указание флекс-контейнера */
        background-color: white; /* Цвет фона*/
        border-radius: 5%;
        padding: 1em;
        /*Свойства специфичные для малых устройств*/
        max-width:300px;
        width: 80%;
        height: auto;
    }
    .registration-form > * {
        margin-bottom: 5px;
    }
    @media (min-width:700px) {
    .registration-form {
        /*При преодолении порога сделать компьютерную версию*/
        max-width: none;
        width: 400px;
    }
}
    .btn {
        width: 40%;
        max-width: 130px;
        align-self:flex-end;
    }
    .return-btn {
        width: 25px;
        height: 25px;
        border: none;
        position:relative;
        align-self:flex-end;
        background-color: white;
        background-size: 100%;
        background-image: url("@/assets/krest.svg");
        background-position: center;
        cursor: pointer;
    }
    .error-msg {
        color:red;
        font-size:small;
    }
</style>