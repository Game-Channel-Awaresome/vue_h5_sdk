import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        product_key:'',
        product_code:'',
        game_code:'ow',
        debug:false,
        isNative:0,
        version:'1.0',
        uniqueid:'9774d56d682e549o',
        mac:'9774d56d682e549c',
        idfa:'005',
        os:'H5',
        equipmentos:'7.0',
        equipmentname:'whale',
        package_code:'t20bC',
        lang:'CN',
        pf:'jingyu'
    },
    mutations: {
        setAppInfo (state, obj) {
            state=Object.assign(state,obj);
        }
    },
    actions: {

    }
});

export default store;
