<template>
    <div class="wrap home" :class="{open:open}" v-if="!loading">
        <div class="boxs" @mousemove="boxs_mousemove" ref="boxs">
            <div class="box" v-for="(item) in rooms" :key="item.id">
                <div class="boxBg" :style="{backgroundImage: 'url('+item.imageUrl+')'}"></div>
                <div class="word">
                    <div class="wordContent">
                        <div class="wordName">{{item.name}}</div>
                        <div class="wordItems">
                            <div class="wordItem">
                                <div class="wordTitle">Weekday Rate</div>
                                <div class="wordText">$ {{item.normalDayPrice}} TWD / night</div>
                            </div>
                            <div class="wordItem">
                                <div class="wordTitle">Weekend Rate</div>
                                <div class="wordText">$ {{item.holidayPrice}} TWD / night</div>
                            </div>
                        </div>
                        <div class="more" @mouseover="more_mouseover" @mouseout="more_mouseout" @click="more_click(item.id)">More</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="control">
            <div class="prev" @mousedown="prev_mousedown"></div>
            <div class="next" @mousedown="next_mousedown"></div>
        </div>
    </div>
    <div v-else class="loading" :class="{open:open}">
        <div class="loader"></div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: {
        open:{type:Boolean,default:false},
    },
    data:function(){
        return {
            rooms:[],
            room:{},
            scrollAnimation:false,
            scrollV:0,
            scrollLeft:0,
            scrollPause:false,
            loading:true           
        }
    },
    mounted: function() {    
        var headers = {
                authorization:'Bearer ZGfuVIrPXdqjzNZpUiZuvMxCnOdNyGhQD8Bd4r4jg85AEOcZyLRGtHyodRTQ',
                accept:'application/json'
            };    
        var that = this;
        this.getRoom({headers:headers}).then(function(resp){
            //console.log(resp.data.items)
            that.rooms = resp.data.items;
            that.loading = false;
        }).catch(function(err){
            //console.log(err);
        });  
        this.$emit('update:open', true);     
    },
    watch:{
        
    },
    methods: {
        getRoom:function(data, id){
            if(id===undefined){
                return axios.get('https://challenge.thef2e.com/api/thef2e2019/stage6/rooms',data);
            }else{
                return axios.get('https://challenge.thef2e.com/api/thef2e2019/stage6/room/'+id,data);
            }
        },
        boxs_mousemove:function(e){
            var rate = (e.pageX - e.currentTarget.offsetLeft)/e.currentTarget.offsetWidth;            
            this.scrollV = rate - 0.5;
            this.startScroll();
        },
        startScroll:function(){ 
            if(!this.scrollAnimation){ 
                this.scrollAnimation = true;                
                requestAnimationFrame(this.updateScroll);
            }
        },
        updateScroll:function(){
            if(!this.scrollPause){
                this.scrollLeft+=40*this.scrollV/0.5;
                var min = 0;
                var max = this.$refs.boxs.scrollWidth-this.$refs.boxs.offsetWidth;
                if(this.scrollLeft<min){
                    this.scrollLeft = min;
                }else if(this.scrollLeft>max){
                    this.scrollLeft = max;
                }
                this.$refs.boxs.scrollLeft+=(this.scrollLeft - this.$refs.boxs.scrollLeft)*0.3;
            }            
            if(this.$refs.boxs.scrollLeft===this.scrollLeft){
                this.scrollAnimation = false;  
            }else{                  
                requestAnimationFrame(this.updateScroll);
            }
        },
        prev_mousedown:function(){
            this.scrollV = -0.5;
            this.startScroll();
            window.addEventListener("mouseup", this.mouseup);
        },
        next_mousedown:function(){  
            this.scrollV = 0.5;
            this.startScroll();
            window.addEventListener("mouseup", this.mouseup);
        },
        mouseup:function(){
            this.scrollV = 0;
            window.removeEventListener("mouseup", this.mouseup);
        },
        more_mouseover:function(){
            this.scrollPause = true;
        },
        more_mouseout:function(){               
            this.scrollPause = false;
        },
        more_click:function(id){
            //console.log(id);
            this.$router.push('/content/' + id);
        }
    }
}
</script>

<style scoped>
    .loading{
        position: absolute;
        display: block;
        height: 100%;
        box-sizing: border-box;
        left: 80px;
        right: 0px;
    }
    .loading.open{    
        left: 280px;
    }
    .loader{
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .wrap{        
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding-left: 80px;
    }
    .wrap.open{        
        padding-left: 280px;
    }
    .boxs{ 
        position: relative;
        display: block;       
        width: 100%;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        font-size: 0;
    }
    .box{
        position: relative;
        display: inline-block;
        width: 250px;
        height: 100%;
        transition: width .3s;
        font-size: 0;
        min-width: calc(100% / 6);
    }
    .box:hover{
        width: 300px;
    }
    .boxBg{
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        background-color: #777;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .control{
        position: absolute;
        display: block;
        right: 10px;
        bottom: 10px;
    }
    .control .prev{
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image: url(../assets/img/prev.svg);
        cursor: pointer;
    }
    .control .next{
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image: url(../assets/img/next.svg);
        cursor: pointer;
    }
    .word{
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        background-color: rgba(102, 102, 102, 0.6);
        left: 0px;
        top: 0px;
        font-size: initial;
        transition: background-color .3s;
        white-space: normal;
    }
    .wordContent{
        position: relative;
        display: block;
        color: #fff;
        margin-top:150px;
        text-align: center;
    }
    .wordName{
        position: relative;
        display: block;
        font-size: 24px;
        line-height: 29px;
        margin-bottom: 20px;
        font-family: Futwora Pro Trial Regular;
        letter-spacing: 0.96px;
        height: 60px;
        padding: 0px 30px;
    }
    .wordItems{
        position: relative;
        display: inline-block;
        margin-top: 30px;
    }
    .wordItem{
        position: relative;
        display: block;
        padding: 20px;
        font-family: Futwora Pro Trial Medium;
        text-align: left;
        letter-spacing: 0.64px;
    }
    .wordTitle{
        font-size: 12px;
        line-height: 16px;
    }
    .wordText{
        font-size: 16px;
        line-height: 24px;
    }
    .more{
        position: relative;
        display: block;
        max-width: 150px;
        margin:0 auto;
        border:1px solid #fff;
        padding: 10px;
        box-sizing: border-box;
        margin-top: 30px;
        font-family: Futwora Pro Trial Medium;
        visibility: hidden;
        cursor: pointer;
        opacity: 0;
        transition: opacity .3s,visibility .3s;
        letter-spacing: 0.64px;
    }
    .box:hover .more{
        visibility: initial;
        opacity: 1;
    }

    .box:hover .word{
        background-color: rgba(51, 51, 51, 0.3);
    }
</style>