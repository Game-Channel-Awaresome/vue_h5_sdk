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
              <flexbox-item><x-button type="primary">登录</x-button></flexbox-item>
            </flexbox>   
         </div>
      </x-dialog>
      <popup v-model="agreementShow" position="bottom" height="100%" :popup-style="s">
          <popup-header right-text="关闭" title="用户注册协议" @on-click-right="agreementClose()"></popup-header>
          <div style="height:calc(100% - 44px);overflow-x: hidden; overflow-y: scroll">
            <iframe  height="100%" width="100%" style="border: none;" frameborder="no" allowtransparency="yes" scrolling="auto" src="https://account.jinsdk.com/agreement.html"></iframe>            
          </div>
      </popup>
</div>
</template>
<script>
export default{
	data(){
		return{	
			open_id:'',
      password:'',
      agreementShow:false,
			agreement:true,
      s:{
        'z-index':7000
      }
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
        this.$emit('input', false);
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