# 健身计划追踪应用 - v0 提示文档

## 项目概述
创建一个每日健身计划追踪应用，支持计划的增删改查，每日自动重置，并可使用 Capacitor 打包为 Android APK。

## 技术栈
- Vue 3 (Composition API)
- TypeScript
- Capacitor
- LocalStorage/PouchDB 用于数据存储
- Vite 作为构建工具

## 核心功能需求

### 1. 每日健身计划管理
- **添加计划**: 用户可以添加新的健身项目（例如：俯卧撑、跑步、仰卧起坐等）
- **修改计划**: 可以编辑已有计划的内容
- **删除计划**: 可以删除不需要的计划
- **标记完成**: 点击复选框标记某项计划已完成，显示 ✅
- **重置已完成状态**: 重新开始某项计划

### 2. 每日自动清空
- 每天的 00:00 自动清空前一天的计划
- 只保留当天的计划数据
- 提供选项查看已完成的历史记录

### 3. 数据持久化
- 使用 LocalStorage 存储当天的计划数据
- 使用单独的数据结构存储历史记录
- 支持数据导出/导入功能（可选）

### 4. 用户界面设计
- **美观现代的 UI**:
  - 使用渐变背景色（例如：健身主题的配色方案）
  - 卡片式设计展示每个健身项目
  - 圆角、阴影效果提升视觉层次
  - 添加图标的健身项目
  - 响应式布局，适配移动端和桌面端
  - 平滑的动画过渡效果

- **主界面包含**:
  - 顶部标题栏显示当前日期
  - 添加新计划按钮（浮动按钮或顶部按钮）
  - 健身计划列表（卡片形式）
  - 每个卡片包含：
    - 健身项目名称
    - 完成状态复选框
    - 编辑按钮（铅笔图标）
    - 删除按钮（垃圾桶图标）
  - 底部统计信息（总计划数、已完成数、完成率）

- **添加/编辑计划模态框**:
  - 输入框：健身项目名称
  - 可选字段：运动时长、目标次数等
  - 保存/取消按钮

### 5. 交互体验
- 点击复选框即时更新完成状态
- 滑动删除操作（移动端）
- 添加新计划时的输入验证
- 空状态提示（当天还没有计划时）
- 完成任务时的庆祝动画效果
- 加载状态反馈

### 6. 主题和样式
- 使用健身主题色彩（例如：活力橙、活力蓝、健康绿）
- 支持浅色/深色主题切换（可选）
- 现代化的字体和间距
- 图标库使用（例如：Heroicons, Phosphor Icons）

## 组件结构

```
App.vue
├── WorkoutHeader.vue (顶部标题栏，显示日期)
├── AddWorkoutButton.vue (添加按钮)
├── WorkoutList.vue (计划列表)
│   └── WorkoutCard.vue (单个计划卡片)
│       ├── Checkbox (完成状态)
│       ├── EditIcon (编辑按钮)
│       └── DeleteIcon (删除按钮)
├── WorkoutModal.vue (添加/编辑模态框)
└── StatisticsBar.vue (底部统计信息)
```

## 数据结构

```typescript
interface WorkoutItem {
  id: string;
  name: string;
  completed: boolean;
  createdAt: string; // ISO timestamp
  duration?: number; // 可选：运动时长（分钟）
  targetReps?: number; // 可选：目标次数
}

interface DailyData {
  date: string; // YYYY-MM-DD
  workouts: WorkoutItem[];
}
```

## 功能实现要点

### 1. 每日自动清空
- 使用 `setInterval` 或 `setTimeout` 检查当前日期
- 如果日期变化，清空当天的计划数据
- 可以将旧数据移到历史记录中

### 2. 数据存储
- 使用 LocalStorage key: `workout_${date}`
- 使用 LocalStorage key: `workout_history` 存储历史记录

### 3. CRUD 操作
- **Create**: 添加新计划，生成唯一 ID（UUID 或 timestamp）
- **Read**: 从 LocalStorage 读取当天计划
- **Update**: 更新计划内容和完成状态
- **Delete**: 从数组中移除并更新 LocalStorage

## UI/UX 设计建议

### 配色方案
- 主色：渐变色背景（橙色到粉色：`#ff6b6b` → `#feca57`）
- 卡片背景：白色/浅灰色
- 完成状态：绿色（`#51cf66`）
- 文本：深灰色（`#2d3436`）
- 强调色：蓝色（`#0984e3`）

### 图标建议
- 添加按钮：+ icon
- 编辑：pencil icon
- 删除：trash icon
- 完成：checkmark icon
- 健身：dumbbell icon

### 动画效果
- 卡片添加：fade-in + slide-up
- 卡片删除：slide-out + fade-out
- 复选框切换：scale animation
- 完成任务：confetti 或 pulse 效果

## Capacitor 配置需求

### Android 配置
- 最小 SDK 版本：22
- 目标 SDK 版本：33
- 权限：不需要特殊权限

### 打包配置
- 应用名称：健身计划
- 包名：com.workout.tracker
- 图标：使用健身主题的图标
- 启动画面：健身主题的启动画面

## 开始使用提示词（供 v0 使用）

"创建一个现代美观的健身计划追踪应用，使用 Vue 3 和 TypeScript。主界面显示当天的健身计划列表，每个计划以卡片形式展示，包含名称、完成复选框、编辑和删除按钮。顶部有添加新计划的按钮和当前日期显示。底部显示完成统计。使用渐变色背景（橙色到粉色），卡片使用白色背景和圆角阴影。支持添加、编辑、删除和标记完成功能。添加和编辑时弹出模态框。使用 LocalStorage 存储数据。应用每天自动清空前一天的计划。整个界面应该现代化、响应式，并包含平滑的动画效果。"

## 项目文件结构

```
workout-tracker/
├── src/
│   ├── components/
│   │   ├── WorkoutHeader.vue
│   │   ├── AddWorkoutButton.vue
│   │   ├── WorkoutList.vue
│   │   ├── WorkoutCard.vue
│   │   ├── WorkoutModal.vue
│   │   └── StatisticsBar.vue
│   ├── composables/
│   │   ├── useWorkouts.ts
│   │   └── useDailyReset.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   └── date.ts
│   ├── App.vue
│   └── main.ts
├── capacitor.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 启动和部署说明

见下方详细的部署文档。
