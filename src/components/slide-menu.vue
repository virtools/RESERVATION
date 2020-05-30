<template>
	<div class="slideMenu" :class="{open:opening,hover:hover}" @mouseenter="slideMenu_mouseenter" @mouseleave="slideMenu_mouseleave">
		<div class="slideMenuContentSmall" v-if="!opening">
			<div class="logo">
				<img src="../assets/img/logoSmall.png">
			</div>
			<div class="menuButton"></div>
		</div>
		<div class="slideMenuContent">
			<div class="logo">
				<img src="../assets/img/logo.png">
			</div>
			<div class="items">
				<div class="item active" @click="nav_click('home')">Home</div>
				<div class="item" @click="nav_click('room_for_fou')">Room for you</div>
				<div class="item" @click="nav_click('contact')">Contact</div>
			</div>
			<div class="info">
				<div class="text"><div class="icon telephone"></div>0203 504 5555</div>
				<div class="text"><div class="icon mail"></div>Hotels@hotels.com</div>
				<div class="text">Reservation Opening Hours</div>
				<div class="text">Weekday 8am – 8pm</div>
				<div class="text">Weekend 9am – 6pm</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		open:{type:Boolean,default:false}
	},
	data: function () {
		return {
			opening:false,
			hover:false
		}
	},
	mounted: function() { 
		this.opening = this.open;
	},
	watch: {
		open:function(value){
			if(this.opening !== value){
				this.opening = value;
			}
		},
		opening:function(value){   
			this.$emit('update:open', value);
		}
	},
	methods: {
		menuButton_click:function(){
			this.opening = !this.opening;
		},
		slideMenu_mouseenter:function(){
			if(!this.opening){
				this.hover = true;
			}
		},
		slideMenu_mouseleave:function(){
			//if(!this.opening){
				this.hover = false;
			//}
		},
		nav_click:function(value){
			if(value==="home"){
				this.$router.push('/home');
			}else{			
				alert('No page');
			}
		}

			
	}
}
</script>

<style scoped>
	.slideMenu{
		position: absolute;
		display: block;
		height: 100%;
		left: 0px;
		top: 0px;
		z-index: 1;
		width: 80px;
	}
	.slideMenu.open{
		width: 280px;
		background-color: transparent;
	}
	.slideMenuContentSmall{
		position: absolute;
		display: inline-block;
		height: 100%;
		background-color: #8C9A65;
		width: 80px;
		top: 0px;
		left: 0px;
	}
	.slideMenuContent{
		position: absolute;
		display: inline-block;
		height: 100%;
		background-color: #fff;
		width: 280px;
		visibility: hidden;
		top: 0px;
		left: 0px;
	}
	.slideMenu .slideMenuContent{
		box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.1);
		opacity: 0;
		transition: visibility .3s,opacity .3s,transform .3s;
		transform: translateX(-100%);
	}
	.slideMenu.open .slideMenuContent{
		box-shadow: none;
		visibility: initial;
		opacity: 1;
		transform: translateX(0%);
		transition: initial;
	}
	.slideMenu.hover .slideMenuContent{
		visibility: initial;
		opacity: 1;
		transform: translateX(0%);
	}

	.slideMenu .menuButton{
		position: absolute;
		display: block;
		width: 40px;
		height: 40px;
		top: 50%;
		left: 50%;
		margin-left: -20px;
		margin-top: -20px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-image: url(../assets/img/menu.svg);
	}
	.slideMenu .slideMenuContent .logo{
		position: relative;
		display: block;
		margin:50px 0px;
		margin-left: 2em;
	}
	.slideMenu .slideMenuContent .logo img{
		position: relative;
		display: block;
	}
	.slideMenu .slideMenuContentSmall .logo{
		position: relative;
		display: block;
		margin: 50px 0px
	}
	.slideMenu .slideMenuContentSmall .logo img{
		position: relative;
		display: block;
		margin: 0 auto;
	}
	.slideMenu .items{
	}
	.slideMenu .item{
		position: relative;
		display: block;
		font-size: 20px;
		line-height: 45px;
		font-family: Futwora Pro Trial Bold;
		color: #666666;
		padding:0.5em 0;
		padding-left: 2em;
		height: 45px;
		cursor: pointer;
	}
	.slideMenu .item.active:before{
		content: "";
		position: absolute;
		display: block;
		background-color: #8C9A65;
		width: 10px;
		height: 45px;
		left: 0;
	}
	.slideMenu .info{
		position: absolute;
		display: block;
		bottom: 0px;
		padding: 2em 0;
		width: 100%;
		box-sizing: border-box;
	}
	.slideMenu .text{
		position: relative;
		display: block;
		font-size: 12px;
		line-height: 14px;
		font-family: Futwora Pro Trial Medium;
		color: #666666;
		padding:0.5em 0;
		padding-left: 4em;
	}

	.slideMenu .icon{
		content: "";
		position: relative;
		display: inline-block;
		width: 2em;
		height: 1em;
		margin-left: -2em;
	}
	.slideMenu .icon{
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}
	.slideMenu .icon.telephone{
		background-image: url(../assets/img/telephone.svg);
	}
	.slideMenu .icon.mail{
		background-image: url(../assets/img/mail.svg);
	}
</style>