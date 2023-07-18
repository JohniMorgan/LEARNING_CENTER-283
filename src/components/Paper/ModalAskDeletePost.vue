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
  padding:15px;
  background-color: #fff;
  width: 70%;
  font-size: 14px;
}
@media (min-width: 700px) {
  .modal-content {
    padding: 20px;
    width: 50%;
    max-width: 400px;
  }
}
</style>
