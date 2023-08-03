<template>
<article class="news" ref="news">
    <div class="news-container" :style="overflawStyle">
        <p class="news-text" :class="truncatedClass" ref="newstext">
            <img :src="post.img" class="img-container"/>
            <span><h1>{{post.title}}</h1></span>
            <span class="text" ref="text">{{ post.text }}</span>
        </p>
        <div class="toolbar">
            <label>{{ DateOut }}</label>
            <button class="func-btn link"
                    v-show="!visibleComm"
                    @click="clickComments"
                    :disabled="previevMod">
                    <span :class="littleComent">Комментарии</span>{{ ` (${howMuchComments})` }}</button>
            <button class="func-btn link"
                    @click="clickLike"
                    :disabled="isDisabledLike || previevMod"><span :class="likeIcon"></span>{{` (${post.likes})`}}</button>
            <button v-show="isOverflowed" class="func-btn link"
                @click = "ShowMore" >Показать больше</button>
            <div v-if="userStore.isAdmin && !previevMod">
                <button class="func-btn link"
                @click="editPost">
                    Редактировать
                </button>
                <button class="func-btn delete"
                @click="openModal">Удалить</button>
            </div>
        </div>
    </div>
<CommentsArea v-if="visibleComm" :postId="post.id" 
:count="howMuchComments"
 :key="howMuchComments" @new-comment="howMuchComments++"
 @delete-comment="howMuchComments--"/>
<!--Модальное окно которое вызывается в случае удаления поста-->
<Modal :open="isModal" @close="closeModal" @accept="accept">
    Пост: <b>{{ post.title }}</b>
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
        overflawStyle: "height: 32vh",
        howMuchComments: 0,
        visibleComm: false,
        isModal: false,
        isOverflowed: false,
        previevMod: false
    }
    },
    mounted() {
        if (this.post.previev != undefined) this.previevMod = this.post.previev;
        if (!this.previevMod) {api.get(`/comments/howMany/${this.post.id}`,
            {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
            .then(res => {this.howMuchComments = res.data.size}).catch(e => console.log(e));
        }
        this.isOverflowed = this.$refs.newstext.offsetHeight < this.$refs.newstext.scrollHeight;
    },

    computed: {
        isDisabledLike() {
            return this.userStore.getId == null;
        },
        likeIcon() {
            return this.post.isLiked ? "like" : "no-like";
        },
        DateOut() {
            let outter = this.post.date;
            if (window.innerWidth >= 700) outter = "Опубликованно " + outter;
            return outter;
        },
        littleComent() {
            return window.innerWidth >= 700 ? "" : "comment-icon";
        },
        truncatedClass() {
            return this.isOverflowed ? "truncated" : "";
        },
        havePost() {
            return this.$refs.newstext.offsetHeight + " " + this.$refs.newstext.scrollHeight;
        },
        needOverflaw() {
            return this.$refs.newstext.offsetHeight < this.$refs.newstext.scrollHeight;
        }
    },
    methods: {
        ShowMore() {
            this.isOverflowed = false;
            this.overflawStyle = "height: auto";
        },
        clickLike() {
            this.posts.likePost(this.post.id);
            this.$emit('liked', {value: this.post.id});
        },
        clickComments() {
            this.visibleComm = true;
        },
        openModal() {
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

<style scoped>

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
        min-height: 50%;
        width: 40%;
        margin-right: 20px;
        max-height: 20vh;
        align-self:center;
    }
    .news-text {
        height: 100%;
        overflow: hidden;
        margin-bottom: 0;
        width: 100%;
        background: #fff;
        position: relative;
    }
    .truncated .text:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 30px;
        background: linear-gradient(180deg, transparent, #fff 50%);
    }
    @media (min-width: 700px) {
        .news {
            flex-direction: column;
        }
        .img-container {
            min-height: 50%;
            max-height: 15vh;
            margin-right: 30px;
            margin-left: 0;
            width: 35%;
        }
    }
    .toolbar {
        width:100%;
        flex-direction: row;
        display: flex;
        justify-content:flex-start;
        align-items:center;
        flex-wrap:wrap;
        padding-left: 5px;
    }
    .toolbar > * {
        margin-right: 10px;
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
    .like {
        content: url("@/assets/like_heart_fill.svg");
    }
    .no-like {
        content: url("@/assets/like_heart.svg");
    }
    .comment-icon {
        content: url("@/assets/comments.svg");
    }
</style>
