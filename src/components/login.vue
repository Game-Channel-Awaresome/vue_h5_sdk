<template>
<div>
      <x-dialog v-model="value" is-transparent>
         <img class="logo" src="../assets/vux_logo.png">    
         <div class="loginFrom">
            <x-input placeholder='请输入您的账号' v-model="open_id">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-person" size="30"></x-icon>
            </x-input>
            <x-input type="password" placeholder='请输入您的密码' v-model="password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>  
            <cell value="忘记密码" is-link :style="{'padding-top':'20px'}"></cell>
         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary" @click.native="login()">登录</x-button></flexbox-item>
            </flexbox>
         </div>
         <divider>或</divider>
         <div style="padding:0 10px;">
            <cell inline-desc='没有账户？立即注册' is-link></cell>
         </div>
      </x-dialog>
</div>
</template>
<script>
import util from '@/libs/util.js';
import {md5} from 'vux';
export default{
	data(){
		return{	
			open_id:'',
			password:''
		}
	},
  	props: {
    	value: {
      		type: Boolean,
      		default: false
    	}
    },
    methods:{
      close(){
        this.$emit('input', false);
      },
      login(){
        var open_id = this.open_id;
        var pwd = this.password;

        if (open_id.length < 4) {
            this.$vux.alert.show({content: '用户名格式错误'});
            return false;
        }
        if (pwd.length < 6) {
            this.$vux.alert.show({content: '密码格式错误'});
            return false;
        }
        pwd=md5(pwd)
        var urlData={
            source:'DEFAULT',
            open_id:open_id,
            password:pwd
        }
        util.loginWay(urlData,'user',(rebackData)=>{
            util.setLog(JSON.stringify(rebackData), 3);
            if(rebackData.status){
                var s_res=rebackData.data;
                if(!s_res.code){
                    s_res.data.pwd=pwd;
                    this.$emit('on-login-complete',s_res.data);
                }
                else{
                    this.$vux.alert.show({content: s_res.msg});
                }
            }
        })
      }
    }
}
</script>
<style>
	.loginFrom{
	  padding:0 10px;
	}

	.logo {
	  margin-top:10px;
	}
</style>