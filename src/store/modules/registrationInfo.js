import { defineStore } from 'pinia';

export const useRegInfoStore = defineStore('registration', {
    state: () => ({
        info: [
            {
                name: 'Фамилия',
                value: '',
                pattern: /^[а-яА-Я]{1,30}$/,
                type: 'text'
            },
            {
                name: 'Имя',
                value: '',
                pattern: /^[а-яА-Я]{2,30}$/,
                type: 'text'
            },
            {
                name: 'Email',
                value: '',
                pattern: /.*@.*\..+.*$/,
                type: 'email'
            },
            {
                name: 'Пароль',
                value: '',
                pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                type: 'password'
            },
            {
                name: 'Повторите пароль',
                value: '',
                pattern: /.+/,
                type: 'password'
            }
        ]
    }),
    getters: {
        getInfo: state => {
            return state.info;
        }
    }
})
