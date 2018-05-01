<template>
  <div style="height:100%;">
    <div class="menu" v-show="assistive">
      <group title="demo">
        <x-button @click.native='loginShow=true'>登陆</x-button>
        <x-button @click.native='registerShow=true'>注册</x-button>
        <x-button @click.native='changePasswordShow=true'>修改密码</x-button>
        <x-button @click.native='realNameShow=true'>实名认证</x-button>
        <x-button @click.native='boundShow=true'>绑定账号</x-button>
      </group>
    </div>
    <iframe id="gameFrame" class="gameFrame" height="100%" width="100%" style="border: none;" scrolling="no" allowtransparency="yes" :src="app_url"></iframe>

    <login v-model="loginShow" @on-login-complete="loginCallback"></login>
    <register v-model="registerShow"></register>
    <change-password v-model="changePasswordShow"></change-password>
    <real-name v-model="realNameShow"></real-name>
    <bound v-model="boundShow"></bound>
  </div>
</template>

<script>
import login from './login.vue';
import register from './register.vue';
import changePassword from './changePassword.vue';
import realName from './realName.vue';
import bound from './bound.vue';
import util from '@/libs/util.js';
//回调专用变量
var callbackFun = null;
var callbackFunInit=null
export default {
  data () {
    return {
      loginShow:false,
      registerShow:false,
      changePasswordShow:false,
      realNameShow:false,
      boundShow:false,
      assistive:false,
      app_url:''
    }
  },
  mounted(){
    var that=this;
    window.addEventListener('message', function(e) {
        var messageData = e.data;
        try {
            var messageObject = JSON.parse(messageData);
        } catch (e) {
            var messageObject = null;
        }
        if (!messageObject || typeof(messageObject) != 'object' || !messageObject.hasOwnProperty('func')) {
            return;
        }
        var funcName = messageObject.func;
        switch (funcName) {

            case 'Event_Login':
                // that.showLoginViews(function(res) {
                //     var returnObject = new Object();
                //     returnObject.func = 'Notify_Login';
                //     returnObject.params = res;
                //     document.getElementById('gameFrame').contentWindow.postMessage(JSON.stringify(returnObject), '*');
                // });
                break;

            case 'Event_Pay':

                // that.showPayViews(messageObject.params, function(res) {
                //     var returnObject = new Object();
                //     returnObject.func = 'Notify_payStatus';
                //     returnObject.params = res;
                //     document.getElementById('gameFrame').contentWindow.postMessage(JSON.stringify(returnObject), '*');
                // });
                break;

            case 'Event_Logout':
                // that.showLogOutViews(function(res){
                //     var returnObject = new Object();
                //     returnObject.func = 'Notify_Logout';
                //     returnObject.params = res;
                //     document.getElementById('gameFrame').contentWindow.postMessage(JSON.stringify(returnObject), '*');
                // });
                break;

            case 'Event_pushMessage':
                var messageObject = new Object();
                messageObject.closeTime = 10;
                messageObject.avatarUrl = params.sendAvatarUrl;
                var messageContent = params.message;
                messageContent = messageContent.replace(/<\/?.+?>/g, "");
                messageObject.retMsg = params.sendNickName + ":" + messageContent;
                //that.noteUserMsg(messageObject);
                break;

            case 'Event_ToggleMenu':
                //that.showToggleModalMenu(messageObject.params);
                break;

            case 'Event_uploadRole':
                //that.triggerAd_updateRole(messageObject.params);
                break;
                
            case 'Event_uploadConsumption':
                //that.triggerAd_uploadConsumption(messageObject.params);
                break;                

            case 'Event_OpenService':
                //that.openOnlineServiceCallback(messageObject.params);
                break;

            case 'Event_GetUserInfo':
                util.getUserInfo(function(res){
                    var returnObject = new Object();
                    returnObject.func = 'Notify_GetUserInfo';
                    returnObject.params = res;
                    document.getElementById('gameFrame').contentWindow.postMessage(JSON.stringify(returnObject), '*');
                })
                break;

            case 'Event_Init':
                that.sdkInit(messageObject.params,function(res){
                    var returnObject = new Object();
                    returnObject.func = 'Notify_Init';
                    returnObject.params = res;
                    document.getElementById('gameFrame').contentWindow.postMessage(JSON.stringify(returnObject), '*');
                });
                break;
        }
    }, false);
  },
  created(){
    this.getDeviceInfo();
    this.refreshGame();
  },
  components:{
    login,
    register,
    changePassword,
    realName,
    bound
  },
  methods:{
    sdkInit(obj,callback){
      callbackFunInit=callback;
      this.$store.commit('setAppInfo',{
        product_key:obj.productKey,
        product_code:obj.productCode,
        game_code:obj.gameCode,
        debug:obj.debug,
      });
      util.ajaxRequestData(util.getUrl('initSdkType'),{},(res)=>{
          if(res.status&&!res.data.code){
              this.$store.commit('setAppInfo',{
                isNative:res.data.data.is_native
              });
              var comm=this.$store.state

              if(comm.isNative&&window.WhaleSdk){
                  this.assistive=false
                  var o=obj?JSON.stringify(obj):'';
                  WhaleSdk.init(o)
                  return;
              }
              this.h5Init()
          }
      });
    },
    getDeviceInfo(){
        var obj={};
        if(window.WhaleSdk){
           obj=JSON.parse(WhaleSdk.getDeviceInfo());
        }

        this.$store.commit('setAppInfo',obj);

        var isNative=this.$store.state.isNative;

        if(isNative=='0'){
            this.$store.commit('setAppInfo',{isNative:false});
        }else{
            this.$store.commit('setAppInfo',{isNative:true});
        }
    },
    h5Init(){
      util.ajaxRequestData(util.getUrl('init'),{},(res)=>{
          if(res.status){
              var s_data=res.data;
              if(!s_data.code){
                  this.assistive=true;
                  this.$store.commit('setAppInfo',s_data.data);
                  util.loginInit((res,useType,password)=>{
                    this.loginHandle(res,callbackFunInit,useType,password)
                  });
              }
              else{
                  callbackFunInit({status:false})
              }
          }else{
              callbackFunInit({status:false})
              util.setLog(res.message,1);
          }
      });
    },
    loginHandle(res_data,callback,useType,password){
        var s_res=res_data.data;
        if(res_data.status){
          if(!s_res.code){
              util.setUserCache(s_res.data);
              this.setServiceViewsStatu(useType);
              util.setCookie('password',password);
              if(useType=='user')
                  this.realNameView(s_res.data);
              if(callback)
                  callback({status:true});
          }
          else{
              if(callback)
                  callback({status:false});

              this.$vux.alert.show({
                content: s_res.msg,
                onHide () {
                  this.setServiceViewsStatu('none');
                  this.showLoginViews()
                }
              })
          }
        }else{
          if(callback)
              callback({status:false});
        }
    },
    refreshGame(){
        var app_url=this.$store.state.app_url||util.app_url
        this.app_url=app_url+'?t='+new Date().getTime(); 
    },
    setServiceViewsStatu(status){

    },
    realNameView(obj){

    },
    showLoginViews(callback){
      this.loginShow=true;
    },
    loginCallback(obj){
        util.setUserCache(obj);
        //this.setServiceViewsStatu('user');
        util.setCookie('password',obj.pwd);
        this.refreshGame();
        this.realNameView(obj);
        //判断是否实名
        if(COMM.real_name_auth===1&&!obj.identity){
            this.realNameShow=true;
        }
    }
  }
}
</script>

<style lang="less" scoped>
  .menu{
    position: fixed;
    width: 100px;
    right: 0;
    bottom: 20px;
  }
</style>
