$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    //定义发表文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用form.render()方法渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverFile的change是事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取文件列表数组
        var files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        //我裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    var art_state = '已发布'
    //为存为草稿绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于表单创建一个formData对象
        var fd = new FormData($(this)[0])
        //将文章发布状态存入fd
        fd.append('state', art_state)

        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })
        //将封面裁剪后的图片输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                 // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到fd中
                fd.append('cover_img', blob)
                //发起ajax数据请求
                publishArticle(fd)
            })

    })
    //定义发布文章的方法
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交formdata格式数据
            contentType: false,
            processData: false,
            sucess: function() {
                if(res.status !==0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布成功后跳转页面
                location.href = '../article/art_list.html'
            }
        })
    }
})