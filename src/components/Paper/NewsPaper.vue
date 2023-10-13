<template>
<news-header/>
<div class="paper">
    <news-title v-for="post in postsStore.posts" :key="post.id"
        :post="post"
        @liked="likePost"
        @delete="deletePost"/>
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
        const userStore = useUserStore();
        const postsStore = usePostsStore();
        return {userStore, postsStore};
    },
    methods: {
        /*pushPost(post) {
            this.postsStore.posts.push({
                id: post.id,
                isLiked: post.isLiked,
                likes: post.likes,
                title: post.title,
                text: post.text,
                img: post.img,
                postDate: post.date
            });
        },*/
        likePost(event) {
            let key = this.postsStore.posts.findIndex((el) => {return el.id == event.value})    
            this.postsStore.posts[key].isLiked = !this.postsStore.posts[key].isLiked;
            this.postsStore.posts[key].likes += (this.postsStore.posts[key].isLiked ? 1 : -1); 
        },
        handleScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight) {
                this.postsStore.requestPosts({
                    from: this.postsStore.next,
                    many: (this.postsStore.postsCount > 3) ? 3 : this.postsStore.postsCount,
                    who: this.user.userID,
                })
            }
        },
        deletePost(event) {
            this.postsStore.requestDelete(event.value)
            .then(() => {
                this.$router.go(0);
            }).catch(err => console.log(err.msg));
        }
    },
    beforeMount() {
        this.postsStore.$reset();
    },
    mounted() {
        this.postsStore.requestHowMany().then(() => {
        this.postsStore.requestPosts({
            many: (this.postsStore.postsCount > 3) ? 3 : this.postsStore.postsCount,
            from: 0,
            who: this.userStore.userId,
        }).then(console.log("Посты успешно загружены"));
    }).catch(er => console.log(er));
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}       
</script>

<style>

</style>
