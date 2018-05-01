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
         </div>

         <div class="btn" style="padding:10px;">
            <flexbox>
              <flexbox-item :span="4"><x-button plain type="primary" @click.native="close()">关闭</x-button></flexbox-item>
              <flexbox-item><x-button type="primary">绑定账号</x-button></flexbox-item>
            </flexbox>   
         </div>
      </x-dialog>
</div>
</template>
<script>
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
    	}
    }
}
</script>
<style lang="less" scoped>
  .cus_agreement .cus_linke{
    text-decoration: underline;
  }
</style>