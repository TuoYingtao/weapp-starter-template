import { converObjToString, isEmpty, isHasProperty } from '@/utils/index';
import { navigateTo, redirectTo, navigateBack } from '@/utils/tools/navigateTools';
import { showLoading, hideLoading, showToast } from '@/utils/tools/index';
import { getUserInfoStorage } from '@/utils/storage';
import { PAGE_KEY } from '@/utils/request/RequestConstant';
import { request } from '@/utils/request/index';
import { RESPONSE_KEY } from '@/utils/request/RequestConstant';

export default pageOptions => {
  const adapter = {};
  const options = {};
  const app = {
    data() {
      return {
        $globalData: getApp().globalData
      };
    },
    methods: {
      $app: getApp(),
      $set(data) {
        this.setData(data, () => Promise.resolve());
      },
      $router: {
        push(url, params) {
          navigateTo(`/pages${url}/index${params ? '?' + converObjToString(params) : ''}`);
        },
        replace(url, params) {
          redirectTo(`/pages${url}/index${params ? '?' + converObjToString(params) : ''}`);
        },
        back(delta) {
          navigateBack(delta);
        },
        currentPages() {
          return getCurrentPages();
        }
      },
      $goPage(e) {
        const { url } = e.currentTarget.dataset;
        if (!url) return;
        const params = Object.assign({}, e.currentTarget.dataset);
        if (params.index === undefined) {
          this.data.clickIndex = -1;
        } else {
          this.data.clickIndex = params.index;
          delete params.index;
        }
        delete params.url;
        this.$router.push(url, params);
      },
      $loading(msg) {
        showLoading(msg || '加载中...');
      },
      $loaded: hideLoading,
      onShareAppMessage: function () {
        return {
          title: this.data.$globalData.application.name,
          path: `${this.route}?scene=${converObjToString(getUserInfoStorage())}`
        };
      },
      onShareTimeline: function () {
        return {
          title: this.data.$globalData.application.name,
          query: `${this.route}?scene=${converObjToString(getUserInfoStorage())}`
        };
      },
      $tm() {}
    }
  };

  adapter.onAdapterPage = value => {
    pageOptions.onAdapterPage(
      () => value,
      () => value
    );
  };

  if (pageOptions.pageConfig && pageOptions.pageConfig.pageApi) {
    const data = app.data.apply(this);
    const { pageApi, enter } = pageOptions.pageConfig;
    const [pageKey, limitKey, totalKey, listKey] = [
      !isEmpty(enter) && enter.pageKey ? enter.pageKey : PAGE_KEY.pageKey,
      !isEmpty(enter) && enter.limitKey ? enter.limitKey : PAGE_KEY.limitKey,
      !isEmpty(enter) && enter.totalKey ? enter.totalKey : PAGE_KEY.totalKey,
      !isEmpty(enter) && enter.listKey ? enter.listKey : PAGE_KEY.listKey
    ];
    Object.assign(data, {
      ...(() => {
        const pageData = {};
        pageData[pageKey] = 1;
        pageData[limitKey] = 10;
        pageData[totalKey] = 0;
        return pageData;
      })(),
      query: {},
      pages: [],
      loaded: false,
      clickIndex: -1
    });
    app.data = () => data;
    Object.assign(app.methods, {
      init() {
        this.$loading();
        pageApi && this.getPage();
      },
      async getPage() {
        let { query, pages, loaded, clickIndex } = this.data;
        if (loaded && clickIndex === -1) {
          return;
        }
        if (clickIndex > -1) {
          this.data[pageKey] = Math.ceil(clickIndex / this.data[limitKey]) || 1;
        }
        try {
          const result = await request.get({
            url: pageApi,
            params: {
              [pageKey]: this.data[pageKey],
              [limitKey]: this.data[limitKey],
              ...query
            }
          });
          const [page, limit] = [this.data[pageKey], this.data[limitKey]];
          //返回的数据可能是数组也可能是包含list键值的对象
          const list = Array.isArray(result[RESPONSE_KEY.dataKey])
            ? result[RESPONSE_KEY.dataKey]
            : isHasProperty(result[RESPONSE_KEY.dataKey], listKey)
              ? result[RESPONSE_KEY.dataKey][listKey]
              : [];
          if (clickIndex > -1) {
            pages.splice((page - 1) * limit, limit, ...list);
            //判断是否是删除，删除会导致有一条数据重复，判断id是否相同，删除相同数据
            const lastListItem = list[list.length - 1];
            const afterListItem = pages[page * limit];
            if (afterListItem && JSON.stringify(lastListItem) === JSON.stringify(afterListItem)) {
              pages.splice(page * limit, 1);
            }
            await this.$set({ pages });
            this.data.clickIndex = -1;
          } else {
            await this.$set({
              pages: page === 1 ? list : pages.concat(list),
              [pageKey]: list.length < limit ? page : page + 1,
              loaded: list.length < limit
            });
          }
          adapter.onAdapterPage(result);
          this.$loaded();
        } catch (err) {
          adapter.onAdapterPage(err);
          await showToast(err.message);
          navigateBack();
        }
      },
      onReachBottom() {
        this.getPage();
      }
    });
  }

  if (pageOptions.data && typeof pageOptions.data == 'function') {
    options.data = Object.assign({}, app.data.apply(this), pageOptions.data.apply(this) || {});
  } else {
    options.data = Object.assign({}, app.data.apply(this), pageOptions.data || {});
  }

  options.onLoad = function () {
    if (pageOptions.created) {
      pageOptions.created.apply(this, arguments);
    }
    if (pageOptions.pageConfig && pageOptions.pageConfig.pageApi) {
      this.init();
    }
  };

  options.onShow = function () {
    if (pageOptions.activated) {
      pageOptions.activated.apply(this, arguments);
    }
    const { clickIndex } = this.data;
    if (pageOptions.pageConfig && pageOptions.pageConfig.pageApi && clickIndex > -1) {
      this.getPage();
    }
  };

  options.onReady = function () {
    if (pageOptions.mounted) {
      pageOptions.mounted.apply(this, arguments);
    }
  };

  options.onHide = function () {
    if (pageOptions.deactivated) {
      pageOptions.deactivated.apply(this, arguments);
    }
  };

  options.onUnload = function () {
    if (pageOptions.destroyed) {
      pageOptions.destroyed.apply(this, arguments);
    }
  };
  Page(Object.assign({}, options, app.methods, pageOptions.methods));
};
