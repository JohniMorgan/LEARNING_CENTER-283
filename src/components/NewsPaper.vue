<template @scroll="console.log('scroll')">
<header><NewsHeader/></header>
<div class="paper" @scroll="console.log('Скроллинг')">
    <NewsTitle v-for="(post, index) in allPosts" :key="index"
        :post="post"
        @liked="likePost"
    />
</div>
</template>

<script>
import NewsTitle from "./NewsTitle.vue";
import NewsHeader from './NewsHeader.vue';
import { useUserStore } from "@/store/modules/user";
import { usePostsStore } from "@/store/modules/posts";


export default {
    components: {
        NewsTitle,
        NewsHeader,
    },
    setup() {
        const user = useUserStore();
        const posts = usePostsStore();
        return {user: user,posts: posts};
    },
    computed: {
        allPosts() {
            return this.posts.posts;
        }
    },
    methods: {
        pushPost(post) {
        this.posts.posts.push(new Object({
            id: post.id,
            isLiked: post.isLiked,
            likes: post.likes,
            title: post.title,
            text: post.text,
            img: post.img,
            postDate: post.date
        }))
        },
        likePost(event) {
            let key = this.posts.posts.findIndex((el) => {return el.id == event.value})    
            this.posts.posts[key].isLiked = !this.posts.posts[key].isLiked;
            this.posts.posts[key].likes += (this.posts.posts[key].isLiked ? 1 : -1); 
        },
        handleScroll() {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
                console.log("Конец страницы");
                this.posts.requestPosts({
                    from: this.posts.next,
                    many: 1,
                    who: this.user.userID,
                })
            }
        }
    },
    beforeMount() {
        this.posts.$reset();
    },
    mounted() {
        this.posts.requestPosts({
            many: 3,
            from: 0,
            who: this.user.userId,
        })
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}       
</script>

<style>
    .paper {
        display:flex;
        flex-direction: column;
        margin-left: 15%;
        margin-right: 15%;
        overflow-y:auto;
    }
</style>
