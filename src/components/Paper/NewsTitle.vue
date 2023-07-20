<template>
<article class="news">
    <div class="news-container" :style="overflawStyle">
        <p class="news-text" ref="newstext">
            <img :src="post.img" class="img-container" :style="imgSize"/>
            <span><h3>{{post.title}}</h3></span>
            <span class="text">{{ post.text }}</span>
        </p>
        <div class="toolbar">
            <div v-if="userStore.isAdmin">
                <button class="func-btn link"
                @click="editPost">
                    Редактировать
                </button>
                <button class="func-btn delete"
                @click="openModal">Удалить</button>
            </div>
            <label>{{ DateOut }}</label>
            <button class="func-btn link"
                    v-show="!visibleComm"
                    @click="clickComments">
                    Комментарии({{ howMuchComments }})</button>
            <button class="func-btn link"
                    @click="clickLike"
                    :disabled="isDisabledLike">{{`${likeIcon}(${post.likes})`}}</button>
            <button v-show="isOverflowed" class="func-btn link"
                @click = "ShowMore" >Показать больше</button>

        </div>
    </div>
<CommentsArea v-if="visibleComm" :postId="post.id" :count="howMuchComments" :key="howMuchComments" @new-comment="howMuchComments++"/>
<!--Модальное окно которое вызывается в случае удаления поста-->
<Modal :open="isModal" @close="closeModal">
    <h4>Вы уверены что хотите удалить этот пост?</h4>
    <p>Отменить это действие будет невозможно</p>
    <p><b>{{ post.title }}</b></p>
    <div>
        <button @click="closeModal" class="func-btn link">Отменить</button>
        <button @click="accept" class="func-btn link">Подтвердить</button>
    </div>
</Modal>
</article>
</template>

<script>
import { usePostsStore } from '@/store/modules/posts';
import { useUserStore } from '@/store/modules/user';
import api from "@/confaxios";
import { useSecurityStore } from '@/store/modules/security';
import CommentsArea  from '@/components/Paper/CommentsArea.vue'
import Modal from '@/components/Paper/ModalAskDeletePost.vue';


export default {
    components: {
        CommentsArea,
        Modal
    },
    props: ['post'],
    setup() {
        const userStore = useUserStore();
        const posts = usePostsStore();
        const auth = useSecurityStore();
        return {userStore, posts, auth};
    },
    data() { return {
        isOverflowed: false,
        overflawStyle: "height: 32vh",
        howMuchComments: 0,
        visibleComm: false,
        isModal: false,
        imgSize: "max-height: "
    }
    },
    mounted() {
        api.get(`/comments/howMany/${this.post.id}`,
        {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
        .then(res => {this.howMuchComments = res.data.size}).catch(e => console.log(e));
        this.isOverflowed = this.$refs.newstext.offsetHeight < this.$refs.newstext.scrollHeight;
        this.imgSize += window.innerWidth >= 700 ? this.$refs.newstext.offsetHeight * 0.5 + "px;" : "100%";
    },
    computed: {
        isDisabledLike() {
            return this.userStore.getId == null;
        },
        likeIcon() {
            return this.post.isLiked ? "\u2665" : "\u2661";
        },
        DateOut() {
            let outter = this.post.date;
            if (window.innerWidth >= 700) outter = "Опубликованно " + outter;
            return outter;
        }
    },
    methods: {
        ShowMore() {
            this.isOverflowed = false;
            this.overflawStyle = "height: auto";
        },
        clickLike() {
            console.log('like');
            this.posts.likePost(this.post.id);
            this.$emit('liked', {value: this.post.id});
        },
        clickComments() {
            this.visibleComm = true;
        },
        openModal() {
            console.log('open');
            this.isModal = true;
        },
        closeModal() {
            this.isModal = false;
        },
        accept() {
            this.$emit('delete', {
                value: this.post.id
            });
        },
        editPost() {
            console.log(this.post)
            this.$router.push({name: 'Edit', params: {
                id: this.post.id,
                title: this.post.title,
                text: this.post.text,
                image: this.post.img
            }});
        }
    }
}
</script>

<style>
    .news {
        display:flex;
        flex-direction: column;
    }
    .news-container {
        max-width: 100%;
        flex-direction: column;
        justify-content: space-between;
        display:flex;
    }
    .img-container {
        float:left;
        object-fit:contain;
        object-position: top;
        max-width: 40%;
        /*height:100%;*/
        margin-right: 20px;
        align-self:center;
    }
    .news-text {
        height: 100%;
        overflow: hidden;
        padding: 5px;
        margin-bottom: 0;
        width: 100%;
    }
    @media (min-width: 700px) {
        .news {
            flex-direction: column;
        }
        .img-container {
            margin-right: 30px;
            margin-left: 0;
            width: 40%;
        }
    }
    .toolbar {
        width:100%;
        flex-direction: row;
        display: flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
    }
    @media (min-width: 700px) {
        .toolbar {
            justify-content: flex-end;
        }
    }
    .delete {
        width: auto;
        border: none;
        color: rgb(206, 11, 11);
        background-color: white;
        justify-self: flex-end;
        align-self:flex-end;
    }
    .delete:hover {
        color: rgb(244, 44, 44);
    }
</style>
