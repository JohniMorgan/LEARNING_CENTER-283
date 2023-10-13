<template>
  <div class="modal" v-if="open">
    <div class="modal-content">
      <h1>Вы уверены что хотите удалить?</h1>
      <p>Отменить это действие будет невозможно</p>
      <p class="msg"><slot></slot></p>
      <div>
        <button class="func-btn link"
          @click="close" >Отменить</button>
        <button class="func-btn link" 
          @click="accept">Подтвердить</button>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    accept() {
      this.$emit('accept');
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
.msg {
  max-height: 18px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
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
