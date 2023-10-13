<template>
    <div class="main-area">
        <router-link to="/" class="link-btn">На главную</router-link>
        <section  v-show="!showPreview">
            <span class="top">
                <img :src="image" class="preview-img"/>
                <label class="form-label">
                    <span><h1>{{ title }}</h1></span>
                </label>
            </span>
            <div class="row mb-3">
                <label class="form-label row mb-3">
                    <span><h5>Текст статьи</h5></span>
                </label>
                <textarea class="form-control col-12"
                    @input="onTextInput"
                    :value="text"
                    ref="text">
                </textarea>
            </div>
        </section>
        <news-title :post="simulatePost" v-if="showPreview"/>
        <div>
            <button class="btn btn-primary"
                @click="sendEdit">Загрузить</button>
            <button class="btn btn-primary"
                @click="switchShow">{{ previewButtonText }}</button>
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
            showPreview: false,
        }
    },
    beforeMount() {
        let routeProps = this.$route.params;
        this.image = routeProps.image;
        this.text = routeProps.text;
        this.title = routeProps.title;
        this.id = routeProps.id;
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
            this.$refs.text.style.height = this.$refs.text.scrollHeight + "px";
        },
        switchShow() {
            this.showPreview = !this.showPreview
        },
        sendEdit() {
            const postStore = usePostsStore();
            postStore.requestEdit({
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
                preview: true,
                date: "0001-01-01 00:00:00.344"
            }
        },
        previewButtonText() {
            return this.showPreview ? "Редактировать" : "Предпросмотр"
        }
    }
}
</script>

<style scoped>
    .btn {
        margin: 10px;
    }
    .preview-img {
        width: 300px;
        max-height: 150px;
    }
    .top {
        display: flex;
        align-content: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .top > * {
        padding-right: 10px;
    }
</style>