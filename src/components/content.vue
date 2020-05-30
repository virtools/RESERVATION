<template>
    <div class="wrap content" :class="{open:open}">
        <table class="table" v-if="!loading">
            <tbody>
                <tr class="topTr">
                    <td>
                        <div class="top">
                            <div class="imgs">
                                <div class="imgContent" :style="{marginLeft:-imgLeft*100+'%'}">
                                    <div class="img" v-for="(item,index) in room.imageUrl" :style="{backgroundImage: 'url('+item+')'}"></div>
                                </div>
                                <div class="imgControl">
                                    <div class="imgIndex" v-for="(item,index) in room.imageUrl" :class="{active:index===imgIndex}" @click="imgIndex_click(index)"></div>
                                </div>
                            </div>
                            <div class="inputInfo" v-if="!result">
                                <div class="inputInfoContent">
                                    <div class="region">
                                        <div class="block subTitle required">
                                            <div class="text">Name</div>
                                        </div>
                                        <div class="block">
                                            <input type="text" class="inputText" name="name" v-model="name" v-validate="'required|min:2'" data-vv-scope="main">
                                            <div class="bottomLine"></div>
                                            <div class="errorText" v-if="errors.has('main.name')">{{ errors.first('main.name') }}</div>
                                        </div>
                                    </div>
                                    <div class="region">
                                        <div class="block subTitle required">
                                            <div class="text">Phone number</div>
                                        </div>
                                        <div class="block">
                                            <input type="text" class="inputText" name="phoneNumber" v-model="phoneNumber" v-validate="'required|mobile'" data-vv-scope="main">
                                            <div class="bottomLine"></div>
                                            <div class="errorText" v-if="errors.has('main.phoneNumber')">{{ errors.first('main.phoneNumber') }}</div>
                                        </div>
                                    </div>
                                    <div class="region">
                                        <div class="block subTitle required">
                                            <div class="text">Check-in / Chenk-out time</div>
                                        </div>
                                        <div class="block">
                                            <input type="text" class="inputText" name="date" v-model="date" v-show="false" v-validate="'required'" data-vv-scope="main">
                                            <selectdatebox-component :value.sync="date" :format="dateFormat" :booking="booking" @change="date_change" class="dateSelect"></selectdatebox-component>
                                            <div class="bottomLine"></div>
                                            <div class="errorText" v-if="errors.has('main.date')">{{ errors.first('main.date') }}</div>
                                        </div>
                                    </div>
                                    <div class="region total">
                                        <div class="block subTitle">
                                            <div class="text">Total</div>                                                   
                                            <div class="amountDetailed" v-if="room&&room.normalDayPrice!==undefined&&room.holidayPrice!==undefined">
                                                <template v-if="amountDetailed.normalDayPrice&&amountDetailed.holidayPrice">
                                                    $ {{room.normalDayPrice}} x {{amountDetailed.normalDayPrice}} + $ {{room.holidayPrice}} x {{amountDetailed.holidayPrice}}
                                                </template>
                                                <template v-else-if="amountDetailed.normalDayPrice">
                                                    $ {{room.normalDayPrice}} x {{amountDetailed.normalDayPrice}}
                                                </template>
                                                <template v-else-if="amountDetailed.holidayPrice">
                                                    $ {{room.holidayPrice}} x {{amountDetailed.holidayPrice}}
                                                </template>
                                                
                                            </div>
                                        </div>
                                        <div class="block">
                                            <div class="bottomLine"></div>
                                            <div class="amount">$ {{total}}</div>
                                        </div>
                                    </div>
                                    <div class="checkInAndOut" v-if="room.checkInAndOut">
                                        <div class="wordItem">
                                            <div class="wordTitle">Check-in time:</div>
                                            <div class="wordText">{{room.checkInAndOut.checkInEarly}} ~ {{room.checkInAndOut.checkInLate}}</div>
                                        </div>
                                        <div class="wordItem">
                                            <div class="wordTitle">Check-out time</div>
                                            <div class="wordText">{{room.checkInAndOut.checkOut}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="go" @click="go_click" :class="{error:error}">
                                    <template v-if="error">
                                        <div class="smallText">Sorry, there was a problem.</div>
                                        <div class="text">Try again!</div>
                                    </template>
                                    <template v-else>
                                        <div class="text">Reserve</div>
                                    </template>                                    
                                </div>
                                <div class="sending" v-if="sending"><div class="loader"></div></div>
                            </div>
                            <div class="resultInfo" v-else>
                                <div class="resultInfoContent" :class="{error:error}">
                                    <template v-if="error">
                                        <div class="icon">
                                            <img src="../assets/img/errorIcon.svg">
                                        </div>
                                        <div class="title">Error !</div>                                        
                                    </template>
                                    <template v-else>
                                        <div class="icon">
                                            <img src="../assets/img/confirmIcon.svg">
                                        </div>
                                        <div class="title">Great !</div>
                                        <div class="text">The reserved has been finished. We hope to see you soon. Good trip !</div>
                                    </template>
                                </div>
                                <div class="return" @click="return_click" :class="{error:error}">
                                    <template v-if="error">                                       
                                        <div class="text">Try again!</div>
                                    </template>
                                    <template v-else>
                                        <div class="text">You’ve reserved !</div>
                                    </template>                                    
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>

                        <div class="roomInfo">
                            <div class="name">{{room.name}}</div>
                            <div class="description">{{room.description}}</div>
                            <div class="block"></div>
                            <div class="descriptionShort" v-if="room.descriptionShort">
                                <div class="wordItem">
                                    <div class="wordTitle">Accommodated:</div>
                                    <div class="wordText">{{room.descriptionShort.GuestMin}} ~ {{room.descriptionShort.GuestMax}} person</div>
                                </div>
                                <div class="wordItem">
                                    <div class="wordTitle">Bathroom:</div>
                                    <div class="wordText">{{room.descriptionShort["Private-Bath"]}} room</div>
                                </div>
                                <div class="wordItem">
                                    <div class="wordTitle">Bed type:</div>
                                    <div class="wordText">
                                        <template v-for="(bed) in room.descriptionShort.Bed">
                                            {{bed}} bed
                                        </template>
                                    </div>
                                </div>
                                <div class="wordItem">
                                    <div class="wordTitle">Room size:</div>
                                    <div class="wordText">{{room.descriptionShort.Footage}} m<sup>2</sup></div>
                                </div>
                                <div class="wordItem">
                                    <div class="wordTitle">Weekday Rate</div>
                                    <div class="wordText big">$ {{room.normalDayPrice}} TWD / night</div>
                                </div>
                                <div class="wordItem">
                                    <div class="wordTitle">Weekend Rate</div>
                                    <div class="wordText big">$ {{room.holidayPrice}} TWD / night</div>
                                </div>
                            </div>
                            <div class="block"></div>
                            <div class="amenities" v-if="room.amenities">
                                <div v-for="(amenitie,key) in room.amenities" class="amenitie" :class="{active:amenitie}">
                                    <div class="icon" :class="[key]"></div>{{key}}
                                </div>
                            </div>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>  
        <div v-else class="loading" :class="{open:open}">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import selectdateboxComponent from '@/components/selectdatebox-component'
import VeeValidate from 'vee-validate'
import moment from 'moment'
import axios from 'axios' 

Vue.use(VeeValidate);
VeeValidate.Validator.extend('mobile', {
    validate: function(value){
        var re = /^[09]{2}[0-9]{8}$/;
        return re.test(value);
    }
});

export default { 
    props: {
        open:{type:Boolean,default:false},
    },   
    components: {
        'selectdatebox-component': selectdateboxComponent,
    },
    data:function(){
        return {
            room:{},            
            imgIndex:0,
            imgAnimation:false,
            imgLeft:0,
            name:"",
            phoneNumber:"",
            time:"",
            date:"",
            dateFormat:"YYYY/MM/DD",
            dateFormat01:"YYYY-MM-DD",
            booking:[],
            error:false,
            result:false,
            sending:false,
            loading:true       
        }
    },
    mounted: function() {
        /*var dateS = new Date();
        dateS.setHours(0, 0, 0);
        var dateE = new Date();
        dateE.setHours(24, 0, 0);
        this.date = moment(dateS.getTime()).format(this.dateFormat)+"~"+moment(dateE.getTime()).format(this.dateFormat);*/
        this.update(); 
        //console.log(this.open)  
        this.$emit('update:open', false);  
    },
    watch:{
        
    },
    methods: {
        update:function(){
            var that = this;
            var headers = {
                    authorization:'Bearer ZGfuVIrPXdqjzNZpUiZuvMxCnOdNyGhQD8Bd4r4jg85AEOcZyLRGtHyodRTQ',
                    accept:'application/json'
                };
            var id = this.$route.params.id;
            that.getRoom({headers:headers},id).then(function(resp){
                that.room = resp.data.room[0];
                that.booking = resp.data.booking.map(function(el){
                    return el.date;
                });
                that.loading = false;
                //console.log(resp);
            }).catch(function(err){
                //console.log(err);
            });
        },
        getRoom:function(data, id){
            if(id===undefined){
                return axios.get('https://challenge.thef2e.com/api/thef2e2019/stage6/rooms',data);
            }else{
                return axios.get('https://challenge.thef2e.com/api/thef2e2019/stage6/room/'+id,data);
            }
        },
        startImg:function(){ 
            if(!this.imgAnimation){ 
                this.imgAnimation = true;               
                requestAnimationFrame(this.updateImg);
            }
        },
        updateImg:function(){
            this.imgLeft+=(this.imgIndex - this.imgLeft)*0.1;   
            if(Math.abs(this.imgLeft-this.imgIndex)<=0.0001){
                this.imgLeft = this.imgIndex;
                this.imgAnimation = false;  
            }else{                  
                requestAnimationFrame(this.updateImg);
            }
        },
        imgIndex_click:function(index){
            this.imgIndex = index;
            this.startImg();
        },
        date_change:function(){
            //console.log('aaa');
        },
        go_click:function(){
            var that = this;
            if(!this.sending){
                this.$validator.validateAll("main").then(function(result1) {
                    //console.log(result1);
                    that.error = !result1;
                    if(result1){
                        that.sending = true;
                        var headers = {
                            authorization:'Bearer ZGfuVIrPXdqjzNZpUiZuvMxCnOdNyGhQD8Bd4r4jg85AEOcZyLRGtHyodRTQ',
                            accept:'application/json',
                            'Content-Type': 'multipart/form-data'
                        };
                        var body = {
                            name: that.name,
                            tel: that.phoneNumber,
                            date:that.getDateRange.map(function(el){
                                return moment(el).format(that.dateFormat01);
                            })
                        };
                        var bodyFormData = new FormData();
                            bodyFormData.append('name', body.name);
                            bodyFormData.append('tel', body.tel);
                            body.date.forEach(function (date, i) {
                            bodyFormData.append('date[' + i + ']', date);
                        });
                        axios.post('https://challenge.thef2e.com/api/thef2e2019/stage6/room/'+that.$route.params.id,bodyFormData,{headers:headers}).then(function(resp){
                            that.update();
                            //console.log(resp);
                            that.sending = false;                            
                            that.result = true;                           
                            that.error = false;
                        }).catch(function(err){
                            that.update();
                            //console.log(err);
                            that.sending = false;                            
                            that.result = true;                           
                            that.error = true;
                        });
                    }
                });
            }
        },
        return_click:function(){
            this.sending = false;
            this.result = false;
            this.error = false;
        }
    },
    computed:{
        getDateRange:function(){
            var dateRange = this.date.split("~");
            var temp = moment(dateRange[0], this.dateFormat).toDate();
            var dateEnd = moment(dateRange[1], this.dateFormat).toDate();
            var a = [];
            while (temp.getTime()<dateEnd.getTime()) {
                a.push(temp.getTime());
                temp.setHours(24,0,0);
            }
            return a;
        },
        amountDetailed:function(){
            var normalDayPrice = 0;
            var holidayPrice = 0;
            var dateRange = this.date.split("~");
            var temp = moment(dateRange[0], this.dateFormat).toDate();
            var dateEnd = moment(dateRange[1], this.dateFormat).toDate();
            while (temp.getTime()<dateEnd.getTime()) {
                var day = temp.getDay();
                if(day>=5&&day<=6){
                    holidayPrice++;
                }else{
                    normalDayPrice++;
                }
                temp.setHours(24,0,0);
            }
            return {normalDayPrice:normalDayPrice,holidayPrice:holidayPrice};
        },
        total:function(){
            if(!this.room||this.room.normalDayPrice===undefined||this.room.holidayPrice===undefined){
                return 0;
            }
            var temp = this.amountDetailed;
            return this.room.normalDayPrice*temp.normalDayPrice+this.room.holidayPrice*temp.holidayPrice;
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
    .table{
        position: relative;
        width: 100%;
        height: 100%;
        border-collapse: collapse;
    }
    .sending{
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        background-color: rgba(0,0,0,0.1);
    }
    .imgs{
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        font-size: 0;
        padding-right: 350px;
        box-sizing: border-box;
    }
    .imgContent{
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .img{
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: initial;
        background-position: center 70%;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .imgControl{
        position: relative;
        display: block;
        width: 100%;
        height: 0px;
        text-align: center;
        bottom: 40px;
    }
    .imgIndex{    
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-top: -5px;
        border-radius: 10px;
        box-sizing: border-box;
        border:1px solid #8C9A65;
        margin-left: 20px;
        cursor: pointer;
    }
    .imgIndex.active{
        background-color: #8C9A65;
        border:0;
    }
    .imgIndex:first-child{
        margin-left: 0px;
    }

    .roomInfo{
        font-size: 0;
        padding: 40px 30px;
        padding-top: 60px;
        position: relative;
        display: block;
        height: 100%;
        box-sizing: border-box;
    }
    .roomInfo .name{ 
        position: absolute;
        display: block;
        font-size: 50px;
        line-height: 60px;
        font-family: Futwora Pro Trial Bold;
        color: #8C9A65;
        letter-spacing: 2px;
        margin-top: -30px;
        top: 0px;
        text-shadow: 0px -1px 0px #fffc97;
    }
    .roomInfo .description{ 
        position: relative;
        display: inline-block;
        font-size: 16px;
        line-height: 19px;
        font-family: Futwora Pro Trial Medium;
        color: #8C9A65;
        letter-spacing: 0.64px;   
        width: 27.4%;
        vertical-align: top;
    }
    .roomInfo .descriptionShort{    
        position: relative;
        display: inline-block;
        /*font-size: 16px;
        line-height: 19px;*/
        font-family: Futwora Pro Trial Medium;
        /*color: #8C9A65;
        letter-spacing: 0.64px;   */
        width: 33%;
        vertical-align: top;
    }
    .roomInfo .amenities{    
        position: relative;
        display: inline-block;
        /*font-size: 16px;
        line-height: 19px;*/
        font-family: Futwora Pro Trial Medium;
        /*color: #8C9A65;
        letter-spacing: 0.64px;  */ 
        width: 33%;
        vertical-align: top;
    }
    .roomInfo .block{    
        position: relative;
        display: inline-block;
        width: 3.3%;
        vertical-align: top;
    }
    .wordItem{
        position: relative;
        display: inline-block;
        width: 50%;
        margin-bottom: 20px;
    }
    .wordTitle{
        position: relative;
        display: block;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.48px;
        color: #666666;
        opacity: 0.3;
        margin-bottom: 5px;
    }
    .wordText{
        position: relative;
        display: block;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.48px;
        color: #666666;
    }
    .wordText.big{    
        font-size: 14px;
        line-height: 19px;
        letter-spacing: 0.64px;
    }
    .amenitie{
        position: relative;
        display: inline-block;
        width: 33.333333%;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.48px;
        color: #666666;
        opacity: 0.3;
        text-decoration: line-through;
        padding-bottom: 25px;
        box-sizing: border-box;
    }
    .amenitie.active{
        opacity: 1;
        text-decoration: none;
    }
    .amenitie .icon{
        content: "";
        position: relative;
        display: inline-block;
        width: 2em;
        height: 1em;
        /*background-color: #f00;*/
        /*margin-left: -2em;*/
    }
    .amenitie .icon{    
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }
    .amenitie .icon.Wi-Fi{
        background-image: url(../assets/img/wifiIcon.svg);
    }
    .amenitie .icon.Breakfast{
        background-image: url(../assets/img/breakfastIcon.svg);
    }
    .amenitie .icon.Mini-Bar{
        background-image: url(../assets/img/miniBarIcon.svg);
    }
    .amenitie .icon.Room-Service{
        background-image: url(../assets/img/roomServiceIcon.svg);
    }

    .amenitie .icon.Television{
        background-image: url(../assets/img/televisionIcon.svg);
    }
    .amenitie .icon.Air-Conditioner{
        background-image: url(../assets/img/airConditionerIcon.svg);
    }
    .amenitie .icon.Refrigerator{
        background-image: url(../assets/img/refrigeratorIcon.svg);
    }
    .amenitie .icon.Sofa{
        background-image: url(../assets/img/sofaIcon.svg);
    }

    .amenitie .icon.Great-View{
        background-image: url(../assets/img/greatViewIcon.svg);
    }
    .amenitie .icon.Smoke-Free{
        background-image: url(../assets/img/smokeFreeIcon.svg);
    }
    .amenitie .icon.Child-Friendly{
        background-image: url(../assets/img/childFriendlyIcon.svg);
    }
    .amenitie .icon.Pet-Friendly{
        background-image: url(../assets/img/petFriendlyIcon.svg);
    }
    .top{
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
    }
    .topTr{
        height: 65%;
    }
    .table td{
        vertical-align: text-top;
        padding: 0;
    }


    .inputInfo{
        position: absolute;
        display: block;
        right: 0px;
        width: 350px;
        bottom: 0px;
        height: 100%;
        background-color: #dbe0d0;
    }
    .resultInfo{
        position: absolute;
        display: block;
        right: 0px;
        width: 350px;
        bottom: 0px;
        height: 100%;
        background-color: #dbe0d0;
    }
    .inputInfoContent{
        padding: 40px;
        padding-bottom: 60px;
        position: relative;
        display: block;
        box-sizing: border-box;
    }
    .resultInfoContent{        
        padding: 40px;
        padding-bottom: 60px;
        position: relative;
        display: block;
        box-sizing: border-box;
        text-align: center;
    }
    
    .resultInfoContent .icon{
        position: relative;
        display: block;
    }
    .resultInfoContent .icon img{
        width: 60px;
    }
    .resultInfoContent .title{
        position: relative;
        display: block;
        color: #8C9A65;
        font-family: Futwora Pro Trial Bold;
        font-size: 28px;
        line-height: 33px;
        letter-spacing: 1.12px;
        margin-top: 20px;
    }
    .resultInfoContent .text{
        position: relative;
        display: block;
        color: #8c9a65;
        font-family: Futwora Pro Trial Medium;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.64px;
        margin-top: 20px;
    }
    .resultInfoContent.error .title{
        color: #C41800;
    }
    .go{
        position: absolute;
        display: block;
        bottom: 0;
        width: 100%;
        text-align: center;
        /* padding: 20px; */
        box-sizing: border-box;
        background-color: #8C9A65;
        /* color: #fff; */
        letter-spacing: 0.8px;
        color: #EFEFEF;
        font-family: Futwora Pro Trial Regular;
        cursor: pointer;
        padding: 18px 0px;
    }
    .go.error{
        padding: 11px 0px;
        background-color: #C41800;
    }
    .go .text{        
        position: relative;
        display: block;
        font-size: 20px;
    }
    .go .smallText{
        position: relative;
        display: block;  
        font-size: 10px;
    }

    .return{
        position: absolute;
        display: block;
        bottom: 0;
        width: 100%;
        text-align: center;
        /* padding: 20px; */
        box-sizing: border-box;
        background-color: #8C9A65;
        /* color: #fff; */
        letter-spacing: 0.8px;
        color: #EFEFEF;
        font-family: Futwora Pro Trial Regular;
        cursor: pointer;
        padding: 18px 0px;
    }
    .return.error{
        padding: 11px 0px;
        background-color: #C41800;
    }
    .return .text{        
        position: relative;
        display: block;
        font-size: 20px;
    }
    .inputText {
        position: relative;
        display: block;
        color: #8c9a65;
        background-color: transparent;
        border: 0;
        width: 100%;
        font-family: Futwora Pro Trial Medium;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.64px;
        outline: 0;
    }
    .subTitle{
        position: relative;
        display: block;
        color: #666666;
        background-color: transparent;
        width: 100%;
        font-family: Futwora Pro Trial Medium;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0.48px;
        margin-bottom: 10px;
    }
    .region{    
        position: relative;
        display: block;
        margin-bottom: 30px;
    }
    .checkInAndOut {
        position: relative;
        display: block;
        font-size: 0;
    }
    .bottomLine{
        position: relative;
        display: block;
        width: 100%;
        height: 1px;
        background-color: #fff;
    }
    .total .amountDetailed{
        position: absolute;
        display: block;
        right: 0px;
        bottom: 0px;
    }
    .total .amount{
        position: relative;
        display: block;
        text-align: right;
        font-family: Futwora Pro Trial Regular;
        font-size: 24px;
        line-height: 29px;
        letter-spacing: 0.96px;
        color: #8C9A65;
        margin-top: 20px;
    }
    .errorText{
        position: relative;
        display: block;
        font-family: Futwora Pro Trial Regular;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.4px;
        color: #C41800;
    }
</style>