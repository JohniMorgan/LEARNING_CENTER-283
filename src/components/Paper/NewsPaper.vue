<template @scroll="console.log('scroll')">
<NewsHeader/>
<div class="paper">
    <NewsTitle v-for="(post, index) in allPosts" :key="index"
        :post="post"
        @liked="likePost"
        @delete="deletePost"
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
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight) {
                console.log("Конец страницы");
                this.posts.requestPosts({
                    from: this.posts.next,
                    many: (this.posts.howMany > 3) ? 3 : this.posts.howMany,
                    who: this.user.userID,
                })
            }
        },
        deletePost(event) {
            console.log("delete post id:" + event.value);
            this.posts.requestDelete(event.value).then(() => {
                this.$router.go(0);
            }).catch(err => console.log(err.error));
        }
    },
    beforeMount() {
        this.posts.$reset();
    },
    mounted() {
        this.posts.requestHowMany().then(() => {
        this.posts.requestPosts({
            many: (this.posts.howMany > 3) ? 3 : this.posts.howMany,
            from: 0,
            who: this.user.userId,
        })
    }).catch(er => {er});
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}       
</script>

<style>

</style>
