<template>
<div>
      <x-dialog v-model="value">
         <popup-header title="绑定账号"></popup-header>
         <div class="loginFrom">
            <x-input placeholder='请输入您的账号' v-model="open_id">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-person" size="30"></x-icon>
            </x-input>
            <x-input type="password" placeholder='请输入您的密码' v-model="password">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>
            <x-input type="password" placeholder='请重复输入您的密码' v-model="repassword">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-locked" size="30"></x-icon>
            </x-input>            
         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary" @click.native="save()">绑定账号</x-button></flexbox-item>
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
			open_id:'',
      password:'',
      repassword:'',
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
          this.open_id='';
          this.password='';
          this.repassword='';
        	this.$emit('input', false);
    	},
      save(){
        var url = util.getUrl('rename');
        var open_id = this.open_id;
        var pwd = this.password;
        var repwd = this.repassword;
        var checkUName =util.checkUname(open_id);
        if (!checkUName.status) {
          this.$vux.alert.show({content: checkUName.msg});
          return false;
        }

        if (pwd.length < 6|| repwd.length < 6) {
          this.$vux.alert.show({content: "密码格式错误"});
          return false;
        }
        if (pwd != repwd) {
          this.$vux.alert.show({content: "两次密码输入不一致：" + pwd +" , "+ repwd});
          return false;
        }
        pwd=md5(pwd)
        var user=util.getUserCache();
        var urlData={
            source:'DEFAULT',
            open_id:open_id,
            password:pwd,
            re_password:md5(repwd),
            token:user.token
        }
        util.ajaxRequestData(url, urlData, (rebackData)=> {
            util.setLog(JSON.stringify(rebackData), 3);
            if (rebackData.status) {
                var s_res=rebackData.data
                if(!s_res.code){
                  var that=this;
                  this.$vux.alert.show({
                    content: "绑定成功！ ",
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
<style lang="less" scoped>
  .cus_agreement .cus_linke{
    text-decoration: underline;
  }
</style>