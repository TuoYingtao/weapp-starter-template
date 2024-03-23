module.exports = {
  types: [
    { type: 'feature', section: 'feature:       ✨ 新增功能 | A new feature', hidden: false },
    { type: 'update', section: 'update:       🔧 更新功能 | A function update', hidden: false },
    { type: 'fixbug', section: 'fixbug:       🐛 修复缺陷 | A bug fixbug', hidden: false },
    {
      type: 'refactor',
      section: 'refactor:  ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature',
      hidden: false
    },
    {
      type: 'optimize',
      section: 'optimize:      ⚡️ 性能提升 | A code change that improves optimize',
      hidden: false
    },
    {
      type: 'style',
      section: 'style:     💄 代码格式 | Changes that do not affect the meaning of the code',
      hidden: false
    },
    { type: 'docs', section: 'docs:      📝 文档更新 | Documentation only changes', hidden: false },
    {
      type: 'test',
      section: 'test:      ✅ 测试相关 | Adding missing tests or correcting existing tests',
      hidden: false
    },
    {
      type: 'build',
      section: 'build:     📦️ 构建相关 | Changes that affect the build system or external dependencies',
      hidden: false
    },
    {
      type: 'ci',
      section: 'ci:        🎡 持续集成 | Changes to our CI configuration files and scripts',
      hidden: false
    },
    { type: 'revert', section: 'revert:    🔨 回退代码 | Revert to a commit', hidden: false },
    {
      type: 'chore',
      section: 'chore:     ⏪️ 其他修改 | Other changes that do not modify src or test files',
      hidden: false
    }
  ]
};
