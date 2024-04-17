Component({
	data: {
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
	}
})
