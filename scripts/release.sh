#!/usr/bin/env sh

command="standard-version"

first_release() {
  if [ "$1" ]; then
    command+=" --first-release";
    echo "🌈 enable first release"
  fi
}

no_verify() {
  if [ "$1" ]; then
    command+=" --no-verify";
    echo "👌🏻 no-verify"
  fi
}

dry_run() {
  # Default as v, this is prefix argument
  if [ "$1" ]; then
    command+=" --dry-run";
    echo "🧪 enable dry-run"
  fi
}

tag_prefix() {
  # Default as v, this is prefix argument
  prefix=""
  if [[ "$1" == "-"* ]]; then
     prefix="v"
  else
     prefix="$1"
  fi
  command+=" --tag-prefix $prefix";
  echo "🌈 Prefix as $prefix"
}

prerelease() {
  # Default as alpha, the argument alpha:
  prerelease="";
  if [[ "$1" == "-"* ]]; then
    prerelease="alpha";
  else
    prerelease="$1"
  fi
  command+=" --prerelease $prerelease";
  echo "👌🏻 Release as $prerelease"
}

release() {
  # Default as minor, the argument major, minor or patch:
  release="$1";
  if [ -z "$release" ]; then
    release="patch";
  fi
  command+=" --release-as $release";
  echo "👌🏻 Release as $release"
}

branch_handler() {
  # Default release branch is master
  echo "branch_handler"
  branch="";
  if [[ "$1" == "-"* ]]; then
    branch="master";
  else
    branch="$1"
  fi

  if [ "$branch" ]; then
    echo "✔ Branch is $branch"
  else
    echo "✔ Branch is current branch"
  fi;

  # git pull origin $branch
  echo "✔ Current pull origin $branch."
  command+=" --branch $branch";
}

multiple_values_handler() {
  value=""
  multiple_array=("$@")
  if [ ${#multiple_array[@]} -eq 0 ]; then
     value="default_value"
  elif [[ "${multiple_array[0]}" == "-"* ]]; then
     value="default_value2"
  else
    for multiple in "${multiple_array[@]}"; do
      value+=" $multiple"
    done
  fi
  command+=" --multiple_values $value";
}

#========================================= Shell =========================================

usage() {
  echo " "
  echo "版本号说明: major.minor.patch (主版本.次版本.修订版)"
  echo ""
  echo "参数列表："
  echo "  -f|--first-release:         用于生成第一个版本时，忽略之前的提交历史。"
  echo "  -p|--prerelease:             预发版本。例如 --prerelease alpha。"
  echo "  -r|--release-as              指定发布的版本号。例如 --tag-prefix [patch or minor or major or 1.0.1] 默认为：path"
  echo "  -t|--tag-prefix:             版本标签前缀。例如 --tag-prefix v。 默认为：v"
  echo "  -n|--no-verify:              跳过提交消息格式的验证。"
  echo "  -d|--dry-run:               运行模拟模式，不实际修改文件。"
  echo "  -b|--branch:                切换git分支"
}

#========================================= Shell 业务 =========================================

if [ -z $1 ]; then
  echo "❌❌❌ Unknown parameter passed: $1";
  usage
fi

while [[ "$#" -gt 0 ]]; do
    case "$1" in
    -f|--first-release)
      fr_flag="true"
      shift
      ;;
    -p|--prerelease)
      p_flag="true"
      p="$2"
      if [[ "$2" != "" && "$2" != "-"* ]]; then
        shift 2
      else
        shift
      fi
      ;;
    -r|--release-as)
      r_flag="true"
      r="$2"
      if [[ "$2" != "" && "$2" != "-"* ]]; then
        shift 2
      else
        shift
      fi
      ;;
    -t|--tag-prefix)
      t_flag="true"
      tag="$2"
      if [[ "$2" != "" && "$2" != "-"* ]]; then
        shift 2
      else
        shift
      fi
      ;;
    -n|--no-verify)
      no="true"
      shift
      ;;
    -d|--dry-run)
      d="true"
      shift
      ;;
    -b|--branch)
      b_flag="true"
      b="$2"
      if [[ "$2" != "" && "$2" != "-"* ]]; then
        shift 2
      else
        shift
      fi
      ;;
    -m|--multiple-values)
      m_flag="true"
      shift
      while [[ "$1" != "" && "$1" != -* ]]; do
          multiple_values+=("$1")
          shift
      done
      ;;
    *)
      usage
      echo "Invalid option: $1" >&2
      exit 1
      ;;
    esac
    # shift
done

echo ""
echo "first-release: $fr"
echo "prerelease : $p"
echo "release-as : $r"
echo "no-verify : $no"
echo "dry-run : $d"
echo "branch : $b"
echo "tag-prefix: $tag"
echo "multiple_values: ${multiple_values[@]}"
echo ""

first_release $fr_flag

if [ "$p_flag" ]; then
  prerelease $p
fi

if [ "$r_flag" ]; then
  release $r
fi

if [ "$t_flag" ]; then
  tag_prefix $tag
fi

no_verify $no

dry_run $d

if [ "$b_flag" ]; then
  branch_handler $b
fi

if [ "$m_flag" ]; then
  multiple_values_handler "${multiple_values[@]}"
fi


command+=" --infile CHANGELOG.md"

echo "The command executed is：$command"
eval $command

git push --follow-tags
echo '✅ git push success'
npm publish
echo "🎉🎉🎉 Release finished."