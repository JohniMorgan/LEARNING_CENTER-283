<template>
    <div class="back">
        <form class="registration-form"
            @submit.prevent = "sendForm">
            <span class="return-btn" @click="$router.push('/')"></span>
            <label style="align-self: center;">Авторизация</label>
            <label class="error-msg" v-if="isErrored">
                {{ errMsg }}
            </label>
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
        },
    },
    methods: {
        changeValues(index, inField) {
            this.info[index].value = inField.value;
            this.valid[index] = inField.valid;
            this.errMsg='';
        },
        sendForm() {
            this.user.userAutorize({
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
        width: 80%;
        height: auto;
    }
    @media (min-width:700px) {
    .registration-form {
        /*При преодолении порога сделать компьютерную версию*/
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