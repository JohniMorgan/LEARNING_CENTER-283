<template>
    <div class="main-area">
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
            <textarea class="form-control col-12" rows="16" v-model="text"></textarea>
        </div>
        <button class="btn btn-primary">Загрузить</button>
        </form>
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
                    ).then(response_add => console.log(response_add)).catch(e => console.log(e))
                }).catch(error => {
                    console.log(error);
                })
        },
        onUploadFile(event) {
            console.log(event.value);
            this.uploadedFile = event.value;
            console.log(this.uploadedFile);
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
</style>