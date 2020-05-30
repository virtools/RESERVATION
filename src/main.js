import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'

if (typeof Object.singleLayerComparison != 'function') {
    Object.defineProperty(Object, "singleLayerComparison", {
        value: function(target, varArgs) {
            var a = {};
            var bool = false;
            for(var temp in target){
                if(varArgs[temp]!=undefined){
                    if(typeof(target[temp])=="object" && !(JSON.stringify(target[temp])==JSON.stringify(varArgs[temp]))){
                        a[temp] = varArgs[temp];
                        bool = true;
                    }else if(!(target[temp].toString()==varArgs[temp].toString())){
                        a[temp] = varArgs[temp];
                        bool = true;
                    }  
                }                             
            }
            //console.log(target,varArgs)
            if(bool){
                return a;
            }
            return null;
        },
        writable: true,
        configurable: true
    });
}
/*Object.defineProperty(Array.prototype, "getOptionsText", {
    value: function(value) { 
        for(var temp in this){
            if(this[temp].value == value){
                return this[temp].text;
            }
        }
        return value;
    },
    writable: false,
    configurable: true,
    enumerable:false
});*/
Object.defineProperty(HTMLElement.prototype, "comparisonParentElement", {
    value: function(element) {
        function comparison(srcElement,element){
            var temp = srcElement;
            while (temp) {
                if(temp===element){
                    return true;
                }
                temp = temp.parentElement;
            }
            return false;
        }
        return comparison(this,element);
    },
    writable: false,
    configurable: true,
    enumerable:false
});
Vue.config.productionTip = false
new Vue({
	router,
  	render: h => h(App),
}).$mount('#app')
