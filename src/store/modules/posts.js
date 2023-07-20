import connector from "@/confaxios";
import { defineStore} from 'pinia';
import { useSecurityStore } from "./security";
import { useUserStore } from "./user";

export const usePostsStore = defineStore('posts', {
    state: () => ({
        posts: [],
        howMany: 0,
        next: 0,
    }),
    getters: {
        getAllPosts: state => {

            return state.posts;
        },
        getPostByIndex: state => index => state.posts[index],
        getPostById: state => id => state.posts.find((el) => {return el.id == id}),
    
    },
    actions: {
        requestPosts(params) {
            if (this.next != null) {
                const auth = useSecurityStore();
                const token = auth.getToken;
                connector.get(`/posts/getPosts/${this.next}/${params.many}/${params.who ? params.who : -1}`, {
                    headers: {'Authorization': `${token.type} ${token.accessToken}`},
                }).then(response => {
                    this.howMany -= params.many;
                    console.log(response);
                    let offset = this.posts.length;
                    for (let i = 0; i < response.data.length - 1; i++) {
                        let p = response.data[i];
                        this.posts.push({
                                id: p.id,
                                date: this.convertDate(p.date),
                                likes: p.likes,
                                title: p.title,
                                img: '',
                                text: p.text,
                                isLiked: p.isLiked
                            });
                        if (p.pathToPhoto)
                        this.getImage(p.pathToPhoto).then(photo => {
                            this.posts[offset + i].img = photo
                        }).catch(e => {console.log(e);
                            console.log("Неудачный запрос постов");    
                        });
                    }
                    this.next = response.data[response.data.length - 1].idForNext;
                })
                .catch(e => console.log(e));
        }
        },
        getImage(imgPath) {
            return new Promise((resolve, reject) => {
            const auth = useSecurityStore();
            const token = auth.getToken;
            connector.get(`/posts/downloadImage/${imgPath}`,
            {headers: {'Authorization': `${token.type} ${token.accessToken}`}
            })
            .then(response => {
                resolve("data:image/jpg;base64, " + response.data);
    
            }).catch(e => reject(e));
        })
        },
        likePost(id) {
            const user = useUserStore();
            const auth = useSecurityStore();
            const post = this.getPostById(id); 
            if (!post.isLiked) {
                connector.put('/posts/like', {
                    'post_id' : post.id,
                    'user_id' : user.getId,
                }, {
                    headers : {'Authorization' : `${auth.getToken.type} ${auth.getToken.accessToken}`} 
                }).then(res => console.log(res)).catch(e => console.log(e))
            } else {
                connector.put('/posts/unlike', {
                    'post_id' : post.id,
                    'user_id' : user.getId,
                }, {
                    headers : {'Authorization' : `${auth.getToken.type} ${auth.getToken.accessToken}`} 
                }).then(res => console.log(res)).catch(e => console.log(e))
            }
        },
        convertDate(date) {
            let ru_date = `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)} ${Number(date.slice(11, 13)) + 3}${date.slice(13, 16)}`;
            return ru_date;
        },
        requestHowMany() {
            return new Promise((resolve, reject) => {
                const auth = useSecurityStore();
                connector.get('/posts/howMany', {
                    headers : {'Authorization' : `${auth.getToken.type} ${auth.getToken.accessToken}`} 
                }).then(res => {
                    this.howMany = res.data.size;
                    resolve(res.data.size);
                }).catch(err => console.log(reject(err)));
            })
        },
        requestDelete(id) {
            return new Promise((resolve, reject) => {
                const auth = useSecurityStore();
                console.log('request delete ' + id);
                connector.delete('/posts/deletePost/' + id, {
                    headers : {'Authorization' : `${auth.getToken.type} ${auth.getToken.accessToken}`}
                }).then(() => {
                    resolve("Удаление произошло успешно");
                }).catch(err => {
                    reject({
                        msg: "Что-то пошло не так, попробуйте позже",
                        error: err
                    });
                })
            })
        }
    }    
})

