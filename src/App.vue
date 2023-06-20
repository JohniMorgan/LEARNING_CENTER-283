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
router-link {
        color: #0c43a2;
    }
</style>
