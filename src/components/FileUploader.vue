<template>
    <div class="image-input">
        <div class="input-wrapper">
            <input type="file" @change="showPreview" id="img-input-in" hidden>
        </div>
        <label class="img-wrapper" for="img-input-in">
            <i v-show="!image" class="icon fa fa-picture-o" for="img-input-in"></i>
            <img v-show="image" class="img-input-img" :src="image" for="img-input-in">
        </label>  
    </div>
</template>

<script>
export default {
    //props: ["imageSrc"],
    data() {
       return {
            image: null
       } 
    },
    methods: {
        showPreview(event) {
            let input = event.target;
            //console.log(event.target.files[0])
            if(input.files && input.files[0]) {
                let reader = new FileReader;
                reader.onload = (e) => {
                    this.image = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
                this.$emit('uploadedImg', {
                    value: input.files[0]
                })
            }
        }
    }
}
</script>

<style>
    .image-input {
        display: flex;
    }
    .img-wrapper {
        flex: left;
        width: 300px;
        aspect-ratio: calc(16/9);
        border-radius: 1px;
        margin-right: 10px;
        overflow-y: hidden;
        border-radius: 1px;
        background: #eee;
        justify-content: center;
        align-items: center;
        display: flex;
        cursor: pointer;
    }
    .img-wrapper > .icon {
        color: #ccc;
        font-size: 50px;
        cursor: default;
    }
    .img-input-img {
        max-width: 100%;
        border-radius: 1px;
    }
    #img-input-in {
        display: block;
        font-size: 20px;
        width: 300px;
        opacity: 1;
        position: absolute;
        left: 0;
        text-align: center;
        top: 0;
        cursor: pointer;
    }
</style>