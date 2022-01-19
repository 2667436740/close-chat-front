export default {
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
		if(Y === nY && M ===nM && D === nD) {
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return h+':'+m
		}
		
		//昨天时间
		if(Y === nY && M ===nM && D+1 === nD) {
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return '昨天'+h+':'+m
		} else {
			//大于两天
			return Y+'/'+M+'/'+D
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
		if(Y === nY && M ===nM && D === nD) {
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return h+':'+m
		}
		
		//昨天时间
		if(Y === nY && M ===nM && D+1 === nD) {
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return '昨天'+h+':'+m
		} else if(Y === nY) {
			//今年
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return M+'月'+D+'日 '+h+':'+m
		} else {
			//大于今年
			if(h<10) {
				h = '0' + h
			}
			if(m<10) {
				m = '0' + m
			}
			return Y+'年'+M+'月'+D+'日 '+h+':'+m
		}
	},
	
	//间隔时间差
	spaceTime(old, now) {
	  old = new Date(old)
	  now = new Date(now)
		let told = old.getTime()
		let tnow = now.getTime()
		//大于间隔五分钟
		if(Math.abs(told - tnow) >= (5 * 60 * 1000)) {
			return now
		} else {
			return ''
		}
	}
}