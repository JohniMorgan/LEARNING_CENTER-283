<template>
    <div class="comment-area">
        <div class="comment" v-for="(com, index) in comments" :key="index">
            <div style="display: flex; justify-content: space-between; font-weight: 500;">
                <label>{{ com.author }}</label>
                <label>{{ com.date }}</label>
            </div>
            {{ com.comment }}
        </div>
        <div class="comment-edit" v-if="user.isAuthorized">
            <label class="form-label "><span><h6>{{ user.getName }}</h6></span></label>
            <div class="row">
            <textarea class="form-control col" :value="newComment"
            @input="onInput($event.target)"></textarea>
            <button class="send-btn" :disabled="newComment == ''"
            @click="onSendedComment"></button>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/confaxios"
import { useSecurityStore } from "@/store/modules/security";
import { useUserStore } from "@/store/modules/user";
import { usePostsStore } from "@/store/modules/posts"

export default {
    props: ['postId'],
    setup() {
        const user = useUserStore();
        const auth = useSecurityStore();
        const posts = usePostsStore();
        return { user, auth, posts };
    },
    data() { return {
        comments: [],
        cnt: 0,
        newComment: '',
    }},
    beforeMount() {
        this.getComments();
    },
    methods: {
        onInput(el) {
            if (el.value.length < 255) {
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
            .then(res => {
                this.newComment = '';
                this.comments = [];
                this.getComments();
                console.log(res);
            }).catch(er => console.log(er));
        },
        getComments() {
            api.get('comments/getComments/0/3/' + this.postId,
            {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
            .then(res => {
                console.log(res.data)
                for (let i = 0; i < res.data.length-1; i++) {
                    this.comments.push({
                            comment: res.data[i].comment,
                            date: this.posts.convertDate(res.data[i].date),
                            author: ''
                        });
                    api.get(`users/getInfo/${res.data[i].user_id}`, {
                        headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}
                    }).then(info => {
                        this.comments[i].author = info.data.name + " "+ info.data.surname[0] + "."
                    }).catch(er => console.log(er));
                }
            }).catch(e => console.log(e.response));
            
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
        word-break: break-all;
    }
</style>