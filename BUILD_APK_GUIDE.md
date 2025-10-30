# APK 构建指南

## 🎯 当前状态

项目已经成功构建并准备好了所有文件：
- ✅ 前端项目已构建（dist 目录）
- ✅ Android 平台已添加（android 目录）
- ✅ 文件已同步到 Android 项目

## 🏗️ 两种构建 APK 的方法

### 方法1：使用 Android Studio（推荐）⭐

这是最简单可靠的方法。

#### 步骤：

1. **打开 Android Studio**
   ```bash
   npx cap open android
   ```
   或手动打开 Android Studio 并导入 `android` 目录

2. **等待 Gradle 同步**
   - Android Studio 会自动下载 Gradle 和依赖
   - 等待同步完成（底部状态栏显示 "Gradle sync completed"）

3. **构建 APK**
   - 点击菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - 等待构建完成

4. **获取 APK**
   - 构建完成后会显示通知
   - 点击通知中的 `locate` 查看 APK
   - APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 优点：
- ✅ 自动处理 Gradle 下载
- ✅ 图形界面，易于使用
- ✅ 可以调试和测试
- ✅ 支持模拟器和真机运行

---

### 方法2：使用命令行构建

如果遇到 SSL 证书问题，需要先配置代理或手动下载 Gradle。

#### 步骤：

1. **配置 Gradle 代理（如果需要）**
   
   创建或编辑 `android/gradle.properties` 文件：
   ```properties
   # HTTP/HTTPS 代理配置（如果需要）
   systemProp.http.proxyHost=your-proxy-host
   systemProp.http.proxyPort=your-proxy-port
   systemProp.https.proxyHost=your-proxy-host
   systemProp.https.proxyPort=your-proxy-port
   ```

2. **构建 APK**
   
   Windows:
   ```bash
   cd android
   gradlew.bat assembleDebug
   ```
   
   Linux/Mac:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **获取 APK**
   - APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 快速构建流程（推荐）

最简单的流程是使用 Android Studio：

```bash
# 1. 确保项目已构建
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打开 Android Studio
npx cap open android

# 4. 在 Android Studio 中点击 "Build" → "Build APK(s)"
# 5. 等待构建完成，获取 APK
```

## 📱 安装 APK

构建完成后，你可以通过以下方式安装：

1. **通过 USB 安装**
   - 连接 Android 设备到电脑
   - 运行：`adb install app-debug.apk`

2. **传输到设备**
   - 将 APK 文件复制到手机
   - 在手机上点击 APK 文件安装
   - 需要允许"未知来源"安装

3. **直接运行**
   - 在 Android Studio 中点击运行按钮
   - 选择设备或模拟器

## 🔧 常见问题

### 1. Gradle 下载失败

**问题**：SSL 证书错误或网络问题

**解决**：
- 使用 Android Studio 会自动处理
- 或配置代理
- 或手动下载 Gradle 并放到用户目录

### 2. Java 版本问题

**问题**：需要 Java 11 或更高版本

**检查**：
```bash
java -version
```

**解决**：
- 安装 JDK 11 或更高版本
- 配置 JAVA_HOME 环境变量

### 3. Android SDK 问题

**问题**：找不到 Android SDK

**解决**：
- 安装 Android Studio
- SDK 会自动安装
- 或手动下载 SDK

### 4. 构建速度慢

**解决**：
- 使用 Gradle 守护进程
- 配置代理加速下载
- 使用本地 Maven 仓库

## 📝 配置文件说明

项目中的关键配置文件：

- `capacitor.config.ts` - Capacitor 配置
- `android/build.gradle` - 项目级构建配置
- `android/app/build.gradle` - 应用级构建配置
- `android/app/src/main/AndroidManifest.xml` - Android 清单

## 🎯 下一步

构建完成后：
1. ✅ 在真机上测试应用
2. ✅ 检查所有功能是否正常
3. ✅ 配置签名（用于 Release 版本）
4. ✅ 发布到应用商店（可选）

## 📞 需要帮助？

如果遇到问题：
1. 查看 Android Studio 的日志
2. 检查 Gradle 同步状态
3. 查看 `DEPLOYMENT.md` 中的常见问题
4. 确保所有依赖都已安装

---

**推荐使用 Android Studio 构建，这是最简单可靠的方法！** 🚀

