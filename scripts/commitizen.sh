#!/usr/bin/env sh

# 获取当前系统平台信息
platform=$(uname)
electron="electron"

platformHandler() {
  # 根据平台信息进行判断
  case $platform in
    "Linux")
      echo "Current platform is Linux"
      return 1
      ;;
    "Darwin")
      echo "Current platform is macOS"
      return 2
      ;;
    "Windows" | *"MINGW64_NT"* | *"MINGW32_NT"*)
      echo "Current platform is Windows"
      return 3
      ;;
    *)
      echo "Unknown platform: $platform"
      return 0
      ;;
  esac
}

platformHandler
echo $?


if npm_list=$(npm list -g --depth=0 --json); then
  if echo "$npm_list" | grep -q "\"$electron\":"; then
    echo '存在'
  else
    echo '不存在'
  fi
else
  echo '空的'
fi