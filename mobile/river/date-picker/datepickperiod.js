/// <reference path="../../common/global.js" />
/// <reference path="jquery-ui-datepicker.js" />


var DatePickPeriod = function (param) {
    /// <summary>jquery-ui-datepicker-period</summary>
    /// <param name="param">
    /// Json格式,Ex:{jqObjBegin:$('.js_datepicker_begin'),jqObjEnd:$('.js_datepicker_end'),minTime:"2014-11-17"}
    /// </param>
    /************************参数传入*************************/
    this.jqObjBegin = param.jqObjBegin; //jquery的Doom对象Begin
    this.jqObjEnd = param.jqObjEnd; //jquery的Doom对象End
    this.minTime = param.minTime; //时间段起始时间
    //this.flagNeedSetMinTime = !(typeof (this.minTime) == 'undefined' || this.minTime == undefined);
    this.flagNeedSetMinTime = this.minTime ? true : false;

    var _this = this;
    //时间段控制设置
    this.SetPeriod = function () {
        this.jqObjBegin.attr("readonly", "readonly");
        this.jqObjEnd.attr("readonly", "readonly");

        var today = new Date();
        //默认时间赋值
        if (!this.jqObjBegin.datepicker("getDate")) {
            this.jqObjBegin.val(dateFormat(today));
        }
        if (!this.jqObjEnd.datepicker("getDate")) {
            var tommorow = new Date(Date.parse(today) + 3600 * 24 * 1000);
            this.jqObjEnd.val(dateFormat(tommorow));
        }

        //begin时间绑定
        var datepicher_begin_option = {
            onSelect: function (dateText, inst) { endtimebind(); }
        }
        if (this.flagNeedSetMinTime) datepicher_begin_option["minDate"] = this.minTime;
        this.jqObjBegin.datepicker({
            minDate: this.minTime,
            onSelect: function (dateText, inst) { endtimebind(); }
        });
        //end时间绑定
        endtimebind();
        function endtimebind() {
            setTimeout(function () {
                var beginDate = _this.jqObjBegin.datepicker("getDate");
                beginDate = new Date(Date.parse(beginDate) + 86400 * 1000);
                var minDate = dateFormat(beginDate);
                _this.jqObjEnd.datepicker("destroy");
                _this.jqObjEnd.datepicker({
                    minDate: minDate
                });
                var endDate = _this.jqObjEnd.datepicker("getDate");
                if (endDate < beginDate) {
                    _this.jqObjEnd.val(minDate);
                }
            }, 0);
        }

        function dateFormat(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1; if (m < 10) m = "0" + m;
            var d = date.getDate(); if (d < 10) d = "0" + d;
            return y + "-" + m + "-" + d;
        }
    }


    this.SetPeriod(); //时间段控制设置
}
