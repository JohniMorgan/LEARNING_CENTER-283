<template>
  <div class="modal" v-if="open">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['open'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 30%;
  background-color: #fff;
  padding: 20px;
}
</style>
