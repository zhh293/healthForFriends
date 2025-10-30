# 健身计划追踪应用 - 部署指南

## 项目简介

这是一个基于 Vue 3 的每日健身计划追踪应用，支持计划的增删改查，每日自动重置，并可使用 Capacitor 打包为 Android APK。

## 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- Android Studio（用于 Android 开发）
- Java JDK 11 或更高版本（用于 Android 构建）

## 安装步骤

### 1. 创建项目

```bash
# 使用 npm 创建 Vue 3 项目
npm create vue@latest workout-tracker

# 或者使用 Vite 模板
npm create vite@latest workout-tracker -- --template vue-ts
```

### 2. 进入项目目录

```bash
cd workout-tracker
```

### 3. 安装依赖

```bash
npm install
```

### 4. 安装 Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/app @capacitor/haptics @capacitor/status-bar

# 初始化 Capacitor
npx cap init
```

在初始化过程中，系统会询问：
- **App name**: 健身计划 (或你想要的名称)
- **App ID**: com.workout.tracker (或你想要的包名)
- **Web Dir**: dist

### 5. 添加 Android 平台

```bash
npm install @capacitor/android
npx cap add android
```

## 开发环境运行

### Web 开发

```bash
# 启动开发服务器
npm run dev

# 服务器通常运行在 http://localhost:5173
```

### 构建 Web 版本

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## Android 开发配置

### 1. 配置 Android Studio

1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 打开 Android Studio，安装必要的 SDK 和工具
3. 配置环境变量（推荐）：
   - `ANDROID_HOME`: Android SDK 路径
   - 将 `$ANDROID_HOME/tools` 和 `$ANDROID_HOME/platform-tools` 添加到 PATH

### 2. 配置 capacitor.config.ts

在项目根目录编辑 `capacitor.config.ts` 文件：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.workout.tracker',
  appName: '健身计划',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    minVersion: 22,
    targetVersion: 33
  }
};

export default config;
```

### 3. 同步到 Android

每次修改 Web 代码后，需要同步到 Android 项目：

```bash
# 先构建 Web 版本
npm run build

# 同步到 Android
npx cap sync android

# 或者使用 copy 命令（更快但需要手动构建）
npx cap copy android
```

### 4. 在 Android Studio 中运行

```bash
# 打开 Android Studio
npx cap open android
```

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 选择连接的设备或模拟器
3. 点击运行按钮（绿色播放图标）

### 5. 构建 APK

#### 方式一：使用 Android Studio（推荐）

1. 打开 Android Studio
2. 选择 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. 构建完成后，点击通知中的 `locate` 查看 APK 文件
4. APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 方式二：使用命令行

```bash
# 进入 Android 目录
cd android

# 构建 Debug APK
./gradlew assembleDebug

# APK 位置：android/app/build/outputs/apk/debug/app-debug.apk

# 构建 Release APK（需要签名配置）
./gradlew assembleRelease
```

## Android 签名配置（发布版本）

### 1. 生成签名密钥

```bash
# 使用 keytool（Java JDK 自带）
keytool -genkey -v -keystore workout-tracker.keystore -alias workout -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置签名

在 `android/app/build.gradle` 中添加：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../workout-tracker.keystore")
            storePassword "你的密钥库密码"
            keyAlias "workout"
            keyPassword "你的密钥密码"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

⚠️ **注意**: 在生产环境中，应该使用环境变量或单独的配置文件管理签名信息。

## 配置说明

### package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",                          // 开发服务器
    "build": "vite build",                  // 构建 Web 版本
    "preview": "vite preview",              // 预览构建结果
    "cap:add": "npx cap add",               // 添加平台
    "cap:copy": "npx cap copy",             // 复制文件
    "cap:sync": "npx cap sync",             // 同步到原生项目
    "cap:open": "npx cap open",             // 打开原生 IDE
    "android:open": "npx cap open android", // 打开 Android Studio
    "android:build": "npm run build && npx cap sync android && npx cap open android"
  }
}
```

### Vite 配置

创建 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 5173,
    open: true
  }
});
```

## 常见问题

### 1. Android Studio 中找不到设备

**解决方案**:
- 确保已启用 USB 调试
- 安装设备驱动程序
- 使用 `adb devices` 检查设备连接

### 2. Gradle 同步失败

**解决方案**:
```bash
# 清理 Gradle 缓存
cd android
./gradlew clean

# 删除 .gradle 缓存
rm -rf ~/.gradle/caches/
```

### 3. 白屏问题

**解决方案**:
- 检查 `capacitor.config.ts` 中的 `webDir` 路径是否正确
- 确保已运行 `npm run build`
- 检查 `index.html` 中的 base 路径

### 4. 无法连接到开发服务器

**解决方案**:
```bash
# 使用局域网 IP 地址
npm run dev -- --host 0.0.0.0

# 或修改 vite.config.ts
server: {
  host: '0.0.0.0'
}
```

### 5. 热重载不工作

**解决方案**:
- 使用 `npx cap sync` 而不是 `npx cap copy`
- 在 Android Studio 中手动重新加载

## 部署清单

### Web 部署前检查

- [ ] 运行 `npm run build` 成功
- [ ] 测试所有功能正常工作
- [ ] 检查控制台无错误信息
- [ ] 测试响应式布局

### Android 部署前检查

- [ ] 运行 `npx cap sync android` 成功
- [ ] 在 Android Studio 中无编译错误
- [ ] 测试所有功能在真机上工作
- [ ] 检查应用图标和启动画面
- [ ] 测试每日自动重置功能
- [ ] 备份签名密钥

### 发布前最后检查

- [ ] 更新版本号
- [ ] 更新应用图标和启动画面
- [ ] 配置正确的应用名称
- [ ] 测试 APK 安装
- [ ] 生成 Release APK

## 开发工作流

### 日常开发流程

```bash
# 1. 开发 Web 版本
npm run dev

# 2. 修改代码并测试

# 3. 构建并同步到 Android
npm run build
npx cap sync android

# 4. 在 Android Studio 中测试
npx cap open android
```

### 发布新版本

```bash
# 1. 更新版本号
# 修改 package.json 和 android/app/build.gradle

# 2. 构建 Web 版本
npm run build

# 3. 同步到 Android
npx cap sync android

# 4. 在 Android Studio 中构建 Release APK
npx cap open android
# 然后 Build → Build Bundle(s) / APK(s) → Build APK(s)

# 5. 测试 APK

# 6. 发布到应用商店
```

## 性能优化建议

1. **代码分割**: 使用 Vue 的懒加载路由
2. **图片优化**: 压缩图片，使用 WebP 格式
3. **缓存策略**: 合理使用 LocalStorage
4. **减少重渲染**: 使用 `v-memo` 优化列表
5. **首屏加载**: 优化初始包大小

## 测试建议

1. **功能测试**: 测试所有 CRUD 操作
2. **日期测试**: 测试跨天数据重置
3. **性能测试**: 测试大量数据时的性能
4. **兼容性测试**: 在不同 Android 版本测试
5. **用户体验测试**: 收集用户反馈

## 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Capacitor 官方文档](https://capacitorjs.com/)
- [Android 开发者文档](https://developer.android.com/)
- [Vite 官方文档](https://vitejs.dev/)

## 支持与反馈

如遇到问题，请检查：
1. 项目配置是否正确
2. 依赖版本是否兼容
3. 控制台错误信息
4. Android Studio 的 Gradle 同步日志

祝开发顺利！💪
