<template>
  <div>
    <p ref="paragraph" v-html="text" @mouseup="handleSelection"></p>
    <div v-if="selectedHtml">
      <h3>Выделенный фрагмент:</h3>
      <div v-html="selectedHtml"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "Начните вводить текст и выделять участки для форматирования.",
      selectedHtml: null,
    };
  },
  computed: {
    formattedText() {
      return this.isBold ? `<b>${this.text}</b>` : this.text;
    },
  },
  methods: {
    handleSelection() {
      //const paragraph = this.$refs.paragraph;
      const selection = window.getSelection();
      const selectedText = selection.toString();

      if (selectedText) {
        const range = selection.getRangeAt(0);
        const isInsideBold = this.isSelectionInsideBold(range);
        console.log(isInsideBold);
        if (!isInsideBold)
          this.text = this.text.replace(selection.toString(), `<b>${selection.toString()}</b>`);
        else 
          this.removeOrPushBold(range);
        this.selectedHtml = this.serializeRange(range);
      } else {
        this.selectedHtml = null;
      }
    },
    isSelectionInsideBold(range) {
      const parentElement = range.commonAncestorContainer.parentElement;
      return parentElement.tagName === "B" || parentElement.tagName === "DIV";
    },
    removeOrPushBold(range) {
      console.log(range);
      const selection = window.getSelection();
      
      console.log(selection);
      const start = range.startContainer;
      const end = range.endContainer;
      if (start == end) {
        console.log("Выделено внутри тега, убираем выделение");
        console.log(start.textContent);
        this.text = this.text.replace(`<b>${start.textContent}</b>`, start.textContent);
      }
      else {
        let selection = window.getSelection().toString();
        let htmlSelection = this.serializeRange(range);
        console.log("Жирный текст внутри выделения");
        if (start.parentElement.tagName === "B") {
          console.log("Начинается выделением");
          htmlSelection = htmlSelection.slice(3);
        } else selection = "<b>" + selection;
        if (end.parentElement.tagName === "B") {
          console.log("Заканчивается выделением");
          htmlSelection = htmlSelection.slice(0, -4);
        } else selection = selection + "</b>";
        console.log(htmlSelection);
        console.log(selection);
        console.log(this.text);
        this.text = this.text.replace(htmlSelection, selection);
        console.log(this.text);
      }
    },
    serializeRange(range) {
      console.log("Вызван сериализатор");
      const div = document.createElement("div");
      div.appendChild(range.cloneContents());
      return div.innerHTML;
    },
  },
};
</script>

<style>
p {
  font-size: 16px;
}
</style>


