<template>
<div>
      <x-dialog v-model="value" is-transparent>
         <popup-header title="实名认证"></popup-header>
         <div class="loginFrom">
            <p style="text-align: left;margin: 10px 0;">
                您好，根据文化部<span style="color: red;">《互联网文化管理暂行规定》</span>
                和<span style="color: red;">《网络游戏管理暂行办法》</span>
                对于移动网络市场的相关规定及要求，游戏用户需要登记如下个人信息：
            </p>
            <x-input placeholder='请输入您的真实姓名' v-model="realname">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="ios-person" size="30"></x-icon>
            </x-input>
            <x-input placeholder='请输入您的身份证号' v-model="identity">
              <x-icon slot="label" style="padding-right:10px;fill:rgb(21, 147, 202)" type="card" size="30"></x-icon>
            </x-input>
         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary" @click.native="save()">登录</x-button></flexbox-item>
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
			identity:'',
      realname:''
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
      save(){
        var url =util.getUrl('userProfile');
        var realname =this.realname;
        var idcard = this.identity;

        if (!realname.length) {
          this.$vux.alert.show({content: "请填写真实姓名"});
          return false;
        }
        if (idcard.length != 15 && idcard.length != 18) {
          this.$vux.alert.show({content: "身份证号码格式错误"});
          return false;
        }
        var user=util.getUserCache()
        var urlData={
          identity:idcard,
          realname:realname,
          token:user.token
        };
        util.ajaxRequestData(url,urlData, (rebackData)=> {
            util.setLog(JSON.stringify(rebackData), 3);
            if (rebackData.status == true) {
                var s_res=rebackData.data;
                if(!s_res.code){
                    var that=this;
                    this.$vux.alert.show({
                      content: "您的账号实名信息已提交成功",
                      onHide() {
                        that.close();
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