import connector from "@/confaxios";
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
            connector.post('/auth/login', {
                "login": "SviridenkoAdmin",
                "password": "12345", 
              })
              .then(response => {
                console.log(response.data);
                this.type = response.data.type;
                this.accessToken = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                const posts = usePostsStore();
                const user = useUserStore();
                posts.requestPosts({
                    from: 0,
                    many: 3,
                    who: user.getId,
                });
                this.refresh();
              })
              .catch(error => {
                console.log(error);
              })
        },
        refresh() {
            setTimeout(function run(context) {
                connector.post('auth/token', {
                    'refreshToken': context.refreshToken
                })
                .then(response => {
                    response.data.refreshToken = context.refreshToken;
                    context.accessToken = response.data.accessToken;
                    context.refreshToken = response.data.refreshToken;
                    setTimeout(run, 300000, context);
                })
                .catch(error => console.log(error));
            }, 300000, this);
        }
    }
})
