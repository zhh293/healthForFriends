# 健身计划追踪应用 - 完整文档

这是一个基于 Vue 3 的每日健身计划追踪应用的项目文档集合。你可以使用这些文档在 v0.dev 上生成前端代码，并使用 Capacitor 打包为 Android APK。

## 📚 文档索引

### 1. **项目需求文档** (`project_requirements.md`)
完整的功能需求、技术栈、组件结构、数据结构等技术规格说明。

### 2. **v0 提示词文档**
- **中文版** (`V0_PROMPT_CN.md`): 可以直接复制粘贴到 v0.dev 使用的提示词
- **英文版** (`V0_PROMPT_EN.md`): 英文版本的提示词

### 3. **部署指南** (`DEPLOYMENT.md`)
详细的安装、配置、启动和部署步骤，包括：
- 项目创建和依赖安装
- Capacitor 配置
- Android 开发环境配置
- APK 打包和签名
- 常见问题解答

### 4. **Capacitor 配置** (`CAPACITOR_CONFIG.md`)
Capacitor 的详细配置说明，包括：
- capacitor.config.ts 配置示例
- Android 项目配置
- 图标和启动画面配置
- 常用命令和调试方法
- 构建优化配置

### 5. **v0 提示词（纯文本）** (`V0_PROMPT_READY.txt`)
可以直接复制粘贴使用的提示词文件

## 🚀 快速开始

### 使用 v0.dev 生成代码

1. 打开 [v0.dev](https://v0.dev)
2. 复制 `V0_PROMPT_CN.md` 中的提示词
3. 粘贴并生成代码
4. 导出代码到本地

### 在本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 打包为 Android APK

详细步骤请查看 `DEPLOYMENT.md`

```bash
# 构建并同步到 Android
npm run build
npx cap sync android

# 打开 Android Studio
npx cap open android
```

## 🎯 核心功能

- ✅ 每日健身计划的增删改查
- ✅ 标记完成功能（带复选框）
- ✅ 每日自动清空计划
- ✅ 统计信息显示（总数、已完成、完成率）
- ✅ 美观现代的 UI 设计
- ✅ 支持 Capacitor 打包为 Android APK

## 🛠 技术栈

- **前端框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **移动端**: Capacitor
- **数据存储**: LocalStorage
- **原生平台**: Android

## 📱 应用截图说明

### 主界面
- 渐变背景（橙色 → 粉色）
- 顶部显示当前日期
- 浮动添加按钮
- 健身计划列表（卡片式）
- 底部统计信息

### 交互功能
- 点击复选框标记完成
- 编辑和删除按钮
- 模态框添加/编辑计划
- 平滑的动画效果

## 📖 使用文档顺序

1. **新手入门**: 
   - 先阅读 `V0_PROMPT_CN.md` 快速了解项目
   - 使用提示词在 v0.dev 生成代码

2. **项目配置**:
   - 阅读 `DEPLOYMENT.md` 了解开发环境配置
   - 按照步骤安装依赖和配置 Capacitor

3. **深入了解**:
   - 阅读 `project_requirements.md` 了解详细的技术规格
   - 理解组件结构和数据结构

## 🎨 设计特色

- **渐变背景**: 活力橙到活力粉的渐变
- **卡片设计**: 现代化白色卡片，圆角阴影
- **颜色方案**: 
  - 主色：渐变色 #ff6b6b → #feca57
  - 完成状态：绿色 #51cf66
  - 文本：深灰色 #2d3436
- **动画效果**: 平滑的淡入淡出、滑动效果

## 🐛 问题反馈

如果在开发过程中遇到问题，请查看 `DEPLOYMENT.md` 中的"常见问题"部分。

## 📝 项目结构

```
project-root/
├── project_requirements.md    # 项目需求文档
├── V0_PROMPT_CN.md            # v0 中文提示词（详细版）
├── V0_PROMPT_EN.md            # v0 英文提示词（详细版）
├── V0_PROMPT_READY.txt        # v0 提示词（可直接使用）
├── DEPLOYMENT.md              # 部署指南
├── CAPACITOR_CONFIG.md        # Capacitor 配置详解
└── README.md                  # 本文档
```

## 🔗 相关链接

- [Vue 3 官方文档](https://vuejs.org/)
- [Capacitor 官方文档](https://capacitorjs.com/)
- [v0.dev](https://v0.dev)
- [Vite 官方文档](https://vitejs.dev/)

## 📄 许可证

MIT License

---

祝你开发顺利，早日实现健身目标！💪
