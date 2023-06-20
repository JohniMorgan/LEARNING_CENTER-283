<template>
<div class="news">
<div class="news-container" :style="overflawStyle">
<p class="news-text" ref="newstext">
<img :src="post.img" class="img-container" :style="imgSize"/>
<span><h3>{{post.title}}</h3>{{ post.text }}</span>
</p>
<div class="toolbar">
    <table>
    <td><label>{{ post.date }}</label></td>
    <td><button class="functional-btn"
            v-show="!visibleComm"
            @click="clickComments">
            Комментарии({{ howMuchComments }})</button></td>
    <td><button class="functional-btn"
            @click="clickLike"
            :disabled="isDisabledLike">{{`${likeIcon}(${post.likes})`}}</button></td>
    <td width="150px"><button v-show="isOverflowed" class="functional-btn"
        @click = "ShowMore" >Показать больше</button></td>
    </table>
</div>
</div>
<CommentsArea v-if="visibleComm" :postId="post.id"/>
</div>
</template>

<script>
import { usePostsStore } from '@/store/modules/posts';
import { useUserStore } from '@/store/modules/user';
import api from "@/confaxios";
import { useSecurityStore } from '@/store/modules/security';
import CommentsArea  from '@/components/CommentsArea.vue'


export default {
    components: {
        CommentsArea
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
        imgSize: "height: ",
        howMuchComments: 0,
        visibleComm: false
    }
    },
    mounted() {
        api.get(`/comments/howMany/${this.post.id}`,
        {headers: {'Authorization' : `${this.auth.getToken.type} ${this.auth.getToken.accessToken}`}})
        .then(res => {this.howMuchComments = res.data.size}).catch(e => console.log(e));
        this.isOverflowed = this.$refs.newstext.offsetHeight < this.$refs.newstext.scrollHeight;
        this.imgSize += this.$refs.newstext.offsetHeight * 0.60 + "px";
    },
    computed: {
        isDisabledLike() {
            return this.userStore.getId == null;
        },
        likeIcon() {
            return this.post.isLiked ? "\u2665" : "\u2661";
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
        margin-right: 50px;
        width:auto;
        aspect-ratio: calc(16/9);
        align-self:flex-start;
    }
    .news-text {
        height: 100%;
        overflow: hidden;
        padding: 5px;
        text-overflow:ellipsis;
        margin-bottom: 0;
    }
    .toolbar {
        flex-direction: row;
        align-self: flex-end;
        display: flex;
        justify-content: flex-end;
    }
    .functional-btn {
        width: auto;
        height: auto;
        border: 0;
        color:#0e5eb3;
        background-color: white;
    }
</style>
