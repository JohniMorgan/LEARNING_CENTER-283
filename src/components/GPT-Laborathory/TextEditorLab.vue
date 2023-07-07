<template>
    <div>
      <p ref="paragraph" @mouseup="handleMouseUp">
        This is some sample text.
      </p>
      <button @click="getSelectionRange">Get Selection Range</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleMouseUp() {
        this.saveSelectionRange();
      },
      saveSelectionRange() {
        const paragraph = this.$refs.paragraph;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
  
        const startRange = document.createRange();
        startRange.setStart(paragraph, 0);
        startRange.setEnd(range.startContainer, range.startOffset);
  
        const endRange = document.createRange();
        endRange.setStart(paragraph, 0);
        endRange.setEnd(range.endContainer, range.endOffset);
  
        this.selectionStart = startRange.toString().length;
        this.selectionEnd = endRange.toString().length;
      },
      getSelectionRange() {
        console.log('Selection Start:', this.selectionStart);
        console.log('Selection End:', this.selectionEnd);
      },
    },
    data() {
      return {
        selectionStart: 0,
        selectionEnd: 0,
      };
    },
  };
  </script>
  
  
  
  
  
  
  
  
  
  