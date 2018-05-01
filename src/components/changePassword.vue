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
              <flexbox-item><x-button type="primary">立即修改</x-button></flexbox-item>
            </flexbox>   
         </div>
      </x-dialog>
</div>
</template>
<script>
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
        this.$emit('input', false);
      }
    }
}
</script>
<style>
  .cus_agreement .cus_linke{
    text-decoration: underline;
  }
</style>