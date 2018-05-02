<template>
<div>
      <x-dialog v-model="value" is-transparent>
         <popup-header title="修改密码"></popup-header>
         <div class="loginFrom">
            <x-input type="password" placeholder='请输入您的旧密码' v-model="password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>
            <x-input type="password" placeholder='请输入您的新密码' v-model="new_password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>            
            <x-input type="password" placeholder='请重复确认您的新密码' v-model="re_password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>

         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary" @click.native="save()">立即修改</x-button></flexbox-item>
            </flexbox>   
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
			password:'',
      new_password:'',
			re_password:''
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
        this.password="";
        this.new_password="";
        this.re_password="";
        this.$emit('input', false);
      },
      save(){
        var url =util.getUrl('change');
        var oldpassword =this.password;
        var pwd = this.new_password;
        var repwd = this.re_password;
        if (pwd.length < 6 || oldpassword.length < 6 ||repwd.length < 6) {
          this.$vux.alert.show({content: "密码格式错误"});
          return false;
        }
        if (pwd != repwd) {
          this.$vux.alert.show({content: "两次密码输入不一致：" + oldpassword +','+ repwd});
          return false;
        }
        var user=util.getUserCache();
        pwd=md5(pwd);
        var urlData={
          password:md5(oldpassword),
          new_password:pwd,
          re_password:md5(repwd),
          token:user.token
        };
        util.ajaxRequestData(url,urlData, (rebackData)=> {
            util.setLog(JSON.stringify(rebackData), 3);
            if (rebackData.status) {
                var s_res=rebackData.data
                if(!s_res.code){
                    var that=this;
                    this.$vux.alert.show({
                      content: "密码修改成功！",
                      onHide() {
                        s_res.data.pwd=pwd;
                        that.close();
                        that.$store.commit('setAppInfo',{ mayInit:false });
                        that.$emit('on-handle-complete',s_res.data);
                      }
                    });
                }else{
                  this.$vux.alert.show({content: s_res.msg});
                }
            }
        });
      }
    }
}
</script>
<style>
  .cus_agreement .cus_linke{
    text-decoration: underline;
  }
</style>