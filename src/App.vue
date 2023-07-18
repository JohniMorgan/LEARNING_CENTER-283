<template>  
  <router-view/>
</template>

<script>
import { useSecurityStore } from './store/modules/security';
import { mapStores } from 'pinia';

export default {
  name: 'App',
  computed: {
    ...mapStores(useSecurityStore),
  },
  beforeMount() {
    this.securityStore.registryToken();
  },
}
</script>

<style>
.link-btn {
        color: #0c40a2;
        text-decoration: none;
    }
</style>
