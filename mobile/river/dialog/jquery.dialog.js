

(function () {

    //阻止事件冒泡的option对象
    var stopPropatationOption = (function () {
        function stopPropatation(e) {
            e.stopPropagation();
        }
        var spObj = {
            "click": stopPropatation,
            "scroll": stopPropatation,
            "touchstart": stopPropatation,
            "touchmove": stopPropatation,
            "touchend": stopPropatation
        }
        return spObj;
    })();

    //定义DialogItem
    var DialogItem = function (jqMain, jqTitle, jqClose, jqDialogContent, jqContent) {
        var _this = this;
        this.jqMain = jqMain;
        this.jqTitle = jqTitle;
        this.jqDialogContent = jqDialogContent; //包在this.jqContent的最近的div
        this.jqContent = jqContent;//调用插件的元素(被包装起来的原始元素)

        //设置标题
        this.setTilte = function (title) {
            $(this.jqTitle).html(title);
        }
        //设置位置及宽度
        this.setLocation = function (width, height) {
            var documentWidth = document.documentElement.clientWidth;//document的宽度
            var documentHeight = document.documentElement.clientHeight;//document的高度
            var titleHeight = jqTitle.outerHeight();//title的高度
            var frmBorder = parseInt(jqMain.css("border-width").replace(/px/, ""));//计算frm的border值
            var dialogContentPadding = parseInt(jqDialogContent.css("padding").replace(/px/, ""));//计算dialogContent的border值
            var frmHeight = height ? Math.min(height, documentHeight * 0.9) : documentHeight * 0.9;
            var frmWidth = width ? Math.min(width, documentWidth * 0.9) : documentWidth * 0.9;
            var maxContentHeight = frmHeight - titleHeight;//修正title的高度
            var dialogContentHeight = this.jqDialogContent.outerHeight();//content实际高度(20为padding修正值)
            dialogContentHeight = getValueByRange(200, maxContentHeight, dialogContentHeight);//值必须在200和屏幕高度的限制内
            frmHeight = dialogContentHeight + titleHeight;//根据dialogContent计算frm的高度
            var frmTop = (documentHeight - frmHeight) / 2 - frmBorder;//border-width值修正
            var frmLeft = (documentWidth - frmWidth) / 2 - frmBorder;//border-width值修正
            this.jqMain.css({
                height: frmHeight + "px",
                width: frmWidth + "px",
                left: frmLeft + "px",
                top: frmTop + "px"
            });
            this.jqDialogContent.css({
                "height": dialogContentHeight - 2 * dialogContentPadding + "px"
            });
        }
        //显示dialog
        this.show = function () {

            singleMask.getInstance().showMask();
            this.jqMain.css("display", "block");
        }
        //隐藏dialog
        this.close = function () {
            singleMask.getInstance().hideMask();
            this.jqMain.hide();
        }

        //从范围中获取值
        function getValueByRange(minValue, maxValue, value) {
            value = Math.min(maxValue, value);//值不能大于maxValue
            value = Math.max(minValue, value);//值不能小于mixValue
            return value;
        }

        //绑定close事件
        jqClose.bind({ "touchstart": function () { _this.close() } });

    }

    //单例Mask
    var singleMask = (function () {
        var unique;

        function getInstance() {
            if (unique === undefined) {
                unique = new Construct();
            }
            return unique;
        }

        function Construct() {
            /// <summary>单例构造函数</summary>
            this.showMask = function () {
                var jqMask = getJqMsk();//获取mask的jquery对象
                //重置位置、宽度
                var height = document.documentElement.clientHeight;
                var width = document.documentElement.clientWidth;
                jqMask.width(width + "px");
                jqMask.height(height + "px");
                //显示mask
                jqMask.show();
            }
            this.hideMask = function () {
                getJqMsk().hide();
            }

            //获取Msk
            function getJqMsk() {
                if (this.jqMask) return this.jqMask;
                else {
                    var jqMask = $(document.createElement("div"));//创建element
                    //var lastmoveY;
                    jqMask.addClass("dialog-mask")//设置样式
                        .bind(stopPropatationOption)//阻止事件冒泡
                        .appendTo("body")//添加到body中
                        .bind({//禁止touchmove的滚动默认行为
                            "touchmove": function (e) {
                                return false;
                            }
                        });
                    return this.jqMask = jqMask;
                }
            }
        }

        return {
            getInstance: getInstance
        }
    })();

    //单例DialogManager
    var singleDialogManager = (function myfunction() {

        var unique;

        function getInstance() {
            if (unique === undefined) {
                unique = new Construct();
            }
            return unique;
        }

        function Construct() {
            /// <summary>单例构造函数</summary>

            //定义dialog项的集合
            var dialogArray = [];

            //创建dialog
            this.createDialog = function (elemContent, title) {

                var jqMain = $(document.createElement("div"));//创建main元素

                var jqTitle = $(document.createElement("div"));//创建title元素
                jqTitle.addClass("dialog-title").html(title);//设置样式及内容

                var jqClose = $(document.createElement("div"));//创建close元素
                jqClose.addClass("dialog-close").html("×");//设置样式及内容

                var jqDialogContent = $(document.createElement("div"));//创建content元素
                jqDialogContent.addClass("dialog-content").append(elemContent);//设置样式及内容

                var lastmoveY, elemDialogContent = jqDialogContent.get(0);
                jqMain.addClass("dialog-frm")//设置main元素
                    .append(jqTitle)//添加titile元素
                    .append(jqClose)//添加close元素
                    .append(jqDialogContent)//添加content元素
                    .appendTo("body")//添加到body中
                    .bind(stopPropatationOption)//阻止事件冒泡
                    .bind({
                        "touchstart": function (e) {//touchstart事件
                            var touches = e.originalEvent.touches;
                            var x = touches[touches.length - 1].clientX;
                            var y = touches[touches.length - 1].clientY;
                            lastmoveY = y;
                        },
                        "touchmove": function (e) {//touchstart事件
                            var touches = e.originalEvent.touches;
                            var x = touches[touches.length - 1].clientX;
                            var y = touches[touches.length - 1].clientY;
                            //var a = "touchmove:" + x + "," + y + "<br/>lastmoveY:" + lastmoveY + "<br/>";
                            //a += "scrollTop:" + elemDialogContent.scrollTop + "<br/>scrollHeight:" + elemDialogContent.scrollHeight;
                            //a += "<br/>scrollBottom:" + (elemDialogContent.clientHeight + elemDialogContent.scrollTop - elemDialogContent.scrollHeight)
                            //$(".dialog-mask").html(a);
                            if (elemDialogContent.scrollTop == 0) {
                                if (lastmoveY < y) e.preventDefault();
                            }
                            if (elemDialogContent.clientHeight + elemDialogContent.scrollTop - elemDialogContent.scrollHeight >= 0) {
                                if (lastmoveY > y) e.preventDefault();
                            }
                            lastmoveY = y;
                        }
                    });

                var dialogItemObj = new DialogItem(jqMain, jqTitle, jqClose, jqDialogContent, $(elemContent));//创建DialogItem类的对象
                dialogArray.push(dialogItemObj);//加入dialog集合
                $(elemContent).show();

                return dialogItemObj;

            }

            //获取DialogItem by elemContent
            this.getDialogItemByElemcontent = function (elemContent) {
                for (var i in dialogArray) {
                    if (dialogArray[i].jqContent.get(0) == elemContent) {
                        return dialogArray[i];
                    }
                }
            }
        }

        return {
            getInstance: getInstance
        }
    })();

    //dialog插件
    $.fn.dialog = function (paras) {
        /// <summary>dialog插件</summary>
        /// <param name="paras">
        ///     {
        ///         title:标题
        ///         close:true
        ///         width:数值型
        ///         height:数值型
        ///     }
        /// </param>
        paras = paras || {};

        var dialogManager = singleDialogManager.getInstance();
        var existedDialogItem = dialogManager.getDialogItemByElemcontent(this.get(0));//检查并获取已存在的dialog
        if (paras.close) { existedDialogItem.close(); return; }//若是关闭指令，直接关闭
        var dialogItem;
        if (existedDialogItem) {//若已存在dialog
            if (paras.title) existedDialogItem.setTilte();//若有必要,设置标题
            dialogItem = existedDialogItem;
        } else {//若不存在dialog
            var title = paras.title || "您好";
            var dialogItem = dialogManager.createDialog(this.get(0), title); //创建dialog
        }
        dialogItem.show();//显示dialog
        dialogItem.setLocation(paras.width, paras.height);//设置位置
    };

})();

