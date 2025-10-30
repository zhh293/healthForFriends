# 不安装 Android Studio 构建 APK 的解决方案

## 😅 当前问题

Gradle 下载时遇到 SSL 证书验证问题。这是因为 Gradle 需要通过 HTTPS 下载。

## 🎯 三种解决方案

### 方案 1：手动下载 Gradle（推荐）⭐

这是最简单的方法：

#### 步骤：

1. **手动下载 Gradle**
   - 访问：https://gradle.org/releases/
   - 下载 Gradle 8.0.2 完整版（binary-only 也可以）
   - 或直接下载：https://services.gradle.org/distributions/gradle-8.0.2-all.zip

2. **解压到用户目录**
   - 解压到：`C:\Users\你的用户名\.gradle\wrapper\dists\gradle-8.0.2-all\随机字符串\`
   - Windows 下完整路径类似：
   ```
   C:\Users\YourUsername\.gradle\wrapper\dists\gradle-8.0.2-all\[hash]\gradle-8.0.2-all\
   ```

3. **创建随机文件夹名**
   - Gradle 会生成一个随机哈希文件夹
   - 你可以创建任意文件夹名（如：`xyz123`）
   - 将解压的内容放进去

4. **重新构建**
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

### 方案 2：配置代理/使用镜像

如果你有代理或国内镜像：

#### 使用国内镜像：

创建或编辑 `android/gradle/wrapper/gradle-wrapper.properties`：

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
# 使用国内镜像
distributionUrl=https\://mirrors.huaweicloud.com/gradle/gradle-8.0.2-all.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

或使用阿里云镜像：
```properties
distributionUrl=https\://mirrors.aliyun.com/gradle/gradle-8.0.2-all.zip
```

#### 配置代理：

编辑 `android/gradle.properties`：

```properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=1080
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=1080
```

### 方案 3：使用 npm 工具（最简单）

使用现成的 npm 包来构建：

```bash
# 安装工具
npm install -g nativefier
# 或者使用 Capacitor 的命令行工具
npm install -g @capacitor/cli
```

但这还是需要 Android SDK...

## 🎊 最简单的方法

**我建议你下载 Android Studio**，原因：

1. ✅ 自动处理所有依赖
2. ✅ 自动下载 Gradle
3. ✅ 图形界面，简单直观
4. ✅ 可以调试和测试
5. ✅ 一次安装，长期使用

### Android Studio 下载

- 官网：https://developer.android.com/studio
- 大小：约 1GB
- 安装后选择 "Standard" 安装
- 会自动安装 Android SDK、Gradle 等

**但如果你坚持不用 Android Studio...**

## 🔧 最实用解决方案

让我帮你创建一个一键脚本，尝试多种方法：

1. 先尝试使用镜像下载
2. 如果失败，提示你手动下载
3. 如果还失败，建议安装 Android Studio

让我修改 gradle wrapper 配置使用镜像：

