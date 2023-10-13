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
    props: {
        imageSrc: {
            type: String,
            required: true
        }
    },
    data() {
       return {
            image: null,
            reader: ''
       } 
    },
    beforeMount() {
        this.reader = new FileReader;
        this.reader.onload = (e) => {
                    this.image = e.target.result;
                }
        if (this.imageSrc) {
            this.image = this.imageSrc;
        }
    },
    methods: {
        showPreview(event) {
            let input = event.target;
            if(input.files && input.files[0]) {
                this.reader.readAsDataURL(input.files[0]);
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
        width: 80%;
        max-width:300px;
        margin: none;
    }
    .img-wrapper {
        flex: left;
        width: 100%;
        max-width: 300px;
        height: 150px;
    
        border-radius: 1px;
        outline: 3px solid #eee;
        margin-right: 10px;
        overflow-y: hidden;
        border-radius: 1px;
        background: #fff;
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
        max-height: 100%;
        object-fit:contain;
        object-position: top;
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