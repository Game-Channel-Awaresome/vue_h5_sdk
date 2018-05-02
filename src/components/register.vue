<template>
<div>
      <x-dialog v-model="value">
         <popup-header title="注册账号"></popup-header>
         <div class="loginFrom">
            <x-input placeholder='请输入您的账号' v-model="open_id">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-person" size="30"></x-icon>
            </x-input>
            <x-input type="password" placeholder='请输入您的密码' v-model="password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>
            <cell>
              <div class="cus_agreement">
                <check-icon :value.sync="agreement"></check-icon><span class="cus_linke" @click="agreementShow = true">同意用户注册协议</span>
              </div>
            </cell>
         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary" @click.native="save()">提交</x-button></flexbox-item>
            </flexbox>   
         </div>
      </x-dialog>
      <popup v-model="agreementShow" position="bottom" height="100%" :popup-style="{'z-index':7000}">
          <popup-header right-text="关闭" title="用户注册协议" @on-click-right="agreementClose()"></popup-header>
          <div style="height:calc(100% - 44px);overflow: hidden;">
            <iframe  height="100%" width="100%" style="border: none;" frameborder="no" allowtransparency="yes" scrolling="auto" src="https://account.jinsdk.com/agreement.html"></iframe>            
          </div>
      </popup>
</div>
</template>
<script>
import util from '@/libs/util.js';
import {md5} from 'vux';
export default{
	data(){
		return{	
			open_id:'',
      password:'',
      agreementShow:false,
			agreement:true,
		}
	},
  	props: {
    	value: {
      		type: Boolean,
      		default: false
    	}
    },
    methods:{
      agreementClose(){
        this.agreementShow=false;
      },
      close(){
        this.open_id='';
        this.password='';
        this.$emit('input', false);
      },
      save(){
        var url = util.getUrl('register');
        var open_id = this.open_id;
        var pwd =this.password;
        var checkUName =util.checkUname(open_id);
        if (checkUName.status == false) {
            this.$vux.alert.show({content: checkUName.msg});
            return false;
        }

        if (pwd.length < 6 || pwd.length > 16) {
            this.$vux.alert.show({content: "密码格式错误"});
            return false;
        }
        if (!this.agreement) {
            this.$vux.alert.show({content: "请同意用户注册协议"});
            return false;
        }
        pwd=md5(pwd)
        var urlData={
            source:'DEFAULT',
            open_id:open_id,
            password:pwd
        }
        util.ajaxRequestData(url, urlData, (rebackData)=> {
            util.setLog(JSON.stringify(rebackData), 3);
            if (rebackData.status) {
                var s_res=rebackData.data
                if(!s_res.code){
                  s_res.data.pwd=pwd;
                  this.close();
                  this.$store.commit('setAppInfo',{ mayInit:false });
                  this.$emit('on-handle-complete',s_res.data);
                }else{
                  this.$vux.alert.show({content: s_res.msg});
                }
            }
        });
      }
    }
}
</script>
<style lang="less" scoped>
  .cus_agreement {
    margin-top: 10px;
  }
  .cus_agreement .cus_linke{
    text-decoration: underline;
  }
</style>