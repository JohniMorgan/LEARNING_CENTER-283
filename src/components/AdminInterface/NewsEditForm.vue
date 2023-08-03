<template>
    <div class="main-area">
        <router-link to="/" class="link-btn">На главную</router-link>
        <section  v-show="!show">
            <span class="top">
                <img :src="image"/>
                <label class="form-label"><span><h1>{{ title }}</h1></span></label>
            </span>
            <div class="row mb-3">
                <label class="form-label row mb-3"><span><h5>Текст статьи</h5></span></label>
                <textarea class="form-control col-12" @input="onTextInput" :value="text"
                ref="text"></textarea>
            </div>
        </section>
        <NewsTitle :post="simulatePost" v-if="show"/>
        <div>
                <button class="btn btn-primary"
                @click="sendEdit">Загрузить</button>
                <button class="btn btn-primary"
                @click="switchShow">{{ previevButtonText }}</button>
        </div>
    </div>
</template>

<script>
import NewsTitle from '../Paper/NewsTitle.vue';
import { usePostsStore } from '@/store/modules/posts';

export default {
    components: {
        NewsTitle
    },
    data() {
        return {
            image: null,
            text: '',
            title: '',
            id: 0,
            show: false,
        }
    },
    beforeMount() {
        let props = this.$route.params;
        this.image = props.image;
        this.text = props.text;
        this.title = props.title;
        this.id = props.id;
    },
    mounted() {
        this.upgradeHeight();
    },
    methods: {
        onTextInput(event) {
            this.text = event.target.value;
            this.upgradeHeight();
        },
        upgradeHeight() {
            this.$refs.text.style.height = "5px";
            console.log(this.$refs.text);
            this.$refs.text.style.height = this.$refs.text.scrollHeight + "px";
        },
        switchShow() {
            this.show = !this.show
        },
        sendEdit() {
            const post = usePostsStore();
            post.requestEdit({
                id: this.id,
                text: this.text,
            }).then(this.$router.push("/"));
        }
    },
    computed: {
        simulatePost() {
            return {
                text: this.text,
                title: this.title,
                img: this.image,
                likes: 0,
                previev: true,
                date: "0001-01-01 00:00:00.344"
            }
        },
        previevButtonText() {
            return this.show ? "Редактировать" : "Предпросмотр"
        }
    }
}
</script>

<style scoped>
    button {
        margin: 10px;
    }
    img {
        width: 300px;
        max-height: 150px;
    }
    .top {
        display: flex;
        align-content: flex-start;
        justify-content: center;
        flex-wrap: wrap;
    }
    .top > * {
        padding-right: 10px;
    }
</style>