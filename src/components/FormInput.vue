<template>
<div>
    <label class="from-label">{{ title }}</label>
    <input class="form-control" :class="inputValidClass" :type="type"
    :value="value"
    @input="UserInput">
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
        }
    },
    methods: {
        UserInput(event) {
            if (this.pattern != null)
                this.activated = true;
            this.$emit('waschanged', { value: event.target.value,
            valid:this.pattern != null ? 
            this.pattern.test(this.value) :
            event.target.value != ''});
        }
    }
}

</script>

<style>

</style>