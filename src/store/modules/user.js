import connector from '@/confaxios';
import Router from '@/routes/router';
import { useSecurityStore } from './security';
//import { usePostsStore } from './posts';
import { defineStore } from 'pinia';


export const useUserStore = defineStore('user', {
    state: () => ({
        userId: null,
        username: null,
        useremail: '',
        isAdmin: false,
    }),
    getters: {
        getId: state => {
            return state.userId;
        },
        getName: state => {
            return state.username;
        },
        getEmail: state => {
            return state.useremail;
        },
        isAuthorized: state => state.userId != null,
    },
    actions: {
        setName({ newname }) {
            this.username = newname;
        },
        setEmail({email}) {
            this.useremail = email;
        },
        setId({id}) {
            this.userId = id;
        },
        setData(data) {
            this.userId = data.id;
            this.username = data.surname[0] + ". " + data.name;
            this.useremail = data.email;
            this.isAdmin = data.isAdmin;
        },
    userRegistration(form) {
        return new Promise((resolve, reject) => { 
            let err = {
                is: false,
                message: '',
            }
            const auth = useSecurityStore()
            const token = auth.getToken;
            console.log(token);
            connector
                .post(`users/reg`, {
                    "name": form.first,
                    "surname": form.last,
                    "email": form.email,
                    "passwordHash": form.word
                }, {headers: {
                'Authorization': `${token.type} ${token.accessToken}`}})
                .then(response => {
                    connector.get("/users/getInfo/" + response.data.id, {headers: {
                        'Authorization': `${token.type} ${token.accessToken}`
                    }})
                    .then(response_login => {
                        this.setData(response_login.data)
                        console.log("pushed into main");
                        Router.push('/');
                    })
                })
                .catch(error => {
                    console.log(error.response);
                    err.is = true;
                    if (error.response.status == 400) {
                        err.message = "Пользователь с этим почтовым ящиком уже существует. Пожалуйста попробуйте снова";
                    } else {
                        console.log("registred unknown");
                        err.message = "Сбой связи с сервером, пожалуйста, попробуйте позже";
                    }
                    reject(err);
                });
        })
            
    },
    userAutorize(form) {
        const auth = useSecurityStore();
        let token = auth.getToken;
        return new Promise((resolve, reject) => {
            let err = {
                is: false,
                message: '',
            }
            connector
                .post("/users/login", {
                    "email" : form.email,
                    "password" : form.word
                }, {headers: {
                    'Authorization': `${token.type} ${token.accessToken}`
                }})
                .then(response => {
                    connector.get("/users/getInfo/" + response.data.id, {headers: {
                        'Authorization': `${token.type} ${token.accessToken}`
                    }})
                    .then(response_login => {
                        this.setData(response_login.data)
                        console.log("pushed into main");
                        Router.push('/');
                    })})
                .catch(error => {
                    err.is = true;
                    if (error.response.data.info=="Wrong password") {
                        err.message = "Неверное имя пользователя или пароль"
                    } else {
                        err.message = "Сбой связи с сервером, пожалуйста, попробуйте позже"
                    }
                    reject(err);
                });
        })    
    }
}
})