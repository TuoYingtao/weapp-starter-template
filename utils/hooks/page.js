import { get } from './request'
import { getNewUserInfo } from './index'
import { objectToJoin } from "@/utils/index.js";

export default (pageOptions, processDataCallback, beforeGetListCallback) => {
  const options = {}
  const app = {
    data() {
      return {
        $globalData: getApp().globalData
      }
    },
    methods: {
      $app: getApp(),
      $set(data) {
        this.setData(data, () => Promise.resolve())
      },
      $router: {
        push(url, params) {
          navigateTo(`/pages${url}/index${params ? '?' + objectToJoin(params) : ''}`)
        },
        replace(url, params) {
          redirectTo(`/pages${url}/index${params ? '?' + objectToJoin(params) : ''}`)
        },
        back(delta) {
          navigateBack(delta)
        }
      },
      $goPage(e) {
        let { url } = e.currentTarget.dataset
        if (!url) return
        let params = Object.assign({}, e.currentTarget.dataset)
        if (params.index === undefined) {
          this.data.clickIndex = -1
        } else {
          this.data.clickIndex = params.index
          delete params.index
        }
        delete params.url
        this.$router.push(url, params)
      },
      $loading(msg) {
        showLoading(msg || '加载中...')
      },
      $loaded: hideLoading,
      onShareAppMessage: function () {
        return {
          title: '靓机汇回收报价单',
          path: `${this.route}?scene=${getNewUserInfo('id', '')}`
        }
      },
      onShareTimeline: function () {
        return {
          title: '靓机汇回收报价单',
          query: `${this.route}?scene=${getNewUserInfo('id', '')}`
        }
      },
      $tm() {
      }
    }
  }

  if (pageOptions.listApi) {
    let { listUrl } = pageOptions.listApi
    let data = app.data.apply(this)
    Object.assign(data, {
      page: 1,
      size: 10,
      query: {},
      lists: [],
      count: 0,
      loaded: false,
      clickIndex: -1
    })
    app.data = () => {
      return data
    }
    Object.assign(app.methods, {
      init() {
        this.$loading()
        listUrl && this.getList()
      },
      async getList() {
        let { page, size, query, lists, loaded, clickIndex } = this.data
        if (loaded && clickIndex === -1) {
          return
        }
        if (clickIndex > -1) {
          page = Math.ceil(clickIndex / size) || 1
        }

        // 使用回调函数处理需要修改listUrl的请求
        if (beforeGetListCallback && typeof beforeGetListCallback === 'function') {
          listUrl = await beforeGetListCallback(this)
        }
        get(listUrl, {
          page,
          size,
          ...query
        })
          .then(async (res) => {
            //返回的数据可能是数组也可能是包含list键值的对象
            let list = Array.isArray(res)
              ? res
              : Object.prototype.hasOwnProperty.call(res, 'list')
                ? res.list
                : []
            // 临时处理结束 会员购买记录接口
            if (clickIndex > -1) {
              lists.splice((page - 1) * size, size, ...list)
              //判断是否是删除，删除会导致有一条数据重复，判断id是否相同，删除相同数据
              let lastListItem = list[list.length - 1]
              let afterListItem = lists[page * size]
              if (afterListItem && lastListItem.id === afterListItem.id) {
                lists.splice(page * size, 1)
              }
              await this.$set({
                lists
              })
              this.data.clickIndex = -1
            } else {
              await this.$set({
                lists: page === 1 ? list : lists.concat(list),
                page: list.length < size ? page : page + 1,
                loaded: list.length < size
              })
            }
            // 使用回调函数处理特定的数据
            if (processDataCallback && typeof processDataCallback === 'function') {
              await processDataCallback(res, this)
            }
            // 临时处理开始  对以下特定页面做特殊逻辑判断
            this.$loaded()
          })
          .catch(async (err) => {
            await showToast(err.message)
            navigateBack()
          })
      },
      onReachBottom() {
        this.getList()
      }
    })
  }

  if (pageOptions.data && typeof pageOptions.data == 'function') {
    options.data = Object.assign({}, app.data.apply(this), pageOptions.data.apply(this) || {})
  } else {
    options.data = Object.assign({}, app.data.apply(this), pageOptions.data || {})
  }

  options.onLoad = function () {
    if (pageOptions.created) {
      pageOptions.created.apply(this, arguments)
    }
    if (pageOptions.listApi) {
      this.init()
    }
  }

  options.onShow = function () {
    if (pageOptions.activated) {
      pageOptions.activated.apply(this, arguments)
    }
    let { clickIndex } = this.data
    if (pageOptions.listApi && clickIndex > -1) {
      this.getList()
    }
  }

  options.onReady = function () {
    if (pageOptions.mounted) {
      pageOptions.mounted.apply(this, arguments)
    }
  }

  options.onHide = function () {
    if (pageOptions.deactivated) {
      pageOptions.deactivated.apply(this, arguments)
    }
  }

  options.onUnload = function () {
    if (pageOptions.destroyed) {
      pageOptions.destroyed.apply(this, arguments)
    }
  }

  Page(Object.assign({}, options, app.methods, pageOptions.methods))
}
