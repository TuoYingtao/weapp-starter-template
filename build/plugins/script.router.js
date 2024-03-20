const fs = require('fs');
const preText = 'module.exports = ';

const appJson = fs.readFileSync(`${process.cwd()}/app.json`, { encoding: 'utf8' });
const appObj = JSON.parse(appJson);
const mainRouters = [];
const router = {};

module.exports = function () {
  appObj.pages && appObj.pages.length > 0 && mainRouters.push(...appObj.pages);
  appObj.subpackages &&
    appObj.subpackages.length > 0 &&
    appObj.subpackages.forEach(item => {
      const packageRouter = [];
      item.pages &&
        item.pages.length > 0 &&
        item.pages.forEach(path => {
          packageRouter.push(`${item.root}/${path}`);
        });
      packageRouter.length > 0 && mainRouters.push(...packageRouter);
    });
  router.defaultPage = appObj.pages[0];
  router.mainPage = appObj.pages;
  router.pageAll = mainRouters;
  const result = `${preText}${JSON.stringify(router, null, 2)}`;
  fs.writeFile(`${process.cwd()}/config/router.js`, result, 'utf8', err => {
    if (err) {
      throw new Error(`error occurs when reading file script.router.js. Error detail: ${err}`);
    }
  });
  console.log(result);
};
