import api from "@/confaxios";
import { defineStore} from 'pinia';
import { useSecurityStore } from "./security";
import { useUserStore } from "./user";

export const usePostsStore = defineStore('posts', {
    state: () => ({
        posts: [/*
        {
            id: Идентификатор
            title: Название 
            date: Дата выпуска
            likes: количество оценок
            img: ссылка на изображение
            text: Текст статьи
            isLiked: Оценено ли текущим пользователем
        }
        */],
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
                api.get(`/posts/getPosts/${this.next}/${params.many}/${params.who ? params.who : -1}`)
                .then(response => {
                    this.howMany -= params.many;
                    let offset = this.posts.length;
                    for (let i = 0; i < response.data.length - 1; i++) {
                        let p = response.data[i];
                        this.posts.push({
                                id: p.id,
                                date: this.convertDate(p.date),
                                likes: p.likes,
                                title: p.title,
                                img: null,
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
            api.get(`/posts/downloadImage/${imgPath}`)
            .then(response => {
                resolve("data:image/jpg;base64, " + response.data);
    
            }).catch(e => reject(e));
        })
        },
        likePost(id) {
            const user = useUserStore();
            const post = this.getPostById(id); 
            if (!post.isLiked) {
                api.put('/posts/like', {
                    'post_id' : post.id,
                    'user_id' : user.getId,
                })
                .then(/*Лайк проставлен*/)
                .catch(e => console.log(e))
            } else {
                api.put('/posts/unlike', {
                    'post_id' : post.id,
                    'user_id' : user.getId,
                }).then(/*Лайк убран*/).catch(e => console.log(e))
            }
        },
        convertDate(date) {
            let ru_date = `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)} ${Number(date.slice(11, 13)) + 3}${date.slice(13, 16)}`;
            return ru_date;
        },
        requestHowMany() {
            return new Promise((resolve, reject) => {
                api.get('/posts/howMany')
                .then(res => {
                    this.howMany = res.data.size;
                    resolve(res.data.size);
                }).catch(err => console.log(reject(err)));
            })
        },
        requestDelete(id) {
            return new Promise((resolve, reject) => {
                api.delete('/posts/deletePost/' + id)
                .then(() => {
                    resolve("Удаление произошло успешно");
                }).catch(err => {
                    reject({
                        msg: "Что-то пошло не так, попробуйте позже",
                        error: err
                    });
                })
            })
        },
        requestEdit(params) {
            return new Promise((resolve, reject) => {
                api.put("/posts/editPost", {
                    id: params.id,
                    text: params.text,
                })
                .then(() => {
                    resolve("Текст поста успешно заменён");
                }).catch(err => {
                    reject({
                        msg: "Сервер отклонил запрос редактирования",
                        error: err,
                    });
                })
            })
        }
    }    
})

