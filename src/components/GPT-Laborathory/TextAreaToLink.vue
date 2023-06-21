<template>
    <div class="text-to-link">
        <textarea class="form-control"
        v-model="text" @mouseup="onSelection"></textarea>
        <p>Выделенный текст: {{ selectedText }}</p>
        <span>Исходный текст: <div v-html="text"></div></span>
        <button class="btn btn-primary" @click="showModal=true" v-if="selectedText">Создать ссылку</button>
        <div class="modal-win" v-if="showModal">
            <div class="modal-conect">
                <h2>Создание ссылки</h2>
                <input type="text" v-model="linkURL" placeholder="Введите URL ссылки">
                <button @click="createLink">Создать</button>
                <button @click="showModal=false">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: '',
            selectionStart: 0,
            selectionEnd: 0,
            showModal: false,
            linkURL: '',
        }
    },
    computed: {
        formattedText() {
            const beforeSelection = this.text.substring(0, this.selectionStart);
            const selected = this.text.substring(this.selectionStart, this.selectionEnd);
            const afterSelection = this.text.substring(this.selectionEnd);
            return beforeSelection + `<a href="${this.linkURL}">${selected}</a>` + afterSelection;
        },
        selectedText() {
            return this.text.substring(this.selectionStart, this.selectionEnd);
        }
  },
  methods: {
        onSelection(event) {
            this.selectionStart = event.target.selectionStart;
            this.selectionEnd = event.target.selectionEnd;
        },
        createLink() {
            // Отправить созданную ссылку на сервер или выполнить другие необходимые действия
            console.log("Создана ссылка:", this.linkURL);
            this.text = this.formattedText; // Обновляем текст с созданной ссылкой
            this.showModal = false; // Закрываем модальное окно
        }
  }
}
</script>

<style>

</style>