const fs = require('fs');
const yaml = require('yaml');
const preText = 'module.exports = ';
const config = yaml.parse(fs.readFileSync(`${process.cwd()}/config.yaml`, 'utf8'));
const globalEnv = {};

const remoteUrlHandler = () => {
  let remoteUrl = '';
  if (process.env.NODE_ENV === 'dev') {
    remoteUrl = config.weapp.env.dev;
  } else if (process.env.NODE_ENV === 'pro') {
    remoteUrl = config.weapp.env.pro;
  } else if (process.env.NODE_ENV === 'test') {
    remoteUrl = config.weapp.env.test;
  } else if (process.env.NODE_ENV === 'view') {
    remoteUrl = config.weapp.env.view;
  }
  return remoteUrl;
};

const previewPictureUrlHandler = () => {
  if (config.weapp.cos.bucket && config.weapp.cos.region) {
    return `https://${config.weapp.cos.bucket}.cos.${config.weapp.cos.region}.myqcloud.com/`;
  }
  return '';
};

module.exports = function () {
  globalEnv.envType = process.env.NODE_ENV;
  globalEnv.name = config.weapp.name;
  globalEnv.appID = config.weapp.appID;
  globalEnv.version = config.weapp.version;
  globalEnv.remoteUrl = remoteUrlHandler();
  globalEnv.cos = {};
  globalEnv.cos.Bucket = config.weapp.cos.bucket || '';
  globalEnv.cos.Region = config.weapp.cos.region || '';
  globalEnv.cos.previewPictureUrl = previewPictureUrlHandler();

  let result = null;
  result = preText + JSON.stringify(globalEnv, null, 2);

  fs.writeFile(`${process.cwd()}/config/env.js`, result, 'utf8', err => {
    if (err) {
      throw new Error(`error occurs when reading file script.env.js. Error detail: ${err}`);
    }
  });
};
