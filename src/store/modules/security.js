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
                const posts = usePostsStore();
                const user = useUserStore();
                posts.requestHowMany().then( res => {
                    posts.requestPosts({
                        many: (res > 3) ? 3 : posts.howMany,
                        who: user.getId,
                    })
                }
                ).catch(err => console.log(err));
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
