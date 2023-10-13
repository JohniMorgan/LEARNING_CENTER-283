import api from "@/confaxios";
import { defineStore} from 'pinia';
import { usePostsStore } from "./posts";
import { useUserStore } from "./user";

export const useSecurityStore = defineStore('security', {
    state: () => ({
        type: null,
        accessToken: null,
        refreshToken: null,
    }),
    getters: {
        getToken(state) {
            return {
                type: state.type,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }
        }
    },
    actions: {
        registryToken() {
            api.post('/auth/login', {
                "login": "SviridenkoAdmin",
                "password": "12345", 
              })
              .then(response => {
                this.type = response.data.type;
                this.accessToken = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                api.defaults.headers.common['Authorization'] = `${this.type} ${this.accessToken}`; 
                const postsStore = usePostsStore();
                const userStore = useUserStore();
                postsStore.requestHowMany().then( res => {
                    postsStore.requestPosts({
                        many: (res > 3) ? 3 : postsStore.postsCount,
                        who: userStore.userId,
                    })
                }
                ).catch(err => console.log(err));
                console.log("Токен успешно получен");
                this.refresh();
              })
              .catch(error => {
                console.log(error);
              })
        },
        refresh() {
            setTimeout(function run(context) {
                api.post('auth/token', {
                    'refreshToken': context.refreshToken
                })
                .then(response => {
                    console.log("Токен был успешно обновлён")
                    response.data.refreshToken = context.refreshToken;
                    context.accessToken = response.data.accessToken;
                    context.refreshToken = response.data.refreshToken;
                    api.defaults.headers.common['Authorization'] = `${context.type} ${context.accessToken}`;
                    setTimeout(run, 300000, context);
                })
                .catch(error => console.log(error));
            }, 300000, this);
        }
    }
})
