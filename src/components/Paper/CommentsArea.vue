<template>
    <section class="comment-area">
        <div class="comment" v-for="(com, index) in comments" :key="com.id">
            <button class="func-btn delete"
                v-if="userStore.isAdmin" 
                @click="askDelete(index)">Удалить</button>
            <p>{{ com.comment }}</p>
            <span class="comment-title">
                <label>{{ com.author }}</label>
                <label>{{ com.date }}</label>
            </span>
        </div>
        <delete-modal-window
            :open="deleteID != null"
            @close="closeModal"
            @accept="accept"> Комментарий: <b>{{ comments[deleteID].comment }} </b>
        </delete-modal-window>
        <button class="func-btn link"
            @click="getComments"
            v-if="leftCommentsCount">
            Ещё комментарии
        </button>
        <div class="comment-edit" v-if="userStore.username != null">
            <div class="row">
                <textarea class="form-control col form-area"
                    :value="newComment"
                    @input="onInput($event.target)">
                </textarea>
                <button class="send-btn"
                    :disabled="newComment == ''"
                    @click="onSendedComment">
                </button>
            </div>
            <label class="form-label ">
                <span><b>{{ userStore.username }}</b></span>
            </label>
        </div>
    </section>
</template>

<script>
import api from "@/confaxios"

import { useUserStore } from "@/store/modules/user";
import { usePostsStore } from "@/store/modules/posts"

import { convertDate } from "@/utils/data-utils";

import DeleteModalWindow from "@/components/Paper/ModalAskDeletePost.vue"

export default {
    props: {
        postId: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            default: 0,
        }
    },
    components: {
        DeleteModalWindow,
    },
    setup() {
        const userStore = useUserStore();
        const postsStore = usePostsStore();
        return { userStore, postsStore };
    },
    data() { return {
        comments: [],
        leftCommentsCount: 0,
        offset: 0,
        newComment: '',
        deleteID: null,
    }},
    beforeMount() {
        this.leftCommentsCount = this.count;
        this.getComments();
    },
    methods: {
        onInput(el) {
            if (el.value.length < 1000) {
                this.newComment = el.value;
                el.style.height = "5px";
                el.style.height = (el.scrollHeight) + "px";
            } else el.value = this.newComment;
        },
        onSendedComment() {
            api.post('comments/addComment', {
                userId: this.userStore.userId,
                postId: this.postId,
                comment: this.newComment
            })
            .then(() => {
                this.$emit("new-comment");
            }).catch(er => console.log(er));
        },
        getComments() {
            api.get(`comments/getComments/${this.offset}/${this.leftCommentsCount > 3 ? 3 : this.leftCommentsCount}/` + this.postId)
            .then(res => {
                let local_offset = this.comments.length;
                this.leftCommentsCount -= res.data.length-1;
                this.offset = res.data[res.data.length-1].idForNext
                for (let i = 0; i < res.data.length-1; i++) {
                    this.comments.push({
                            id: res.data[i].id,
                            comment: res.data[i].comment,
                            date: convertDate(res.data[i].date),
                            author: ''
                        });
                    api.get(`users/getInfo/${res.data[i].user_id}`)
                    .then(info => {
                        this.comments[local_offset + i].author = info.data.surname[0] + ". "+ info.data.name 
                    }).catch(er => console.log(er));
                }
            }).catch(e => console.log(e));
        },
        deleteComment(id) {
            api.delete(`comments/deleteComment/${id}`)
            .then(() => this.$emit("delete-comment"))
            .catch(() => console.log("Ошибка в удалении комментария"));
        },
        closeModal() {
            this.deleteID = null;
        },
        accept() {
            this.deleteComment(this.comments[this.deleteID].id);
            this.deleteID = null;
        },
        askDelete(id) {
            this.deleteID = id;
        }
    }
}
</script>

<style>
    .comment-area {
        width: 80%;
        align-self: center;
    }
    @media (min-width: 700px) {
        .comment-area {
            width: 50%;
        }
    }
    .form-area {
        height: 5px;
        resize: none;
        overflow: hidden;
        margin-right: 10px;
    }
    .send-btn {
        width: 2.5em;
        height: 2.5em;
        border: none;
        border-radius: 50%;
        display: flex;
        background-size: 79%;
        background-position: center;
        background-image: url("@/assets/IosSend.svg");
        background-color: #dae6f2;
    }
    .comment {
        display: flex;
        flex-direction: column;
        word-break: break-word;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .comment-title {
        display: flex;
        justify-content: space-between;
        font-weight: 500;
    }
</style>