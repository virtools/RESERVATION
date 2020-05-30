<template>
  <div class="app noSelect" id="app" v-cloak>
    <index/>
  </div>
</template>

<script>
import index from './components/index.vue';

export default {
  name: 'app',
  components: {
    index
  },
  mounted: function() {
  }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
  @font-face {
      font-family: Futwora Pro Trial Oblique;
      src: url(./assets/font/FutworaProTrial-Oblique.otf);
  }
  @font-face {
      font-family: Futwora Pro Trial Bold;
      src: url(./assets/font/FutworaProTrial-Bold.otf);
  }
  @font-face {
      font-family: Futwora Pro Trial Medium;
      src: url(./assets/font/FutworaProTrial-Medium.otf);
  }
  @font-face {
      font-family: Futwora Pro Trial Regular;
      src: url(./assets/font/FutworaProTrial-Regular.otf);
  }
  html{
    position: relative;
      display: block;
  }
  body{    
    position: relative;
      display: block;
    margin:0;
      font-family: 'Futwora Pro Trial Oblique', sans-serif;
  }
  .app{
    position: relative;
    display: block;
  }
  .loader {
    /*border: 16px solid #f3f3f3;*/ /* Light grey */
    border-top: 2px solid #8C9A65; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 0.5s linear infinite;
    margin-left: -25px;
    margin-top: -25px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
