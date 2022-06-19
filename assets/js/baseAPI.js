//每次调用$.get或者$.post() 或者$.ajax 的时候 都会先调用ajaxPrefilter函数， 贼这个函数中可以拿到 我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //发起真正ajax请求之前统一拼接请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // console.log(options.url);

    //统一为有权限的接口设置headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complete 回调函数
    options.complete = function (res) {
        // console.log(res);
        //在complete回调函数中可以使用responseJSON 拿到服务器相应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清空token
            localStorage.removeItem('token')
            //强制跳转页面
            location.href = '../../05 大事件后台管理/login.html'

        }
    }
})