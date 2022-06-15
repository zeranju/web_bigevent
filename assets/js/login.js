$(function () {
    //点击去注册账号
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到确认密码框内容拿到密码框内容比对判断失败返回提示消息
            var pwd = $('.reg-box [name=password]').val() //属性选择器
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    //侦听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        // 发起ajax的post请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('http://www.liulongbin.top:3007/api/reguser', data,
        function (res) {
            if(res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // console.log('注册成功');
            layer.msg('注册成功,请登录！')
            //模拟人的点击行为
            $('#link_login').click()
        })
    })
    // 侦听登录表单提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: 'http://www.liulongbin.top:3007/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')
                //将得到的token存储到localstorage中
                localStorage.setItem('token', res.token)
                // console.log(res.token);
                //跳转到后台主页
                // location.href = '../../index.html'
            }
        })
    })
})