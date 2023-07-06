<template>
    <div class="main-area">
        <router-link to="/" class="link-btn">На главную</router-link>
        <form class="upload-container"
        @submit.prevent="onNewsUpload">
        <div class="row mb-3">
            <FileUploader class="col-md-4"
            @uploadedImg="onUploadFile"/>
            <div class="col-md-8">
                <label class="form-label row mb-3"><span><h3>Заголовок статьи</h3></span></label>
                <input type="text" class="form-control" v-model="title">
            </div>
        </div>
        <div class="row mb-3">
            <label class="form-label row mb-3"><span><h5>Текст статьи</h5></span></label>
            <textarea class="form-control col-12" @input="onTextInput" :value="text" :style="'height:'+areaSize"
             v-show="!previev"></textarea>
            <p v-if="previev" @mouseup="onSelectedText" width="200"> {{ text }}</p>
        </div>
        <!--<button class="btn btn-primary">Загрузить</button>-->
        </form>
        <button class="btn btn-primary" @click="previev = !previev">Предпросмотр</button>
    </div>
</template>

<script>
import FileUploader from "@/components/FileUploader.vue";

import conector from "@/confaxios";
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
            areaSize: '5px'
        }
    },
    methods: {
        onNewsUpload() {
            let token = this.auth.getToken;
            let data = new FormData();
            data.append('file', this.uploadedFile);
            let head = {
                'Authorization': `${token.type} ${token.accessToken}`,
                'Content-Type' : 'multipart/form-data'
            }
            conector.post(
                '/posts/uploadImageToPost', data, {
                    headers: head
                }).then(response => {
            conector.post(
                '/posts/addPost', {
                    "title" : this.title,
                    "text" : this.text,
                    "imagePath" : response.data.path
                }, {headers: {'Authorization': `${token.type} ${token.accessToken}`}}
                    ).then(() => this.$router.push('/')).catch(e => console.log(e))
                }).catch(error => {
                    console.log(error);
                })
        },
        onUploadFile(event) {
            console.log(event.value);
            this.uploadedFile = event.value;
            console.log(this.uploadedFile);
        },
        onTextInput(event) {
            this.text = event.target.value;
            event.target.style.height = "5px"
            console.log(event.target.scrollHeight);
            this.areaSize = (event.target.scrollHeight) + "px";
            event.target.style.height = this.areaSize;
        },
        onSelectedText(event) {
            
            console.log('@mouseup');
        }
    }
}
</script>

<style>
    
    .main-area {
        margin: 25px;
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
</style>