$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //定义美化时间过滤器
    template.defaults.imports.dataFormate = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义查询参数对象，请求数据时，需将其提交到服务器
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,    //	每页显示多少条数据
        cate_id: '',    //文章分类的 Id
        state: '',  //文章的状态
    }

    //获取文章列表数据的方法
    initTable()
    initCate()

        //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // console.log(res);
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //通过 layui 重新渲染表单区域 UI 结构
                form.render()
            }
        })
    }

    //未筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格数据
    })

    //定义渲染分页方法
    function renderPage(total) {
        //掉方法渲染分页

        laypage.render({
            elem: 'pageBox', //分页容器ID
            count: total, //总数据条数
            limit: q.pagesize,//每页显示条数
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count','limit','prev', 'page', 'next','skip'],
            limits: [2,3,5,10],
            // 分页发生切换时，触发jump回调
            jump: function(obj, first) {
                console.log(obj.curr);
                //最新页码值赋值给q
                q.pagenum = obj.curr
                //根据最新q获取对应数据列表并渲染表格
                // 把最新条目数赋值
                q.pagesize = obj.limit
                //判断first值判断触发方式first为true方式二触发
                if(!first) {
                    initTable()
                }
            }
        })
    }
    //通过代理为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        //询问用户是否删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
           $.ajax({
            methos: 'GET',
            url: '/my/article/delete/'+id,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                //数据删除玩成之后，判断是否有剩余数据，没有数据页码值-1重新调用initTable（）
                if(len === 1) {
                    //len=1删除完之后页面没有数据
                    q.pagenum = q.pagenum === 1? 1 : q.pagenum - 1
                }
                initTable()
            }
           })

            layer.close(index);
          });
    })
})