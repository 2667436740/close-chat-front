// 星期格式转换 0-6：周日到周六
function weekFormat(e, prefix = "周") {
	switch (e) {
		case 0:
			return prefix + "日"
			break;
		case 1:
			return prefix + "一"
			break;
		case 2:
			return prefix + "二"
			break;
		case 3:
			return prefix + "三"
			break;
		case 4:
			return prefix + "四"
			break;
		case 5:
			return prefix + "五"
			break;
		case 6:
			return prefix + "六"
			break;
		default:
			return ""
			break;
	}
}
// 转换今日的时辰格式
function todayTimeFormat(e) {
	if (e >= 0 && e < 7) {
		return "凌晨"
	} else if (e >= 7 && e < 11) {
		return "上午"
	} else if (e >= 11 && e < 13) {
		return "中午"
	} else if (e >= 13 && e < 18) {
		return "下午"
	} else if (e >= 18 && e < 24) {
		return "晚上"
	} else {
		return ""
	}
}
// 是否显示周几
function isShowWeekDay(sub, weekDay) {
	const currentWeekDay = new Date().getDay()
	const dayTime = 1000 * 60 * 60 * 24
	// 1.当前时间与消息时间相差必须大于2天小于7天
	// 2.当前时间距离本周一相差必须大于2天且小于当前距离周一的天数
	// 3.消息时间不可能是0-周日，因为周日没有给后面时间留空间，不会走这里的逻辑，而是走今天的逻辑
	if (sub >= dayTime * 2 && weekDay !== 0 && sub <= dayTime * currentWeekDay) {
		return true
	} else {
		return false
	}
}
//时间格式化兼容 ios
function formatTime2(fmt, timestamp) {
	var date = new Date(timestamp) // 兼容safari
	var o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),
		'S': date.getMilliseconds()
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[
				k]).length)))
		}
	}
	return fmt
}

export default {
	//生成一个用不重复的ID
	getUuid(randomLength){
	 return Number(Math.random().toString().substr(2) + new Date().getTime()).toString(36)
	},
	//首页列表时间转化
	dateTime(e) {
		let old = new Date(e)
		let now = new Date()
		//获取old时间
		let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getYear()
		let M = old.getMonth()
		let D = old.getDate()
		//获取now时间
		let nd = now.getTime()
		let nh = now.getHours()
		let nm = now.getMinutes()
		let nY = now.getYear()
		let nM = now.getMonth()
		let nD = now.getDate()

		//当天时间
		if (Y === nY && M === nM && D === nD) {
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return h + ':' + m
		}

		//昨天时间
		if (Y === nY && M === nM && D + 1 === nD) {
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return '昨天' + h + ':' + m
		} else {
			//大于两天
			return Y + '/' + M + '/' + D
		}
	},

	//聊天界面时间转化
	dateTime1(e) {
		let old = new Date(e)
		let now = new Date()
		//获取old时间
		let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getYear()
		let M = old.getMonth()
		let D = old.getDate()
		//获取now时间
		let nd = now.getTime()
		let nh = now.getHours()
		let nm = now.getMinutes()
		let nY = now.getYear()
		let nM = now.getMonth()
		let nD = now.getDate()

		//当天时间
		if (Y === nY && M === nM && D === nD) {
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return h + ':' + m
		}

		//昨天时间
		if (Y === nY && M === nM && D + 1 === nD) {
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return '昨天' + h + ':' + m
		} else if (Y === nY) {
			//今年
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return M + '月' + D + '日 ' + h + ':' + m
		} else {
			//大于今年
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			return Y + '年' + M + '月' + D + '日 ' + h + ':' + m
		}
	},

	//间隔时间差
	spaceTime(old, now) {
		old = new Date(old)
		now = new Date(now)
		let told = old.getTime()
		let tnow = now.getTime()
		//大于间隔五分钟
		if (Math.abs(told - tnow) >= (5 * 60 * 1000)) {
			return now
		} else {
			return ''
		}
	},

	//聊天页时间格式化
	formartTime(t, type) {
		var oldtime = new Date(t);
		var date = new Date();
		var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
		var yestday = new Date(today - 24 * 3600 * 1000).getTime();
		var beforeYestday = new Date(today - 24 * 3600 * 1000 * 2).getTime();
		var beforeWeek = new Date(today - 24 * 3600 * 1000 * 7).getTime();
		var Y = oldtime.getFullYear(); //年份
		var M = oldtime.getMonth() + 1; //月份         
		var d = oldtime.getDate(); //日         
		var h = oldtime.getHours() % 12 == 0 ? 12 : oldtime.getHours() % 12; //12小时         
		var H = oldtime.getHours(); //24小时         
		var m = oldtime.getMinutes(); //分 
		var w = toWeek(oldtime.getUTCDay()); //星期
		var timesolt = toTimeSolt(oldtime.getHours()); //时间段 

		var timeStr = '';

		//当天
		if (oldtime.getTime() > yestday) {
			timeStr = H + ':' + m;
		}
		//昨天
		if (oldtime.getTime() < today && yestday <= oldtime.getTime()) {
			timeStr = '昨天 ' + (type == 1 ? H + ':' + m : '');
		}
		// 一周内
		if (oldtime.getTime() < yestday && beforeWeek <= oldtime.getTime()) {
			timeStr = w + (type == 1 ? ' ' + H + ':' + m : '');
		}
		// 一周前
		if (oldtime.getTime() < beforeWeek) {
			timeStr = type == 1 ? Y + '年' + M + '月' + d + '日 ' + timesolt + ' ' + H + ':' + m : Y + '/' + M + '/' +
				d;
		}
		// 比当前时间晚
		if (oldtime.getTime() > date.getTime()) {
			timeStr = '手动修改';
		}

		// 格式化时间段
		function toTimeSolt(h) {
			var bt = '';
			if (0 <= h && h <= 3)
				bt = '凌晨';
			if (4 <= h && h <= 8)
				bt = '早上';
			if (9 <= h && h <= 11)
				bt = '上午';
			if (12 == h)
				bt = '中午';
			if (13 <= h && h <= 17)
				bt = '下午';
			if (18 <= h && h <= 23)
				bt = '晚上';

			return bt;
		}

		// 格式星期
		function toWeek(w) {
			var week = '';
			switch (w) {
				case 0:
					week = '星期日';
					break;
				case 1:
					week = '星期一';
					break;
				case 2:
					week = '星期二';
					break;
				case 3:
					week = '星期三';
					break;
				case 4:
					week = '星期四';
					break;
				case 5:
					week = '星期五';
					break;
				case 6:
					week = '星期六';
					break;
			}
			return week;
		}
		return timeStr;
	},

	// 仿微信时间显示格式转换 @time 时间戳毫秒
	weChatTimeFormat(time) {
		// time 为传入某时间点的时间戳
		const today = new Date().getTime() //现在时间戳
		const initTime = new Date().setHours(0, 0, 0, 0) //当日凌晨时间戳
		// 当前时间减去获取到的时间
		const sub = today - time
		const day = 1000 * 60 * 60 * 24 //一天的时间戳量
		const timeDate = new Date(time)
		const currentYear = new Date().getFullYear()
		const getYear = new Date(time).getFullYear()
		const HHmm = `${formatTime2("hh", timeDate)}:${formatTime2("mm", timeDate)}`
		const showWeekDay = isShowWeekDay(sub, timeDate.getDay())
		if (currentYear > getYear) {
			return `${formatTime2("yyyy/MM/dd", timeDate)} ${todayTimeFormat(timeDate.getHours())}${formatTime2("hh:mm", timeDate)}`
		} else if (showWeekDay) {
			return `${weekFormat(timeDate.getDay())} ${HHmm}`
			// } else if (sub > day && sub < day * 2) {
			// 	return `昨天 ${HHmm}`
		} else if (time < initTime && time > initTime - day) {
			return `昨天 ${HHmm}`
			// } else if (sub <= day) {
			// 	return HHmm
		} else if (time > initTime) {
			return HHmm
		} else {
			return `${formatTime2("MM/dd", timeDate)} ${todayTimeFormat(timeDate.getHours())}${formatTime2("hh:mm", timeDate)}`
		}
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

	//临时图片路径 获取 base64格式图片
	getBase64(imgUrl) {
		let base64
		window.URL = window.URL || window.webkitURL;
		var xhr = new XMLHttpRequest();
		xhr.open("get", imgUrl, true);
		// 至关重要
		xhr.responseType = "blob";
		xhr.onload = function() {
			if (this.status == 200) {
				//得到一个blob对象
				var blob = this.response;
				// console.log("blob", blob)
				// 至关重要
				let oFileReader = new FileReader();
				oFileReader.onloadend = function(e) {
					// 此处拿到的已经是 base64的图片了
					base64 = e.target.result;
					console.log("方式一》》》》》》》》》", base64)
					return base64
				};
				oFileReader.readAsDataURL(blob);
			}
		}
		xhr.send();
	}
}
