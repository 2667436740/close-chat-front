export default {
    install(Vue) {
        // 公共方法
        Vue.prototype.Utils = {
            // md5加密
            getMd5(param) {
                let md5 = crypto.createHash("md5");
                md5.update(param);
                let newParam = md5.digest("hex");
                return newParam;
            },
            //DES加密
            encryptByDES(message, key) {
                let keyHex = CryptoJS.enc.Utf8.parse(key);
                let encrypted = CryptoJS.DES.encrypt(message + '', keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.ciphertext.toString();
            },
            //DES ,ECB模式解密
            decryptByDES(ciphertext, key) {
                let keyHex = CryptoJS.enc.Utf8.parse(key);
                let decrypted = CryptoJS.DES.decrypt({
                        ciphertext: CryptoJS.enc.Hex.parse(ciphertext + '')
                    },
                    keyHex, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                );
                let result_value = decrypted.toString(CryptoJS.enc.Utf8);
                return result_value;
            },
            //日期格式化
            formatDate(fmt, mydatecs) {
                if (!mydatecs) return "";
                var mydate = new Date(mydatecs);
                var o = {
                    "Y+": mydate.getFullYear(),
                    "M+": mydate.getMonth() + 1, //月份
                    "d+": mydate.getDate(), //日
                    "h+": mydate.getHours(), //小时
                    "m+": mydate.getMinutes(), //分
                    "s+": mydate.getSeconds(), //秒
                    "q+": Math.floor((mydate.getMonth() + 3) / 3), //季度
                    S: mydate.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1);
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        //
                        if (k == "Y+") {
                            fmt = fmt.replace(RegExp.$1, o[k]);
                        }
                        fmt = fmt.replace(
                            RegExp.$1,
                            RegExp.$1.length == 1 ?
                            o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length)
                        );
                    }
                }
                return fmt;
            },
            // 必传参数，随机
            getRandom() {
                return 1;
            },
            // 必传参数，鉴别
            getAuth() {
                return this.getMd5(this.getRandom() + "estudy");
            },
            //产生一个数字和字母结合的随机值
            randomWord(randomFlag, min, max) {
                let str = "",
                    range = min,
                    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

                // 随机产生
                if (randomFlag) {
                    range = Math.round(Math.random() * (max - min)) + min;
                }
                for (var i = 0; i < range; i++) {

                    str += arr[Math.round(Math.random() * (arr.length - 1))];
                }
                return str;
            },
            // 文件大小转换
            getBytesToSize(bytes) {
                if (!bytes && bytes !== 0) return "";
                let sizes = ["b", "KB", "MB", "GB", "TB"];
                if (bytes == 0) return "0 b";
                let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
            },
            // 每三位加逗号（从后往前）
            toThousands(numcs) {
                var num = (numcs || 0).toString(),
                    result = '';
                while (num.length > 3) {
                    result = ',' + num.slice(-3) + result;
                    num = num.slice(0, num.length - 3);
                }
                if (num) { result = num + result; }
                return result;
            },
            //判断特殊字符
            judgespecial(text) {
                let regArr = ["\\", "/", ":", "*", '?', "\"", "<", '>', '|', ';', '=', '&', '$', '%', '@', '\'', '(', ')'];
                for (let index = 0, len = regArr.length; index < len; index++) {
                    if (text.indexOf(regArr[index]) >= 0) {
                        return true
                    }
                }
            },
            // 判断是否全为特殊字符
            judgespecialAll(value) {
                //  （\/:*?"<>|;=&$%@'）
                let regArr = ["\\", "/", ":", "*", '?', "\"", "<", '>', '|', ';', '=', '&', '$', '%', '@', '\'', '(', ')'];
                for (let index = 0, len = regArr.length; index < len; index++) {
                    if (value.indexOf(regArr[index]) >= 0) {
                        let i = 0
                        i += 1
                        if (i == value.length) {
                            return true
                        }
                    }
                }
            },
            /**
             * // 判断当前对象是否含有某个属性。
             * @param {*} obj
             * @param  {...any} arg
             * @return Boolean
             */
            hasData(obj, ...arg) {
                if (this.isEmpty(obj)) {
                    return false;
                }
                var nameList = Object.getOwnPropertyNames(obj);
                for (var i = 0; i < arg.length; i++) {
                    let argItem = arg[i];
                    if (nameList.indexOf(argItem) < 0) {
                        return false;
                    }
                    if (obj[arg[i]] == null || obj[arg[i]] == "") {
                        return false;
                    }
                }

                return true;
            },
            /**
             * 判断当前数据是否为空
             * @param {*} $obj
             * @return Boolean
             */
            isEmpty(obj) {
                if (typeof obj == "number" || typeof obj == "boolean" || typeof obj == "string") {
                    if (obj === "") {
                        return true;
                    }
                    return false;
                }

                if (!obj) {
                    return true;
                }

                return Object.keys(obj).length == 0
            },
            // 防抖函数
            debounce(fn, delay) {
                var delayTime = delay || 200;
                var timer;
                return function() {
                    var th = this;
                    var args = arguments;
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function() {
                        timer = null;
                        fn.apply(th, args);
                    }, delayTime);
                };
            },
            //节流函数
            throttle(func, wait) {
                let timeout;
                return function() {
                    let context = this;
                    let args = arguments;
                    if (!timeout) {
                        timeout = setTimeout(() => {
                            timeout = null;
                            func.apply(context, args)
                        }, wait)
                    }

                }
            },
            // 获取地址参数
            getParams(localHref) {

                let localArr = decodeURI(localHref).split('?');
                if (localArr.length <= 1) {
                    return null;
                }
                let paramStr = localArr[1];
                let paramsArr = paramStr.split('&');
                let params = {};
                for (let param of paramsArr) {
                    let queryArr = param.split('=');
                    params[queryArr[0]] = queryArr[1];
                }
                return params;
            },
            //保留?位小数，浮点数四舍五入，位数不够不补0
            fomatFloat(src,pos) {
                return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
            },
            //数量超过999按 1.0k显示
            numberChange(num){
              let result;
              if(num>999 &&num<=9999){
                result=String(num/1000).substr(0,3)+'k';
              }else if(num>9999 && num<=99999){
                result=String(num/10000).substr(0,3)+'w';
              }else if(num>99999){
                result='10w+';
              }else{
                result=num
              }
              return result
            },
            //当天时间显示:今天+时分 昨天时间显示:昨天+时分  今年内 显示：月日  其他原文显示 
            dealTime(time){
              let nowDate=new Date(),myDate=new Date(time),resTime;
              let nowDay=nowDate.getDate(),nowYear=nowDate.getFullYear();
              let o={
                  "Y": myDate.getFullYear(),
                  "M": myDate.getMonth() + 1, //月份
                  "d": myDate.getDate(), //日
                  "h": myDate.getHours(), //小时
                  "m": myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes(), //分
              };
              if(nowYear == o.Y && nowDay == o.d){
                resTime='今天'+' '+o.h+':'+o.m;
              }else if(nowYear == o.Y && (nowDay-1)== o.d){
                resTime='昨天'+' '+o.h+':'+o.m;
              }else if(nowYear == o.Y && (nowDay-1)>o.d){
                resTime=o.M+'-'+o.d;
              }else{
                resTime=o.Y+'-'+o.M+'-'+o.d;
              }
              return resTime
            },
        };
    }
};