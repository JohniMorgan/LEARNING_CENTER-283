<template>
<div>
    <label class="from-label">{{ title }}</label>
    <input class="form-control" :class="inputValidClass" :type="type"
    :value="value"
    @input="UserInput">
    <label class="form-text" v-if="needHelp">{{ helpMsg }}</label>
</div>
</template>

<script>


export default {
    name: "FormInput",
    props: {
        title: String,
        value: String,
        pattern: RegExp,
        type: String,
        helpMsg: String,
    },
    data() {
        return {
            activated: false,
        }
    },
    computed: {
        inputValidClass() {
            if (this.activated) {   
                return !this.pattern.test(this.value) ?
            'is-invalid' :
            'is-valid'
            } else return null
        },
        needHelp() {
            return this.helpMsg != null;
        }
    },
    methods: {
        UserInput(event) {
            if (this.pattern != null)
                this.activated = true;
            this.$emit('waschanged', { value: event.target.value,
            valid:this.pattern != null ? 
            this.pattern.test(event.target.value) :
            event.target.value != ''});
        }
    }
}

</script>

<style scoped>
   .form-text {
        font-size: 0.7em;
    }
</style>