<template>
    <div class="main-area">
        <router-link to="/" class="link-btn">На главную</router-link>
        <form class="upload-container"
        @submit.prevent="onNewsUpload">
        <span class="top">
            <FileUploader 
            :imageSrc="$route.params.image"
            @uploaded-img="onUploadFile"/>
            <span>
                <label class="form-label row mb-3"><span><h3>Заголовок статьи</h3></span></label>
                <input type="text" class="form-control" v-model="title">
            </span>
        </span>
        <div class="row mb-3">
            <label class="form-label row mb-3"><span><h5>Текст статьи</h5></span></label>
            <textarea class="form-control col-12" @input="onTextInput" :value="text" :style="'height:'+areaSize"
             v-show="!previev"></textarea>
            <p v-if="previev" 
            width="200" 
            v-html="text"
            class="text"></p>
        </div>
        <button class="btn btn-primary">Загрузить</button>
        </form>
    </div>
</template>

<script>
import FileUploader from "./FileUploader.vue";

import api from "@/confaxios";
import { useSecurityStore } from "@/store/modules/security";

export default {
    components: {
        FileUploader,
    },
    setup() {
        const auth = useSecurityStore();
        return {auth};
    },
    data() {
        return {
            uploadedFile: null,
            title: null,
            text: null,
            previev: false,
            areaSize: '5px',
        }
    },
    methods: {
        onNewsUpload() {
            let data = new FormData();
            data.append('file', this.uploadedFile);
            let head = {
                'Content-Type' : 'multipart/form-data'
            }
            api.post(
                '/posts/uploadImageToPost', data, {
                    headers: head
                }).then(response => {
            api.post(
                '/posts/addPost', {
                    "title" : this.title,
                    "text" : this.text,
                    "imagePath" : response.data.path
                }).then(() => this.$router.push('/')).catch(e => console.log(e))
                }).catch(error => {
                    console.log(error);
                })
        },
        onUploadFile(event) {
            this.uploadedFile = event.value;
        },
        onTextInput(event) {
            this.text = event.target.value;
            event.target.style.height = "5px"
            this.areaSize = (event.target.scrollHeight) + "px";
            event.target.style.height = this.areaSize;
        },
    }
}
</script>

<style>
    
    .main-area {
        width: 75%;
        display: flex;
        flex-direction: column;
        justify-content:left;
        min-height: 100vh;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
    }
    
    FileUploader {
        float:left;
        align-self: flex-start;
    }

    .upload-container {
        display: flex;
        position:relative;
        z-index:10;
        justify-content: center;
        flex-direction: column;
    }
    .link-btn {
        align-self: flex-end;
        background-color: white;
        color:blue;
        border: none;
        text-decoration: none;
    }
    .previev {
        white-space: pre-wrap;
    }
</style>