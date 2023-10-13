import api from "@/confaxios";
import { defineStore} from 'pinia';
import { useUserStore } from "./user";
import { convertDate } from "@/utils/data-utils";

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
        postsCount: 0,
        next: 0,
    }),
    getters: {
        getPostById: state => id => state.posts.find((el) => {return el.id == id}),
    },
    actions: {
        requestPosts(params) {
            return new Promise((resolve, reject) => {
            if (this.next != null) {
                api.get(`/posts/getPosts/${this.next}/${params.many}/${params.who ? params.who : -1}`)
                .then(response => {
                    this.postsCount -= params.many;
                    let offset = this.posts.length;
                    for (let i = 0; i < response.data.length - 1; i++) {
                        let p = response.data[i];
                        this.posts.push({
                                id: p.id,
                                date: convertDate(p.date),
                                likes: p.likes,
                                title: p.title,
                                img: null,
                                text: p.text,
                                isLiked: p.isLiked
                            });
                        if (p.pathToPhoto)
                            this.getImage(p.pathToPhoto).then(photo => {
                                this.posts[offset + i].img = photo
                            }).catch(e => {console.log(e.error);
                                console.log(e.msg);    
                            });
                    }
                    this.next = response.data[response.data.length - 1].idForNext;
                    resolve();
                })
                .catch(e => reject(e));
            }
        })
        },
        getImage(imgPath) {
            return new Promise((resolve, reject) => {
            api.get(`/posts/downloadImage/${imgPath}`)
            .then(response => {
                resolve("data:image/jpg;base64, " + response.data);
    
            }).catch(e => reject({
                msg: "Не удалось получить фотографию",
                error: e,
            }));
        })
        },
        likePost(id) {
            const userStore = useUserStore();
            const post = this.getPostById(id);
            return new Promise((resolve, reject) => { 
                if (!post.isLiked) {
                    api.put('/posts/like', {
                        'post_id' : post.id,
                        'user_id' : userStore.userId,
                    })
                    .then(resolve("Лайк успешно поставлен"))
                    .catch(e => reject({
                        msg: "Не удалось поставить лайк пользователя",
                        error: e
                    }))
                } else {
                    api.put('/posts/unlike', {
                        'post_id' : post.id,
                        'user_id' : userStore.userId,
                    }).then(resolve("Лайк успешно убран")).catch(e => reject({
                        msg: "Не удалось убрать лайк пользователя",
                        error: e
                    }));
                }
            })
        },
        requestHowMany() {
            return new Promise((resolve, reject) => {
                api.get('/posts/howMany')
                .then(res => {
                    this.postsCount = res.data.size;
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

