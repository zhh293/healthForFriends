# Capacitor 配置说明

## capacitor.config.ts 配置示例

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.workout.tracker',
  appName: '健身计划',
  webDir: 'dist',
  
  // 服务器配置
  server: {
    androidScheme: 'https',
    // 开发时的本地服务器地址（可选）
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  
  // Android 特定配置
  android: {
    allowMixedContent: true,
    minVersion: 22,
    targetVersion: 33,
    // 使用 ProGuard 混淆代码（生产环境）
    // buildOptions: {
    //   proguardEnabled: true
    // }
  },
  
  // iOS 特定配置（如需要）
  ios: {
    scheme: 'workout-tracker',
    // 如果需要支持特定功能
    // contentInset: 'automatic'
  },
  
  // 插件配置
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#ff6b6b'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
```

## Android 配置清单

### android/app/build.gradle 关键配置

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.workout.tracker"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

### android/app/src/main/AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
    
</manifest>
```

## 图标和启动画面配置

### 1. 生成图标

使用在线工具生成多尺寸图标：
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [App Icon Generator](https://www.appicon.co/)

需要的图标尺寸：
- mipmap-mdpi: 48x48
- mipmap-hdpi: 72x72
- mipmap-xhdpi: 96x96
- mipmap-xxhdpi: 144x144
- mipmap-xxxhdpi: 192x192

### 2. 替换图标

```bash
# 复制图标文件到相应目录
cp icon-mdpi.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp icon-hdpi.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
# ... 其他尺寸
```

### 3. 配置启动画面

在 `capacitor.config.ts` 中配置 SplashScreen 插件：

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#ff6b6b', // 使用你的主题色
    showSpinner: false,
    launchAutoHide: true
  }
}
```

## 常用 Capacitor 命令

```bash
# 查看所有命令
npx cap -h

# 同步项目到原生平台
npx cap sync

# 仅复制文件（不更新原生配置）
npx cap copy

# 查看项目状态
npx cap doctor

# 打开原生项目
npx cap open android
npx cap open ios

# 添加平台
npx cap add android
npx cap add ios

# 移除平台
npx cap remove android
```

## 开发调试

### 使用 Chrome DevTools 调试

1. 在 Android 设备上打开应用
2. 连接设备到电脑
3. 在 Chrome 中打开 `chrome://inspect`
4. 点击应用名称进行远程调试

### 查看日志

```bash
# Android 日志
adb logcat | grep "Capacitor"

# 或使用 Android Studio 的 Logcat 窗口
```

## 构建配置

### Debug 构建

```bash
cd android
./gradlew assembleDebug
```

生成的 APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release 构建

需要先配置签名（见 DEPLOYMENT.md）

```bash
cd android
./gradlew assembleRelease
```

生成的 APK: `android/app/build/outputs/apk/release/app-release.apk`

## 优化配置

### 1. ProGuard 混淆（Release）

在 `android/app/build.gradle` 中启用：

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. 减小 APK 大小

```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
            universalApk false
        }
    }
}
```

### 3. 启用 R8 优化

`android/gradle.properties`:

```properties
android.enableR8=true
android.enableR8.fullMode=true
```

## 常见问题

### 1. 白屏问题

检查：
- `webDir` 路径是否正确
- 是否运行了 `npm run build`
- `index.html` 的 base 路径

### 2. 插件不可用

```bash
# 重新同步
npx cap sync

# 检查插件是否正确安装
npm list @capacitor/core
```

### 3. 热重载不工作

使用 `npx cap sync` 而不是 `npx cap copy`，并在 Android Studio 中手动重新加载。

### 4. 权限问题

在 `AndroidManifest.xml` 中添加所需权限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 环境变量配置

创建 `.env` 文件：

```env
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 更新 Capacitor

```bash
# 查看当前版本
npx cap --version

# 更新 Capacitor CLI
npm install -g @capacitor/cli@latest

# 更新依赖
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/android@latest

# 更新项目
npx cap update
```

## 参考资料

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发指南](https://developer.android.com/guide)
- [Capacitor 插件列表](https://capacitorjs.com/docs/plugins)
- [Capacitor 社区插件](https://github.com/capacitor-community)
