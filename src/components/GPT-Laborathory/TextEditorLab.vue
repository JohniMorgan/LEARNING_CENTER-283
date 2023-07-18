<template>
  <div ref="container" class="container">
    {{ truncatedText }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      originalText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      truncatedText: ''
    };
  },
  mounted() {
    this.truncateText();
    window.addEventListener('resize', this.truncateText);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.truncateText);
  },
  methods: {
    truncateText() {
      const container = this.$refs.container;
      const containerHeight = container.clientHeight;
      const lineHeight = parseFloat(getComputedStyle(container).lineHeight);
      const lines = Math.floor(containerHeight / lineHeight);

      let truncatedText = this.originalText;

      if (lines < container.scrollHeight / lineHeight) {
        const words = this.originalText.split(' ');

        while (lines < container.scrollHeight / lineHeight && words.length > 1) {
          words.pop();
          container.textContent = words.join(' ');
        }

        truncatedText = words.join(' ');
      }

      this.truncatedText = truncatedText;
    }
  }
};
</script>

<style>
.container {
  width: 200px; /* Ширина контейнера */
  overflow: hidden; /* Скрытие содержимого, выходящего за границы контейнера */
}
</style>

  
  
  
  
  
  
  
  
  
  