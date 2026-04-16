以下由qclaw ai总结
> 基于博客项目（2025-blog-public）的countdown卡片实战总结，面向零基础学习者。
> 
> 学习路线：从页面骨架 → 样式美化 → 交互逻辑 → 工程化管理。

---

## 学习路线图

```
第一阶段：页面基础
  HTML（网页骨架）
  → CSS（样式美化）
  → JavaScript（行为逻辑）

第二阶段：React 框架
  JSX 语法
  → 组件写法
  → Props（传值）
  → State（状态）
  → Hooks（工具函数）
  → 客户端组件 vs 服务端组件

第三阶段：TypeScript 类型
  类型注解
  → 接口定义
  → JSON 数据导入

第四阶段：Next.js 工程化
  项目结构
  → 路由系统
  → 静态资源
  → 部署上线

第五阶段：状态管理
  Zustand 状态库
  → Zustand Store（全局数据）

第六阶段：实战技巧
  SSR 与水合
  → 响应式布局
  → 动画库
  → 依赖管理
```

---

# 第一阶段：页面基础

## 1. HTML — 网页骨架

### 核心概念

HTML 是"超文本标记语言"，告诉浏览器这个页面上有什么内容（标题、按钮、图片、输入框等）。

```html
<!-- 一个最简单的网页 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的网页</title>
</head>
<body>
    <h1>这是标题</h1>
    <p>这是段落文字</p>
    <button>点击我</button>
</body>
</html>
```

### 博客项目中的 HTML

博客中的独立页面 `public/countdown.html` 就是一个纯 HTML 文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>目标倒计时</title>
</head>
<body>
    <!-- 表单区域 -->
    <select id="birthYear"></select>
    <button onclick="calculateTime()">开始计算</button>
    <!-- 结果展示区域 -->
    <div id="resultSection"></div>
</body>
</html>
```

> 📌 **`<meta charset="UTF-8">`**：声明字符编码，网页中出现中文必须写这行，否则乱码。
> 
> 📌 **`<meta name="viewport">`**：让网页能适配手机屏幕，没有这行手机访问会显示缩小的桌面版页面。

### 举一反三

| 标签 | 作用 | 何时用 |
|------|------|--------|
| `<a href="/countdown.html">跳转</a>` | 超链接 | 页面间跳转 |
| `<img src="/images/avatar.png">` | 图片 | 显示图片 |
| `<input type="number">` | 数字输入框 | 倒计时目标年龄 |
| `<select>` + `<option>` | 下拉选择框 | 出生年月选择 |
| `<div>` | 容器 | 把相关元素打包成一组 |

---

## 2. CSS — 样式美化

### 核心概念

CSS 控制网页长什么样：颜色、字体、大小、间距、位置。

```css
/* 选择器 { 属性: 值; } */
body {
    background-color: #f5f7fa;   /* 背景色 */
    color: #333333;              /* 文字颜色 */
    font-family: sans-serif;    /* 字体 */
}

.card {
    background: white;
    border-radius: 12px;          /* 圆角 */
    box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* 阴影 */
    padding: 30px;                /* 内边距 */
}
```

### Tailwind CSS（博客用的方式）

不用写单独的 CSS 文件，直接在 HTML/JSX 里写样式类名：

```tsx
// 这就是 Tailwind CSS 的写法（不需要写单独的 .css 文件）
<div className="flex items-center gap-1 p-2">
  <span className="text-brand text-sm font-bold">60</span>
</div>
```

常用 Tailwind 类名速查：

| 类名 | 等价 CSS | 含义 |
|------|---------|------|
| `flex` | `display: flex` | 弹性布局 |
| `items-center` | `align-items: center` | 垂直居中 |
| `gap-1` | `gap: 0.25rem` | 元素间距 |
| `p-2` | `padding: 0.5rem` | 内边距 |
| `rounded` | `border-radius: 0.25rem` | 圆角 |
| `text-sm` | `font-size: 0.875rem` | 小号文字 |
| `font-bold` | `font-weight: 700` | 加粗 |
| `fixed` | `position: fixed` | 固定定位 |
| `max-sm:hidden` | `@media (max-width: 640px) { display: none }` | 手机端隐藏 |

> 💡 **为什么用 Tailwind？**
> 传统 CSS 要先定义类，再在 HTML 里用。Tailwind 直接在标签上写样式，改起来快，但初学者建议先懂 CSS 原理再上手 Tailwind。

### 举一反三

**响应式设计（让页面在不同屏幕都能看）**

```css
/* 传统 CSS 写法 */
@media (max-width: 640px) {
    .card { display: none; }       /* 手机端隐藏 */
}

/* Tailwind 写法（同效果） */
<div className="max-sm:hidden">...</div>
```

---

## 3. JavaScript — 行为逻辑

### 核心概念

HTML 写骨架，CSS 写样子，JavaScript 写行为。JS 让网页能动起来。

```javascript
// 变量
const name = "小明"
let age = 18          // let 可以重新赋值
age = 19

// 函数
function calculateTime(birthYear, targetAge) {
    const targetDate = new Date(birthYear + targetAge, 5, 1)
    const today = new Date()
    const diffMs = targetDate - today
    const days = Math.ceil(diffMs / 86400000)
    return days
}

// 条件判断
if (days < 0) {
    console.log("已超过目标日期")
} else {
    console.log("还剩 " + days + " 天")
}

// 数组操作
const fruits = ["苹果", "香蕉", "橙子"]
fruits.map(f => f + "!")  // ["苹果!", "香蕉!", "橙子!"]
```

### 博客项目中的 JS（countdown.html 内联脚本）

```javascript
// DOM 操作：找到页面上的元素
const yearSelect = document.getElementById('birthYear')
const resultSection = document.getElementById('resultSection')

// 给按钮绑定点击事件
button.addEventListener('click', calculateTime)

// 动态创建下拉选项
for (let i = 2000; i <= 2025; i++) {
    const option = document.createElement('option')
    option.value = i
    option.text = i + "年"
    yearSelect.appendChild(option)
}

// 计算日期差
const diffTime = targetDate - today
const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

// 更新页面内容
document.getElementById('totalDays').innerText = totalDays
```

### 举一反三

**DOM（Document Object Model）**

浏览器把 HTML 解析成一棵树，JS 可以增删改这棵树上的任意节点：

```javascript
// 查
document.getElementById('id名')           // 按 ID 找（唯一）
document.querySelector('.class名')         // 按选择器找
document.querySelectorAll('div')           // 找所有 div

// 改
element.innerText = '新文字'                // 改文字
element.style.color = 'red'                // 改样式
element.classList.add('hidden')            // 加 CSS 类
element.classList.remove('hidden')         // 移除 CSS 类

// 新建
const div = document.createElement('div')
div.innerText = '新元素'
document.body.appendChild(div)

// 删
element.remove()
```

---

# 第二阶段：React 框架

## 1. 什么是 React？

React 是一个"组件化"的网页开发框架。传统 HTML 一个页面写所有内容，React 把页面拆成一个个**组件（Component）**，每个组件只管自己那块。

```
传统 HTML：一个巨大文件，5000 行
React：一个页面 = 多个组件文件，每个文件几十行
```

## 2. JSX — React 的语法

JSX = JavaScript + HTML，在 JS 代码里直接写 HTML 结构：

```tsx
// 普通 JavaScript 拼接字符串（容易出错）
const html = '<div><span>' + name + '</span></div>'

// JSX（像写 HTML 一样，但能用 JS 变量）
const element = <div><span>{name}</span></div>

// 在大括号 {} 里写 JS 表达式
const age = 22
const card = (
    <div className="card">
        <span className="text-brand">{age + 1}</span>  {/* 显示 23 */}
        <span>{age >= 18 ? '成年' : '未成年'}</span>
    </div>
)
```

> ⚠️ **注意**：JSX 里 `class` 要写成 `className`（因为 JS 里 `class` 是关键字）。

## 3. 组件写法

### 函数组件（推荐）

```tsx
// countdown-button.tsx
import { Hourglass } from 'lucide-react'   // 导入图标
import clsx from 'clsx'                     // 导入工具函数

type CountdownButtonProps = {               // Props 类型定义（TypeScript）
    delay?: number                          // ? 表示可选参数
    className?: string
}

export default function CountdownButton({ delay, className }: CountdownButtonProps) {
    // 组件内容在这里
    return (
        <button className={clsx('card', className)}>
            <Hourglass size={28} />
        </button>
    )
}
```

**组件命名规则**：文件名和组件名都用 PascalCase（每个单词首字母大写），如 `CountdownCard`、`SocialButtons`。

### 组件使用

```tsx
// 在其他文件里导入使用
import CountdownButton from '@/components/countdown-button'

// 传参数（Props）
<CountdownButton delay={500} className="mx-2" />
```

## 4. Props — 组件之间传值

Props = "Properties"，父组件向子组件传递数据：

```tsx
// 父组件
<CountdownButton delay={500} title="倒计时" />

// 子组件
function CountdownButton({ delay, title }) {
    return <button>{title}，延迟{delay}毫秒后显示</button>
}
```

### 博客项目中的 Props 用法

```tsx
// hi-card.tsx 中引用 art-card 的 order 属性
const artCardStyles = cardStyles.artCard
const order = artCardStyles.order  // 从配置里读出来，传给其他组件
```

### 举一反三

**Props 传递函数（子组件通知父组件）**

```tsx
// 父组件：定义一个函数，传给子组件
function Parent() {
    const handleClick = () => console.log("子组件点我了!")
    return <Child onClick={handleClick} />
}

// 子组件：调用父组件传来的函数
function Child({ onClick }) {
    return <button onClick={onClick}>点我</button>
}
```

---

## 5. State — 组件内部的状态

State = 会变化的数据，变化后页面自动更新。

```tsx
import { useState } from 'react'

function Counter() {
    const [count, setCount] = useState(0)   // 初始值 0

    return (
        <div>
            <span>{count}</span>              {/* 显示数字 */}
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
        </div>
    )
}
```

### 常见问题：为什么用 setX 函数而不是直接赋值？

```tsx
// ❌ 错误：改了 state 但 React 不知道，不会重新渲染
count = 100

// ✅ 正确：用 setCount 函数
setCount(100)

// ✅ 如果新值依赖旧值，用箭头函数
setCount(prev => prev + 1)
```

### 博客项目中的 State 用法

```tsx
// countdown-button.tsx
const [show, setShow] = useState(false)      // 初始隐藏

useEffect(() => {
    setTimeout(() => {
        setShow(true)                        // 延迟后显示
    }, delay || 1000)
}, [])

// show 为 true 时才渲染按钮
if (show) {
    return <motion.button>...</motion.button>
}
```

## 6. Hooks — React 工具函数

Hooks 是 React 提供的内置工具，让函数组件也有"状态"和"生命周期"能力。

### useState — 保存状态

```tsx
const [name, setName] = useState("默认名")
```

### useEffect — 处理副作用

副作用 = 和渲染无关的操作：请求数据、订阅事件、操作 DOM、设置定时器。

```tsx
useEffect(() => {
    // 组件挂载后执行这里（类似 onMount）
    const timer = setTimeout(() => setShow(true), 1000)
    window.addEventListener('resize', handleResize)

    return () => {
        // 组件卸载时执行这里（类似 onDestroy）
        clearTimeout(timer)
        window.removeEventListener('resize', handleResize)
    }
}, [])  // 空数组 = 只执行一次（挂载时）
```

### 博客项目中 useEffect 的三个典型用法

**① 延迟显示（动画入场）**

```tsx
useEffect(() => {
    setTimeout(() => setShow(true), delay || 1000)
}, [])
```

**② 监听窗口大小变化**

```tsx
useEffect(() => {
    const updateX = () => setX(window.innerWidth - CARD_WIDTH - 24)
    updateX()
    window.addEventListener('resize', updateX)
    return () => window.removeEventListener('resize', updateX)  // 清理！否则内存泄漏
}, [])
```

**③ 监听键盘事件**

```tsx
useEffect(() => {
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            setConfigDialogOpen(true)
        }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

### 举一反三

**useEffect 依赖数组的作用**

```tsx
useEffect(() => {
    console.log("count 变化了:", count)
}, [count])   // count 变化时才执行

useEffect(() => {
    console.log("任意 state 变化都执行")
})            // 不写数组 = 每次渲染都执行

useEffect(() => {
    console.log("只执行一次")
}, [])         // 空数组 = 只执行一次
```

---

## 7. 客户端组件 vs 服务端组件

这是 Next.js（React 框架）的概念，文件顶部的 `'use client'` 声明决定组件在哪里运行：

| | 服务端组件（无 `'use client'`） | 客户端组件（`'use client'`） |
|--|------------------------------|--------------------------|
| 运行位置 | 服务器（Node.js） | 浏览器 |
| 能用 useState | ❌ 不能 | ✅ 能 |
| 能用 useEffect | ❌ 不能 | ✅ 能 |
| 能用 window/document | ❌ 不能 | ✅ 能 |
| 能用浏览器 API | ❌ 不能 | ✅ 能 |
| 能访问数据库 | ✅ 能 | ❌ 不能 |

```tsx
// countdown-card.tsx
'use client'        // 这行必须有！否则 useState、useEffect 会报错

import { useState, useEffect } from 'react'
// ...
```

**为什么有这个区别？**
服务端渲染的页面，加载更快、SEO 更好。客户端组件支持交互，但需要在浏览器里运行。

> 💡 **记忆技巧**：只要组件里有 `useState`、`useEffect`、`onClick`，就必须加 `'use client'`。

---

# 第三阶段：TypeScript 类型

## 1. 为什么需要 TypeScript？

JavaScript 是动态类型语言，写错变量类型不报错，上线后才发现 bug。TypeScript 在写代码时就告诉你哪里错了。

```tsx
// JavaScript（不报错，但运行时会出问题）
function getAge(name) {
    return name + 1   // name 是字符串，加不了 1
}
getAge("小明")  // 运行结果："小明1" （非预期）

// TypeScript（写的时候就报错）
function getAge(name: string): number {
    return name + 1   // ❌ 报错：string 和 number 不能相加
}
```

## 2. 基础类型注解

```tsx
const name: string = "小明"           // 字符串
const age: number = 22                // 数字
const married: boolean = false         // 布尔值
const hobbies: string[] = ["游戏", "音乐"]  // 字符串数组
const mixed: (string | number)[] = [1, "two", 3]  // 混合数组

// 函数参数和返回值类型
function add(a: number, b: number): number {
    return a + b
}
```

## 3. 对象类型与接口

```tsx
// 接口定义对象的形状
type CardConfig = {
    width: number
    height: number
    enabled: boolean
    offsetX: number | null   // 可以是数字，也可以是 null
}

// 使用
const card: CardConfig = {
    width: 200,
    height: 80,
    enabled: true,
    offsetX: null
}

// 可选属性（属性名后面加 ?）
type ButtonProps = {
    label: string
    onClick: () => void
    disabled?: boolean     // ? = 这个属性可以不传
}
```

## 4. Props 类型（博客项目中的用法）

```tsx
// 定义 Props 类型
type CountdownButtonProps = {
    delay?: number          // 可选参数
    className?: string
}

// 在函数参数里使用
export default function CountdownButton({ delay, className }: CountdownButtonProps) {
    // ...
}
```

### 举一反三

**typeof 提取已有对象的类型**

```tsx
// 从 JSON 文件推断类型
import cardStyles from '@/config/card-styles.json'

// 自动推断出所有字段的类型，不用自己写
type CardStyles = typeof cardStyles

// 从组件的 Props 推断类型
type CountdownButtonProps = React.ComponentProps<typeof CountdownButton>
```

---

# 第四阶段：Next.js 工程化

## 1. 项目结构

```
2025-blog-public/
├── public/                 # 静态文件，直接映射到 URL
│   ├── countdown.html      # /countdown.html 能直接访问
│   └── images/             # 图片资源
├── src/
│   ├── app/               # Next.js 16 App Router（路由系统）
│   │   ├── (home)/        # 路由组（URL 不体现）
│   │   │   ├── page.tsx   # 首页 → /
│   │   │   ├── hi-card.tsx
│   │   │   └── countdown-card.tsx
│   │   ├── about/         # 关于页 → /about
│   │   └── layout.tsx     # 全局布局
│   ├── components/        # 可复用组件
│   │   └── countdown-button.tsx
│   ├── config/            # 配置文件（JSON）
│   │   ├── card-styles.json
│   │   └── site-content.json
│   ├── hooks/             # 自定义 Hooks
│   │   ├── use-size.ts    # 窗口尺寸 Hook
│   │   └── use-center.ts  # 页面中心点 Hook
│   └── lib/               # 工具函数
├── package.json           # 依赖清单
└── next.config.ts         # Next.js 配置
```

## 2. 路由系统（App Router）

Next.js 16 使用文件系统路由，文件路径就是 URL：

| 文件路径 | 对应 URL |
|---------|---------|
| `src/app/page.tsx` | `/`（首页） |
| `src/app/about/page.tsx` | `/about` |
| `src/app/(home)/hi-card.tsx` | —（这是组件不是页面，没有 URL） |

**路由组 `(home)`**：括号里的目录名不出现在 URL 里，只用于组织文件。

## 3. 路径别名 `@/`

```tsx
// 不用别名（相对路径，容易写错）
import HiCard from '../../hi-card'

// 用别名（推荐，从 src 开始写）
import HiCard from '@/app/(home)/hi-card'

// 别名在 tsconfig.json 中定义
// "paths": { "@/*": ["./src/*"] }
```

## 4. 静态资源（public 目录）

放在 `public/` 里的文件，可以直接通过 URL 访问：

```tsx
// public/countdown.html → 通过 /countdown.html 访问
// public/images/avatar.png → 通过 /images/avatar.png 访问

// 在 HTML/JSX 中引用
<a href="/countdown.html">倒计时</a>
<img src="/images/avatar.png" alt="头像" />
```

### 举一反三

**什么时候放 public，什么时候放 src？**

| 放 public | 放 src |
|----------|--------|
| 纯静态文件（HTML、图片、字体） | 需要组件化处理的 |
| 用户上传的内容 | 代码（.tsx、.ts） |
| 直接用 URL 访问的文件 | 配置 JSON（但 JSON 也要 import） |

## 5. 部署到 Vercel

博客已配置 GitHub 仓库连接 Vercel，每次 push 到 main 分支自动部署：

```
GitHub push → Vercel 自动构建 → 生成网址（如 lxsonline.qzz.io）
```

本地调试命令：
```bash
pnpm dev      # 开发服务器，localhost:2025
pnpm build    # 生产构建
pnpm start    # 启动生产服务器
```

---

# 第五阶段：状态管理

## 1. 什么是状态管理？

组件之间需要共享数据：比如"用户名字"要在 hi-card 显示，也要在配置弹窗里显示。用 Props 层层传递很麻烦，这时候用**全局状态管理**。

```
Props 传值（仅限父子组件）
         ↓
    Context / Redux / Zustand（全局数据）
         ↓
    任意组件都能读到
```

## 2. Zustand（博客项目用的状态库）

Zustand 是一个轻量级的全局状态管理工具，比 Redux 简单得多。

### 创建 Store

```tsx
// stores/config-store.ts
import { create } from 'zustand'

interface ConfigStore {
    siteContent: object     // 网站配置数据
    cardStyles: object      // 卡片样式配置
    configDialogOpen: boolean  // 配置弹窗是否打开
    setConfigDialogOpen: (open: boolean) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
    siteContent: {},
    cardStyles: {},
    configDialogOpen: false,
    setConfigDialogOpen: (open) => set({ configDialogOpen: open }),
}))
```

### 组件中使用

```tsx
// 在任意组件里直接读取和修改
import { useConfigStore } from '@/app/(home)/stores/config-store'

function MyComponent() {
    // 读取状态
    const { cardStyles, configDialogOpen, setConfigDialogOpen } = useConfigStore()

    return (
        <div>
            <p>卡片配置：{JSON.stringify(cardStyles)}</p>
            <button onClick={() => setConfigDialogOpen(true)}>
                打开配置弹窗
            </button>
        </div>
    )
}
```

### 举一反三

**Zustand vs 其他方案对比**

| 方案 | 复杂度 | 适用场景 |
|------|--------|---------|
| Props 直接传 | 最简单 | 父→子→孙，一两层 |
| Context API | 中等 | 全局数据，不需要频繁更新 |
| Zustand | 简单 | 需要频繁读写的全局状态（本博客用法） |
| Redux | 复杂 | 超大型项目 |

---

# 第六阶段：实战技巧

## 1. SSR（服务端渲染）与水合（Hydration）

### 什么是 SSR？

传统 React：浏览器下载 JS → 执行 JS → 生成页面（白屏等待）
SSR：服务器预先渲染好 HTML → 浏览器直接显示 → JS 接管（更快、更利于 SEO）

### 水合（Hydration）

SSR 生成的 HTML 只是一个"骨架"，浏览器还需要把 React 代码"附着"上去，这个过程叫水合。

### 常见错误：hydration mismatch（水合不匹配）

服务端和客户端渲染的内容不一致 → 报错。

**典型场景**：服务端不知道窗口宽度，但客户端知道。

```tsx
// ❌ 错误：服务端没有 window.innerWidth
const width = window.innerWidth
const x = width - CARD_WIDTH

// ✅ 正确：用 useEffect 等客户端渲染后再读
const [x, setX] = useState(-CARD_WIDTH)  // 服务端渲染时的默认值
const [mounted, setMounted] = useState(false)

useEffect(() => {
    setX(window.innerWidth - CARD_WIDTH)
    setMounted(true)
}, [])

return <div style={{ opacity: mounted ? 1 : 0 }}>...</div>
```

> 💡 **核心原则**：所有用到 `window`、`document`、浏览器 API 的代码，都必须放在 `useEffect` 里。

## 2. 响应式布局 — useSize Hook

`useSize` 是一个自定义 Hook，监听窗口宽度并返回布尔值：

```tsx
import { useSize } from '@/hooks/use-size'

function MyComponent() {
    const { maxSM } = useSize()
    // maxSM = true  → 手机端（宽度 < 640px）
    // maxSM = false → 桌面端

    return (
        <div>
            {maxSM ? (
                <p>这是手机端</p>
            ) : (
                <p>这是桌面端</p>
            )}
        </div>
    )
}
```

### 屏幕断点

| 变量 | 触发条件 | 含义 |
|------|---------|------|
| `maxXS` | width < 360px | 超小屏幕 |
| `maxSM` | width < 640px | 手机 |
| `maxMD` | width < 768px | 大手机/小平板 |
| `maxLG` | width < 1024px | 平板 |
| `maxXL` | width < 1280px | 小桌面 |

### 博客项目中的响应式用法

```tsx
// page.tsx 中的条件渲染

{/* 桌面端专属 */}
{!maxSM && cardStyles.countdownCard?.enabled !== false && <CountdownCard />}

{/* 手机端专属 */}
{maxSM && cardStyles.countdownPosition?.enabled !== false && <CountdownPosition />}
```

> 💡 **注意**：`maxSM` 是 `true` 表示手机，所以 `!maxSM` 表示桌面。逻辑不要搞反。

## 3. 动画库 — Motion（motion/react）

博客用 `motion/react` 做动画，不需要写 CSS transition。

```tsx
import { motion } from 'motion/react'

// 基础动画
<motion.div
    initial={{ opacity: 0, scale: 0.6 }}    // 初始状态
    animate={{ opacity: 1, scale: 1 }}       // 动画到最终状态
    whileHover={{ scale: 1.05 }}             // 悬停时
    whileTap={{ scale: 0.95 }}               // 点击时
    transition={{ duration: 0.3 }}           // 动画时长
>
    内容
</motion.div>

// 动画属性速查
{ opacity: 0~1 }        // 透明度
{ scale: 0~1 }          // 缩放（1 = 原始大小）
{ x: 0, y: 0 }          // 位移
{ rotate: 0~360 }       // 旋转角度
{ borderRadius: "50%" } // 圆角
```

### 举一反三

**心跳动画（持续循环）**

```tsx
// 需要在 CSS 中定义 .heartbeat 动画
// @keyframes heartbeat { 0%,100%{ transform: scale(1) } 50%{ transform: scale(1.15) } }
// 然后在元素上加 className="heartbeat"

<Hourglass className="heartbeat text-secondary" size={28} />
```

## 4. 图标库 — Lucide React

Lucide 是一个开源图标库，图标以 React 组件形式提供。

```tsx
import { Hourglass, Clock, Calendar, Heart, Share2 } from 'lucide-react'

// 使用方式：直接当组件用
<Hourglass size={28} className="text-brand" />
<Clock size={20} />
<Heart fill="red" />
```

常用图标速查（Lucide 图标库 thousands of icons）：

| 图标 | 适合场景 |
|------|---------|
| `Hourglass` | 倒计时 |
| `Clock` | 时钟 |
| `Calendar` | 日历 |
| `Heart` | 点赞 |
| `Share2` | 分享 |
| `Edit3` | 编辑 |
| `Github` | GitHub |
| `Mail` | 邮箱 |

图标库官网：https://lucide.dev （可搜索所有图标）

## 5. Tailwind CSS 工具 — clsx

`clsx` 根据条件拼接 CSS 类名：

```tsx
import clsx from 'clsx'

// ❌ 不用 clsx（容易出错）
<div className={'card ' + (active ? 'active' : '') + ' ' + className}>

// ✅ 用 clsx（更清晰）
<div className={clsx('card', active && 'active', className)}>

// 实际效果
clsx('card', false, 'mx-2')  // → "card mx-2"
clsx('card', true, 'mx-2')   // → "card active mx-2"
```

## 6. 窗口位置计算 — useCenterStore

有些卡片需要相对于页面中心定位（比如点赞按钮）。`useCenterStore` 存储了窗口中心点的坐标：

```tsx
import { useCenterStore } from '@/hooks/use-center'

function LikePosition() {
    const center = useCenterStore()
    // center.x  = 窗口宽度 / 2
    // center.y  = 窗口高度 / 2 - 24
    // center.width  = 窗口宽度
    // center.height = 窗口高度

    const x = center.x + 100  // 中心点右边 100px
    const y = center.y - 50   // 中心点上边 50px

    return <motion.div style={{ left: x, top: y }}>...</motion.div>
}
```

## 7. 页面跳转

```tsx
// 方式1：同窗口跳转（页面切换）
window.location.href = '/countdown.html'

// 方式2：新窗口打开（推荐，不会丢失当前页）
window.open('/countdown.html', '_blank')

// 方式3：React Router（用于 Next.js 内部页面）
// import { useRouter } from 'next/navigation'
// const router = useRouter()
// router.push('/about')
```

---

# 附录

## A. package.json 依赖解析

```json
{
  "dependencies": {
    "next": "16.0.10",          // React 框架（Next.js）
    "react": "19.2.1",          // React 核心库
    "react-dom": "19.2.1",      // React DOM 渲染
    "motion": "^12.23.24",      // 动画库
    "lucide-react": "^0.553.0", // 图标库
    "zustand": "?",             // 状态管理库
    "sonner": "^2.0.7",         // Toast 提示（弹窗通知）
    "clsx": "^2.1.1",           // CSS 类名拼接工具
    "dayjs": "^1.11.18",        // 日期处理库
    "marked": "^17.0.0",        // Markdown 解析
    "shiki": "^3.15.0",         // 代码高亮
    "katex": "^0.16.27"         // 数学公式渲染
  }
}
```

## B. JSON 数据导入

Next.js 支持直接 import JSON 文件：

```tsx
// 导入配置文件
import cardStyles from '@/config/card-styles.json'
import siteContent from '@/config/site-content.json'

// cardStyles 是一个普通 JS 对象，直接用
console.log(cardStyles.hiCard.width)  // 360
```

## C. 四个关键文件的职责总结

```
每次新建一个卡片，需要同步修改四个文件：

① card-styles.json
   → 存储卡片尺寸、位置偏移、是否启用等配置
   → 漏加 = undefined 崩溃

② config-dialog/home-layout.tsx
   → 在可视化配置弹窗里加上这个卡片的标签

③ page.tsx
   → 导入组件
   → 加渲染条件（maxSM / !maxSM / 无条件）
   → 必须判断 enabled !== false

④ public/xxx.html（可选）
   → 如果卡片需要跳转到一个独立页面，创建这个文件
```

## D. 调试技巧

**浏览器控制台（Console）**

按 F12 打开开发者工具，Console 面板可以看到 JS 运行时的错误信息。本次的报错 `"Application error"` 就是在这里看到的。

**React DevTools**

浏览器插件，可以查看组件树、props、state 值。安装地址：Chrome 扩展商店搜 "React Developer Tools"。

**网络面板（Network）**

按 F12 → Network，可以看到页面加载了哪些文件，请求了哪些接口，文件加载有没有 404。
