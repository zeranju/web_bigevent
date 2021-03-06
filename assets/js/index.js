$(function () {
    // 调用函数获取用户信息
    getUserInfo();

    var layer = layui.layer
    //点击按钮实现退出功能
    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储token
            localStorage.removeItem('token')
            // 跳出登录页面
            location.href = '../../05 大事件后台管理/login.html'

            //关闭 confirm 询问框
            layer.close(index);
        });
    })

})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用函数渲染用户头像
            renderAvatar(res.data);
        },
        //不论成功还是失败都会调用complete
        // complete: function (res) {
        //     console.log(res);
        //     //在complete回调函数中可以使用responseJSON 拿到服务器相应的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '../../05 大事件后台管理/login.html'
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    // 获取用户名
    var name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}