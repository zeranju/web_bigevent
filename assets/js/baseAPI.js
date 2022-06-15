//每次调用$.get或者$.post() 或者$.ajax 的时候 都会先调用ajaxPrefilter函数， 贼这个函数中可以拿到 我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    //发起真正ajax请求之前统一拼接请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);

})