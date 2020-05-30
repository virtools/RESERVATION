<template>
    <div class="dateBox component">
        <div class="title">
            <div>{{typeName[type]}}</div>
            <div>
                <div class="button prev" @click="prev_click" :class="{disable:!prevBool}"></div>           
                <div class="space">
                </div>
                <div class="dateTitle">{{monthOptions[month]}} / {{year}}</div>
                <div class="space">
                </div>
                <div class="button next" @click="next_click" :class="{disable:!nextBool}"></div>
            </div>
        </div>
        <div class="value">
            <table>
                <tbody>
                    <tr>
                        <th v-for="item in week">
                            <div class="weekItem">{{item}}</div>
                        </th>
                    </tr>
                    <tr v-for="item in dayNum()">
                        <td v-for="subItem in item">
                            <div class="dateItem" :class="[!(subItem.year===year)||!(subItem.month===month)?'noCur':'',getActiveClass(subItem.year,subItem.month,subItem.date),subItem.over?'over':'']" @click="function(e){dayNum_click(e,subItem);}" v-if="(prevBool || ((subItem.year >= year) && (subItem.month >= month))) && (nextBool || ((subItem.year <= year) && (subItem.month <= month)))">
                                <div class="text">{{subItem.date}}</div>
                            </div>                            
                        </td>
                    </tr> 
                </tbody>
            </table>
        </div>      
    </div>
</template>

<script>
function getCountDays(date) {
    var d = new Date(date.getTime());
    var curMonth = d.getMonth();
    d.setMonth(curMonth + 1);
    d.setDate(0);
    return d.getDate();
}

function getDaysNum(date) {
    var d = new Date(date.getTime());
    d.setDate(1);
    var week = d.getDay();
    if(week===0){
        week+=7;
    }
    var max = getCountDays(d);
    var month = d.getMonth();
    var year = d.getFullYear();
    var num = [];
    for(var i=0;i<6*7;i++){
        num[i] = 0;
    }
    var count = 1;

    for(var i=week;i<week + max;i++){
        num[i] = {date:count,month:month,year:year};
        count++;
    }    

    d.setMonth(d.getMonth() - 1);    
    month = d.getMonth();
    year = d.getFullYear();
    count = getCountDays(d);
    for(var i=week-1;i>=0;i--){                
        num[i] = {date:count,month:month,year:year};
        count--;
    }

    d.setMonth(d.getMonth() + 2);        
    month = d.getMonth(); 
    year = d.getFullYear();
    count = 1;
    for(var i=week + max;i<num.length;i++){                
        num[i] = {date:count,month:month,year:year};
        count++;
    }
    return num;
}
import moment from 'moment'
export default {
    props: {
        value:{type:String,default:"1987/03/04~1987/03/04"},
        format:{type:String,default:"YYYY/MM/DD"},
        booking:{type:Array,default:function(){
            return [];
        }},
    }, 
    components: {
    },
    data: function () {
        return {
            mainDate:new Date(0),
            selectDate:new Date(0),
            displayDate:new Date(0),
            main_date:-1,
            main_month:-1,
            main_year:-1,
            date:-1,
            week:["Sun","Mon","Tue","Wen","Thu","Fri","Sat"],
            year:0,
            month:0,
            monthOptions:[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            ok:false,
            selectValue:"",
            dateStart:"",
            dateEnd:"",
            type:"start",
            typeName:{
                start:"select Check-in time",
                end:"select Chenk-out time"
            }
        }
    },
    mounted: function() {
        if(this.value){
            var dateRange = this.value.split("~");
            this.dateStart = dateRange[0];
            this.dateEnd = dateRange[1];
            console.log(this.dateStart,this.dateEnd);
            this.type = "start";
            this.selectValue = this.dateStart;
            this.mainDate = this.strToDate(this.selectValue, this.format); 
            //console.log(this.mainDate)  
        }else{
            this.mainDate = new Date(); 
        }             
    },
    updated:function(){
        this.ok = true;
    },
    watch: {
        mainDate:function(value){
            this.selectDate = new Date(value.getTime());            
            this.displayDate = new Date(value.getTime());
            this.main_date = value.getDate();
            this.main_month = value.getMonth();            
            this.main_year = value.getFullYear();
        },
        selectDate:function(value){
            //console.log(this.selectDate);
            this.date = value.getDate();
            this.month = value.getMonth();            
            this.year = value.getFullYear();
        },
        value:function(value){
            /*if(this.selectValue !== value){
                this.selectValue = value;
                this.mainDate = moment(value, this.format).toDate();
            }*/   
            var dateRange = this.value.split("~");
            this.dateStart = dateRange[0];
            this.dateEnd = dateRange[1];
            this.selectValue = this.type==="start"?this.dateStart:this.dateEnd;
            this.mainDate = moment(this.selectValue, this.format).toDate();
            /*console.log(value);*/
        },
        selectValue:function(value){
            //console.log(value);
            this.$emit('update:value', this.dateStart + "~" + this.dateEnd); 
            /*if(this.ok){
                this.$emit('change', value); 
            }*/          
        },
        booking:function(value){
            console.log(value);
        }
    },
    computed:{
        prevBool:function(){
            return (this.month>0) || (this.year>1900);
        },
        nextBool:function(){
            return (this.month<11) || (this.year<2099);
        }        
    },
    methods: { 
        getActiveClass:function(year, month, date){
            var temp = this.getDateTime(year,month,date);
            var start = this.strToDate(this.dateStart, this.format).getTime();
            var end = this.strToDate(this.dateEnd, this.format).getTime();
            var s = "";
            if(temp>=start&&temp<=end){                
                s+="active";
                if(temp===start){
                    s+= " start";
                }else if(temp===end){
                    s+= " end";
                }
            }
            return s;
        },
        strToDate:function(date, format){
            return moment(date, format).toDate();
        },
        getDateTime:function(year, month, date){
            return new Date(year, month, date).getTime();
        },
        valueDisplay01:function(value,options){
            if(value.text){
                return value.text;
            }else{
                return options.getOptionsText(value);
            }
        },
        dayNum_click:function(e ,item){    
            this.selectDate.setFullYear(item.year, item.month, item.date);  
            var date = moment(this.selectDate.getTime()).format(this.format);          
            if(this.type==="start"){
                var date01 = new Date(this.selectDate.getTime());
                date01.setHours(24,0,0,0);
                this.dateStart = date; 
                this.dateEnd = moment(date01.getTime()).format(this.format);     
            }else{      
                var start = this.strToDate(this.dateStart,this.format).getTime();
                var C = this.strToDate(date,this.format).getTime(); 
                if(C<start){
                    var temp = this.dateStart;
                    this.dateStart = date;
                    this.dateEnd = temp;
                }else if(C===start){

                }else{
                    this.dateEnd = date;
                }
            }
            this.selectValue = date;
            if(this.type==="start"){
                this.type = "end";
            }else{                
                this.type = "start";
            }
        },
        prev_click:function(){   
            if(this.prevBool){                  
                this.selectDate.setMonth(this.month-1);
                this.month = this.selectDate.getMonth();            
                this.year = this.selectDate.getFullYear();
            }
        },
        next_click:function(){   
            if(this.nextBool){                    
                this.selectDate.setMonth(this.month+1);
                this.month = this.selectDate.getMonth();            
                this.year = this.selectDate.getFullYear();
            }
        },
        zero:function(value){
            return (value<10?"0":"")+value;
        },
        dayNum:function(){
            //console.log(this.displayDate);
            var num = getDaysNum(this.selectDate);
            //console.log(num);
            var dayNum = [];
            for(var i=0;i<6;i++){
                dayNum[i] = [];
                for(var j=0;j<7;j++){
                    var temp = num[i*7+j];
                    var ss = temp.year+"-"+this.zero(temp.month+1)+"-"+this.zero(temp.date);                    
                    //console.log(this.booking.indexOf(ss),this.booking,ss)
                    dayNum[i][j] = {year:temp.year,month:temp.month,date:temp.date,over:this.booking.indexOf(ss)!==-1};
                }
            }
            return dayNum;
        }
    }
}
</script>

<style scoped>
    .dateBox{
        border: 1px solid #8a8a8a;
        box-sizing: border-box;
        padding: 10px;
        background-color: #fff;
        font-size: 12px;
        font-family: Futwora Pro Trial Medium;
    }
    .dateBox .button {
        position: relative;
        display: inline-block;
        text-decoration: none;
        /*padding: 0.5em;*/
        /*background-color: #1d967e;*/
        /*color: #fff;*/
        cursor: pointer;
        text-align: center;
        box-sizing: border-box;
        letter-spacing: 0.05em;
        text-indent: 0.05em;
        transition:background-color .3s,color .3s;
        user-select: none;
    }
    /*.dateBox .button:hover {
        background-color: #3dc1a7;
        color: #fff;
    }

    .dateBox .button.pale {
        background-color: #ddd;
        color: #000;
    }
    .dateBox .button.pale:hover{    
        background-color: #e7e7e7;
    }
    .dateBox .button.disable {
        background-color: #dcdcdc;
        color: #949494;
        cursor: auto;
    }*/
    .space{
        position: relative;
        display: inline-block;
        width: 0.5em;
    }
    .dateBox .title{
        position: relative;
        display: block;
        //padding: 10px;
        text-align: center;
        margin-bottom: 5px;
        line-height: 36px;
    }
    .dateBox .title .dateTitle{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        color: #666666;
        font-size: 1.2em;
    }
    .dateBox .title .prev,.dateBox .title .next{        
        position: relative;
        display: inline-block;
        width: 3em;
        height: 3em;            
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
        /*border-radius: 1.5em;*/
    }
    .dateBox .title .prev{
        background-image: url(../assets/img/prev.svg);  
        position: absolute;
        left: 0;
    }
    .dateBox .title .next{   
        background-image: url(../assets/img/next.svg);  
        position: absolute;
        right: 0;
    }
    .dateBox .title .yearItem{
        position: relative;
        display: inline-block;
    }
    .dateBox .title .monthItem{
        position: relative;
        display: inline-block;
    }
    .dateBox .value{
        position: relative;
        display: block;
    }    
    .dateBox .value table{
        position: relative;
        width: 100%; 
        table-layout: fixed;
        max-width: 350px;     
    }
    .dateBox .value .weekItem{
        position: relative;
        display: block;
        padding: 5px;
        min-width: 1em;
        text-align: center;
        box-sizing: border-box;     
        color: #666666;
    }
    .dateBox .value .dateItem{
        position: relative;
        display: block;
        padding: 5px;
        min-width: 1.2em;
        text-align: center;      
        color: #666666;
        box-sizing: border-box;
        transition: background-color .3s;
        letter-spacing: 0.48px;
    }    
    .dateBox .value .dateItem.noCur{
        opacity: 0.3
    }
    .dateBox .value .dateItem.today{                
        color: #f00;
    }
    .dateBox .value .dateItem.over{                
        color: #f00;
        text-decoration: line-through;
    }
    

    /*.dateBox .value .dateItem:hover{        
        background-color: #ddd;
    }*/
    /*.dateBox .value .dateItem.active{
        background-color: #ddd;
    }*/
    .dateBox .value .dateItem.active:before{
        content: "";
        position: absolute;
        display: block;
        width: 36px;
        height: 18px;
        background-color: #dbe0d0;
        left: 50%;
        top: 50%;
        margin-left: -18px;
        margin-top: -9px;
    }
    .dateBox .value .dateItem .text{
        position: relative;
        display: block;
        z-index: 1;
    }
    .dateBox .value .dateItem.active.start:after,
    .dateBox .value .dateItem.active.end:after{
        content: "";
        position: absolute;
        display: block;
        width: 28px;
        height: 28px;
        background-color: #8C9A65;
        left: 50%;
        top: 50%;
        border-radius: 14px;
        margin-left: -14px;
        margin-top: -14px;
    }
    .dateBox .value .dateItem.active.start,
    .dateBox .value .dateItem.active.end{    
        color: #fff;
    }
    .dateBox .value .dateItem.active.start:before{
        width: 18px;
        margin-left: 0px;
    }
    .dateBox .value .dateItem.active.end:before{
        width: 18px;
        margin-left: -18px;
    }
</style>