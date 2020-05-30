<template>
	<div class="appContent">	
		<router-view :open.sync="open"></router-view>
		<slide-menu :open.sync="open"></slide-menu>		
    </div>
</template>

<script>
import slideMenu from '@/components/slide-menu'

export default {
	components: {
		'slide-menu': slideMenu,
    },
  	props: {

  	},
  	data: function () {
        return {
            open:false
        }
    }
}
</script>

<style scoped>
	.appContent{
		position: relative;
	    display: block;
	    width: 100vw;
	    height: 100vh;
	    min-width: 1024px;
	    min-height: 768px;
	}
</style>