import Vue from 'vue';
import { md5 } from 'vux'

const ajaxUrl ='http://120.79.137.79/LDproject/public'
let util = {
    apiUrl:'https://account.jinsdk.com/',
    seviceUrl:'https://kffaq.jinsdk.com/',
    payUrl:'https://pay.jinsdk.com/',
    app_url:'https://neice.fs.jshi1.com/indexTestSDK.html',
    url:{
        init:'appInit.php',
        login:'login.php',
        getOrderNo:'order.php',
        initSdkType:'app/native.php',
        change:'password/change.php',
        userProfile:'userProfile.php',
        logout:'logout.php'
    },
    cookieField:{uid:'',nickname:'',isLogin:false,open_id:'',password:'',token:'',identity:''},

    setCookie:function(name,value){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value);
    },
    getCookie:function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    },
    delCookie:function(_name) { 
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(_name);
        if (cval != null)
            document.cookie = _name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    setUserCache:function(obj){
        if(obj){
            this.clearAllCookie();
            this.setCookie('uid',obj.uid);
            this.setCookie('nickname',obj.nickname);
            this.setCookie('isLogin',obj.is_guest);
            this.setCookie('open_id',obj.open_id);
            this.setCookie('token',obj.token);            
            this.setCookie('identity',obj.identity);            
        }
    },
    clearAllCookie:function(){
        for(var i in this.cookieField){
            this.delCookie(i);
        }
    },
    getUserCache:function(){
        this.cookieField.uid=this.getCookie('uid')||'';
        this.cookieField.nickname=this.getCookie('nickname')||'';
        this.cookieField.isLogin=this.getCookie('isLogin')=='0'?true:false;
        this.cookieField.open_id=this.getCookie('open_id')||'';
        this.cookieField.password=this.getCookie('password')||'';
        this.cookieField.token=this.getCookie('token')||'';
        this.cookieField.identity=this.getCookie('identity')||'';
        return Object.assign({},this.cookieField)
    },
    loginInit:function(callback){
        var user= this.getUserCache();
        var useType='visitor';
        if(user.open_id&&user.isLogin){
            useType='user'
        }
        var password=user.password?user.password:md5(new Date().getTime()+'');
        this.loginWay({open_id:user.open_id,password:password},useType,function(res_data){
            callback(res_data,useType,password);
        })
    },
    loginWay:function(obj,status,callback){
        var send={
            source:'DEFAULT'
        }
        if(status=='user'){
            send.open_id=obj.open_id
            send.password=obj.password
        }else{
            send.source='GUEST'
            send.password= obj.password
            if(obj.open_id)
                send.open_id=obj.open_id
        }
        this.ajaxRequestData(this.getUrl('login'),send,function(res){
            callback(res)
        })
    },
    getUserInfo:function(callback){
        var user=this.getUserCache()
        var callbackData={
            status:true,
            data:{
                uid:user.uid,
                username:user.open_id,
                token:user.token,
                isLogin:user.isLogin
            },message:''
        }
        if(user.uid){
            callback(callbackData);
        }
    }
};



util.params=function(obj){
    var data='';

    for(var key in obj){

        data+=key+"="+obj[key]+"&"
    }
    return data.substring(0,data.length-1);
}

util.ajax=function(obj){
    var type=obj.type;
    var url=obj.url;
    var data=obj.data;
    var success=obj.success;
    var error=obj.error;
    var xhr=new XMLHttpRequest();
    if(type=='get'){
        url=obj.url+"?"+this.params(data);
        data=null;
    }

    xhr.open(type,url);
    if(type=='post'){
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept","application/json");
        data=this.params(data);
    }
    xhr.send(data);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
           var data=JSON.parse(xhr.responseText);
            success(data);
        }
        else if(xhr.readyState==4 && xhr.status!=200){
            error();
        }
    }
}

util.getUrl=function(name){
    return this.apiUrl+this.url[name];
}

util.ajaxRequestData=function(url,obj,callback){
    this.ajax({
        url:url,
        data:this.md5_sign(obj),
        type:"post",
        success:function(resData){
            callback({status:true,data:resData,message:''})
        },
        error:function(){
            callback({status:false,data:{},message:''})
            top_vue.$vux.alert.show({
              content: '网络异常！',
            })
        }
    });
}

util.md5_sign=function(obj){
    obj.time=new Date().getTime();
    var COMM=top_vue.$store.state
    if(!obj.hasOwnProperty('product_code'))
        obj.product_code=COMM.product_code;
    obj.version=COMM.version;
    obj.uniqueid=COMM.uniqueid;
    obj.mac=COMM.mac;
    obj.idfa=COMM.idfa;
    obj.os=COMM.os;
    obj.equipmentos=COMM.equipmentos;
    obj.equipmentname=COMM.equipmentname;
    obj.package_code=COMM.package_code;
    for(var i in obj){
        obj[i]=encodeURI(obj[i])
    }
    var keys=Object.keys(obj).sort();
    var key_url="";
    keys.forEach(function(j){
        key_url+=j+'='+obj[j]+'&'
    })
    key_url=key_url+COMM.product_key
    obj.sign= md5(key_url)
    return obj
}

util.setLog=function(str, level) {
    if (top_vue.$store.state.debug) {
        if (level == 1) {
            console.log('%cUI层致命错误:' + str, 'color:red');
        } else if (level == 0) {
            console.log('%cUI层警告错误:' + str, 'color:org');
        } else if (level == 3) {
            console.log('%cUI层运行日志:' + str, 'color:gray');
        } else {
            console.log('%cUI层运行日志:' + str, 'color:gray');
        }
    }
}

util.deepCopy = function(data) {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(this.deepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = this.deepCopy(data[i]);
        }
    }
    return o;
}

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
}
export default util;
