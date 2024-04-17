import { navigateTo, switchTab } from '../utils/system'

Component({
	data: {
		isTradeIcon: false,
		active: 0,
		list: [
			{
				icon: '/assets/images/tabBar/home.png',
				icon_active: '/assets/images/tabBar/homeActive.png',
				text: '首页',
				url: '/pages/index/index'
			},
			{
				icon: '/assets/images/tabBar/release.png',
				url: '/pages/release/index',
				text: '回收下单',
				isSpecial: true
			},
			{
				icon: '/assets/images/tabBar/user.png',
				icon_active: '/assets/images/tabBar/userActive.png',
				text: '个人中心',
				url: '/pages/mine/index'
			}
		]
	},
	observers: {
		isTradeIcon: function (newVal) {
			this.setData({
				'list[0].icon_active': newVal
					? '/assets/images/tabBar/rocket.png'
					: '/assets/images/tabBar/userActive.png',
				'list[0].text': newVal ? '回到顶部' : '首页'
			})
		}
	},
	methods: {
		onChange(event) {
			let index = event.detail
			let { list, isTradeIcon } = this.data
			if (index === 0 && isTradeIcon) {
				wx.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			}
			if (index === 1) {
				navigateTo(list[index].url)
			} else {
				switchTab(list[index].url)
			}
		},

		init() {
			const page = getCurrentPages().pop()
			this.setData({
				active: this.data.list.findIndex((item) => item.url === `/${page.route}`)
			})
		}
	}
})
