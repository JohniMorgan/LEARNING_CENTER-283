<template>
    <section class="comment-area" :key="rerender">
        <div class="comment" v-for="(com, index) in comments" :key="index">
            {{ com.comment }}
            <span style="display: flex; justify-content: space-between; font-weight: 500;">
                <label>{{ com.author }}</label>
                <label>{{ com.date }}</label>
            </span>
        </div>
        <button class="func-btn link" @click="getComments" v-if="cnt">Ещё комментарии</button>
        <div class="comment-edit" v-if="user.isAuthorized">
            <div class="row">
                <textarea class="form-control col" :value="newComment"
                @input="onInput($event.target)"></textarea>
                <button class="send-btn" :disabled="newComment == ''"
                @click="onSendedComment"></button>
            </div>
            <label class="form-label "><span><b>{{ user.getName }}</b></span></label>
        </div>
    </section>
</template>

<script>
import api from "@/confaxios"
import { useSecurityStore } from "@/store/modules/security";
import { useUserStore } from "@/store/modules/user";
import { usePostsStore } from "@/store/modules/posts"

export default {
    props: ['postId', 'count'],
    setup() {
        const user = useUserStore();
        const auth = useSecurityStore();
        const posts = usePostsStore();
        return { user, auth, posts };
    },
    data() { return {
        comments: [],
        cnt: 0,
        offset: 0,
        newComment: '',
        rerender: 0,
    }},
    beforeMount() {
        this.cnt = this.count;
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
                userId: this.user.getId,
                postId: this.postId,
                comment: this.newComment
            }, {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
            .then(() => {
                this.$emit("new-comment");
            }).catch(er => console.log(er));
        },
        getComments() {
            api.get(`comments/getComments/${this.offset}/${this.cnt > 3 ? 3 : this.cnt}/` + this.postId,
            {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
            .then(res => {
                let local_offset = this.comments.length;
                this.cnt -= res.data.length-1;
                this.offset = res.data[res.data.length-1].idForNext
                for (let i = 0; i < res.data.length-1; i++) {
                    this.comments.push({
                            comment: res.data[i].comment,
                            date: this.posts.convertDate(res.data[i].date),
                            author: ''
                        });
                    api.get(`users/getInfo/${res.data[i].user_id}`, {
                        headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}
                    }).then(info => {
                        this.comments[local_offset + i].author = info.data.surname[0] + ". "+ info.data.name 
                    }).catch(er => console.log(er));
                }
            }).catch(e => console.log(e));
            
        }
    }
}
</script>

<style>
    .comment-area {
        width: 50%;
        align-self: center;
    }
    textarea {
        height: 5px;
        resize: none;
        overflow: hidden;
        margin-right: 10px;
    }
    .send-btn {
        width: 40px;
        height: 40px;
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
    }
</style>