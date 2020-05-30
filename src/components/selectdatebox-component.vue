<template>
    <div class="selectDateBox component">
        <div class="title" v-if="title && title.length">
            {{title}}
        </div>
        <div class="value" ref="value">
            <div class="selectValue" @click="selectValue_click" :class="{open:open}">
                <span class="text">
                    <template v-if="$scopedSlots.selectText!==undefined">
                        <slot name="selectText" :text="selectValue"></slot>
                    </template>
                    <template v-else>     
                        {{selectValue}}
                    </template>
                </span>
                <span class="icon"></span>
            </div>
            <transition name="fade">
                <div class="selectItem" v-if="open" :style="optionsStyle">
                    <datebox-component :value.sync="selectValue" :format="format" :booking="booking" @change="dateChange"></datebox-component>
                </div> 
            </transition>
        </div>  
    </div>
</template>

<script>
import moment from 'moment'
import dateboxComponent from '@/components/datebox-component'

export default {
    props: {
        title:{type:String,default:""},
        value:{type:String,default:""},
        format:{type:String,default:"YYYY/MM/DD"},
        booking:{type:Array,default:function(){
            return [];
        }},
    },
    components: {
        'datebox-component': dateboxComponent,
    },
    data: function () {
        return {
            ok:false,
            open:false,
            selectValue:"",
            optionsStyle:{},
            id:null
        }
    },
    mounted: function() { 
        var that = this;       
        this.selectValue = this.value;        
        document.addEventListener('contextmenu', this.cancel);
        document.addEventListener('click', this.cancel);
    },
    updated:function(){
        this.ok = true;
    },
    beforeDestroy:function(){
        document.removeEventListener('contextmenu', this.cancel);
        document.removeEventListener('click', this.cancel);
    },
    watch: {
        open:function(value){
            clearInterval(this.id);
            if(value){                
                var that = this;
                this.optionsStyle = this.getOptionsStyle();
                this.id = setInterval(function(){
                    var temp = that.getOptionsStyle();
                    if(Object.singleLayerComparison(that.optionsStyle,temp)){
                        that.optionsStyle = temp;
                        //that.open = false;
                    }
                }, 500);
            }
        }, 
        value:function(value){
            if(this.selectValue !== value){
                this.selectValue = value;
            }
        },
        selectValue:function(value){       
            this.$emit('update:value', value); 
            if(this.ok){
                this.$emit('change', value); 
            }           
        }
    },
    computed:{
    },
    methods: {
        cancel:function(e){
            if(this.open && !e.target.comparisonParentElement(this.$refs.value)){
                this.open = false;
            }
        },  
        dateChange:function(){
            var that = this;
            setTimeout(function(){
                that.open = false;
            },0);
        }, 
        timeChange:function(){            
            console.log('bb');
        },      
        selectValue_click:function(){
            this.open = !this.open;
        },
        getOptionsStyle:function(){
            if(this.open&&this.$refs.value){
                var rect = this.$refs.value.getBoundingClientRect();
                return {left:rect.left + "px",top:(rect.top + this.$refs.value.clientHeight) + "px"};
            }else{
                return {};
            }           
        },
        clear_click:function(e){
            this.selectValue = "";
            this.open = false;
        }        
    }
}
</script>

<style scoped>
    .selectDateBox .title {
        position: relative;
        display: block;
    }
    .selectDateBox .value{        
        position: relative;
        display: block;
    }
    .selectDateBox .value .selectValue{
        position: relative;
        display: block;   
        box-sizing: border-box;        
        line-height: 1em;
        color: #8c9a65;    
        font-family: Futwora Pro Trial Medium;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.64px;
    }
    .selectDateBox .value .selectValue .text{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        min-width: 30px;
        margin-right: 1.25em;
    }
    .selectDateBox .value .selectValue .icon{
        display: inline-block;
        width: 1em;
        vertical-align: middle;
        background-image: url(../assets/img/unfold02.png);
        background-size: 75%;
        position: absolute;
        height: 100%;
        top: 0px;
        right: 0.5em;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 1em;
        margin: 0px;
    }
    .selectDateBox .value .selectValue.open .icon{        
        background-image: url(../assets/img/fold02.png);
    }    

    .selectDateBox .value .selectValue.open:before{
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        left: 0%;
        top: 0%;
    }
    .selectDateBox .value > .selectItem{
        position: fixed;
        display: block;    
        z-index: 99999;
        box-sizing: border-box;
        padding-top: 10px;
    }

    .selectDateBox .value > .selectItem:before{
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        display: block;
        border-width: 0 10px 5px 10px;
        border-color: transparent transparent #fff transparent;
        left: 10px;
        top: 5px;
    }
    .selectDateBox .value .dateBox{
        border:0;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 20px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter-to, .fade-leave {
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .dateSelect .dateBox.component{
        width: 270px;
    }
</style>