ai生成：

## 一、功能概述

开心胶囊是一个随机"抽签"式快乐纸条功能：
- 桌面端/手机端都显示圆形药瓶按钮（和点赞按钮并列）
- 点击后药瓶摇晃 600ms，冒出星星粒子特效
- 弹出卷轴形状纸条，从左往右展开动画
- 随机不重复抽取，看完一轮循环

---

## 二、涉及的文件（共 7 个）

| 文件 | 类型 | 作用 |
|------|------|------|
| `src/components/happy-capsule-button.tsx` | 新建 | 药瓶按钮组件（摇晃动画+星星粒子） |
| `src/components/happy-slip-modal.tsx` | 新建 | 弹窗组件（卷轴展开+内容渲染） |
| `src/app/(home)/happy-capsule-position.tsx` | 新建 | 固定定位容器（参考 like-position 结构） |
| `src/config/happy-slips.json` | 新建 | 纸条内容库（20条，支持 text/image/mixed） |
| `src/config/card-styles.json` | 修改 | 添加 happyCapsulePosition 配置项 |
| `src/app/(home)/config-dialog/home-layout.tsx` | 修改 | 配置弹窗表格添加标签 |
| `src/app/(home)/page.tsx` | 修改 | 渲染 HappyCapsulePosition 组件 |

---

## 三、JSON 数据结构

### happy-slips.json

```json
{
  "version": 1,
  "description": "开心胶囊纸条内容库",
  "slips": [
    { "id": 1, "type": "text", "content": "文字内容 😄" },
    { "id": 2, "type": "image", "imageUrl": "/images/photo.jpg" },
    { "id": 3, "type": "mixed", "content": "图文混合", "imageUrl": "/images/mix.jpg" }
  ]
}
```

### 三种类型

| type | 必填字段 | 可选字段 | 渲染效果 |
|------|---------|---------|---------|
| `text` | `content` | — | 只显示渐变文字 |
| `image` | `imageUrl` | — | 只显示一张图片 |
| `mixed` | `content` | `imageUrl` | 图片在上，文字在下 |

### imageUrl 使用方式

1. **放 public 目录**（推荐）：图片丢到 `public/images/xxx.jpg`，填写 `/images/xxx.jpg`
2. **外部链接**：直接填完整 URL，如 `https://example.com/photo.webp`
3. **id 不可重复**，新增时注意不要和已有的冲突

---

## 四、card-styles.json 配置

```json
"happyCapsulePosition": {
    "width": 54,
    "height": 54,
    "order": 9,
    "offsetX": null,
    "offsetY": null,
    "enabled": true
}
```

- `width/height`：按钮容器尺寸
- `order`：入场动画排序
- `offsetX/offsetY`：拖拽偏移，null 表示自动计算（在点赞按钮右边）
- `enabled`：是否显示

---

## 五、组件核心知识点

### 5.1 自定义 SVG 图标（Lucide 没有药瓶图标）

Lucide 图标库没有药瓶/PillBottle 图标，需要自定义 SVG：

```tsx
function PillBottleIcon({ className, size = 24 }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size}
         viewBox='0 0 24 24' fill='none' stroke='currentColor'
         strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='9' y='1' width='6' height='4' rx='1' />        {/* 瓶盖 */}
      <path d='M10 5v2a1 1 0 0 1-1 1H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1a1 1 0 0 1-1-1V5' />
      <rect x='8' y='13' width='8' height='4' rx='0.5' />      {/* 标签 */}
      <line x1='12' y1='14' x2='12' y2='16' />                 {/* 十字竖 */}
      <line x1='11' y1='15' x2='13' y2='15' />                 {/* 十字横 */}
    </svg>
  )
}
```

**要点**：和 Lucide 风格一致（strokeWidth=2、strokeLinecap=round、fill=none）

### 5.2 摇晃动画（motion/react 关键帧数组）

```tsx
animate={shaking ? {
  rotate: [0, -15, 15, -12, 12, -8, 8, -4, 4, 0],
  scale: [1, 1.15, 1.15, 1.1, 1.1, 1.08, 1.08, 1.05, 1.05, 1]
} : {}}
transition={{ duration: 0.6, ease: 'easeInOut' }}
```

**要点**：
- 用数组表示关键帧序列，motion 自动在帧之间插值
- 幅度逐渐递减（15→12→8→4→0）模拟物理衰减
- scale 微微放大再缩回，增强"晃动感"
- 600ms 后通过 setTimeout 触发弹窗

### 5.3 粒子特效（星星冒出）

```tsx
{[[-12, -16], [14, -14], [-16, 8], [16, 10]].map(([dx, dy], i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.6], x: dx, y: dy }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    style={{ left: '50%', top: '50%' }}
  >✨</motion.span>
))}
```

**要点**：
- 四个方向坐标，每个延迟 0.08s 依次冒出
- opacity [0,1,1,0] = 渐入→停留→渐出
- `pointer-events-none` 防止粒子阻挡点击
- 用 AnimatePresence 包裹，shaking=false 时自动退出

### 5.4 ⚠️ 随机不重复抽取（useRef vs useState 陷阱）

**踩坑**：最初用 useState 存储 shownIds（Set 类型），导致无限循环！

```tsx
// ❌ 错误写法 — Set 每次 setState 创建新引用 → useEffect 无限触发
const [shownIds, setShownIds] = useState<Set<number>>(new Set())

useEffect(() => {
  // ... 修改 shownIds → 触发重渲染 → useEffect 再次执行 → 死循环
  setShownIds(prev => { prev.add(id); return prev })
}, [shownIds]) // ← shownIds 每次都是新引用
```

```tsx
// ✅ 正确写法 — 用 useRef 存储，不触发重渲染
const shownIdsRef = useRef<Set<number>>(new Set())

useEffect(() => {
  if (!open) return
  const shown = shownIdsRef.current
  const remaining = allSlips.filter(s => !shown.has(s.id))
  if (remaining.length === 0) shownIdsRef.current = new Set() // 全看完，重置
  const pool = remaining.length > 0 ? remaining : allSlips
  const random = pool[Math.floor(Math.random() * pool.length)]
  shownIdsRef.current.add(random.id)
  setSlip(random)
}, [open]) // ← 只依赖 open，不会无限循环
```

**核心教训**：
- `useRef` 存不需要触发重渲染的可变数据
- `useEffect` 依赖项里不要放 Set/Map/函数等引用类型
- Set 的 `add()` 是原地修改，但 React 检测不到（需要 new Set 才触发更新）

### 5.5 卷轴展开动画

```tsx
initial={{ width: 0, opacity: 0, borderRadius: 200 }}
animate={{ width: 320, opacity: 1, borderRadius: 16 }}
exit={{ width: 0, opacity: 0, borderRadius: 200 }}
transition={{
  width: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
  opacity: { duration: 0.6 },
  borderRadius: { duration: 0.8 }
}}
```

**要点**：
- borderRadius 200→16 模拟纸条从药瓶口"挤出来"的形状变化
- ease 使用自定义贝塞尔曲线，开头快结尾慢（easeOutQuad 变体）
- 三个属性各自独立 duration，形成错落的动画节奏
- 外层 overflow-hidden 防止内容在 width=0 时溢出

### 5.6 渐变文字（跨浏览器兼容性）

**⚠️ 最大坑：夸克浏览器不支持 Tailwind 的 bg-clip-text**

```tsx
// ❌ 夸克浏览器看不见（Tailwind class 方式）
className='bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent'

// ✅ 内联 style + 显式 -webkit- 前缀（兼容性最好）
style={{
  background: 'linear-gradient(to right, #f59e0b, #fde047, #fb923c)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent'
}}
```

**兼容性方案优先级**：
1. 内联 style + `-webkit-` 前缀（当前方案）
2. 如果仍不兼容 → 回退到白色文字 + 黑色描边：
   ```tsx
   style={{ color: '#fff', WebkitTextStroke: '0.3px rgba(0,0,0,0.5)',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
   ```

**颜色选择**：
- 第一版（粉→紫→琥珀）太红，和背景重叠
- 最终版（琥珀→亮黄→暖橙）偏暖黄色，视觉柔和

### 5.7 弹窗关闭逻辑

```tsx
// 1. 点击遮罩关闭（排除内容区）
const handleBackdropClick = useCallback((e) => {
  if (slipRef.current && !slipRef.current.contains(e.target as Node)) onClose()
}, [onClose])

// 2. ESC 键关闭
useEffect(() => {
  if (!open) return
  const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [open, onClose])

// 3. 关闭按钮
<motion.button onClick={onClose}>...</motion.button>
```

**要点**：
- `useCallback` 缓存事件处理函数，避免每次渲染创建新函数
- `contains(e.target)` 判断点击是否在弹窗内容区内
- ESC 监听器在 useEffect 返回时清除，防止内存泄漏

### 5.8 定位逻辑（跟随点赞按钮）

```tsx
const likeX = likeStyles.offsetX !== null
  ? center.x + likeStyles.offsetX
  : center.x + hiCardStyles.width / 2 - socialButtonsStyles.width + shareCardStyles.width + CARD_SPACING
const likeY = likeStyles.offsetY !== null
  ? center.y + likeStyles.offsetY
  : center.y + hiCardStyles.height / 2 + CARD_SPACING + socialButtonsStyles.height + CARD_SPACING + musicCardStyles.height + CARD_SPACING

const x = styles.offsetX !== null ? center.x + styles.offsetX : likeX + CARD_SPACING + likeStyles.width
const y = styles.offsetY !== null ? center.y + styles.offsetY : likeY
```

**要点**：
- offsetX/offsetY 不为 null 时，使用用户拖拽后的自定义位置
- 为 null 时，自动计算：在点赞按钮右边，y 坐标和点赞按钮对齐
- CARD_SPACING = 36（来自 consts.ts）

---

## 六、page.tsx 注册方式

```tsx
// 导入
import HappyCapsulePosition from './happy-capsule-position'

// 渲染（桌面端+手机端都显示）
{cardStyles.happyCapsulePosition?.enabled !== false && <HappyCapsulePosition />}
```

**要点**：
- `?.enabled !== false` — undefined 时也显示，只有显式设 false 才隐藏
- 和点赞按钮一样，**两端都显示**（没有 maxSM 条件判断）
- 位置在 `<LikePosition />` 紧后面

---

## 七、踩坑记录

| # | 问题 | 原因 | 解决 |
|---|------|------|------|
| 1 | 无限循环 Maximum update depth exceeded | useState 存 Set，每次新引用触发 useEffect | 改用 useRef |
| 2 | Lucide 没有药瓶图标 | 图标库不覆盖所有场景 | 自定义 SVG |
| 3 | 文字被截断 | 加了 whitespace-nowrap text-ellipsis | 去掉 nowrap，外层 overflow-hidden 兜底 |
| 4 | 渐变文字夸克看不见 | Tailwind bg-clip-text 兼容性差 | 内联 style + -webkit- 前缀 |
| 5 | 颜色太红和背景重叠 | 粉→紫→琥珀偏红 | 改为琥珀→亮黄→暖橙 |
| 6 | 图片 404 | 图片放正式版 public，dev server 跑测试版 | 复制图片到测试版 |
| 7 | 动画太快没感觉 | width 0.5s 太短 | 全部放慢 0.5 倍（width 1.0s, opacity 0.6s, borderRadius 0.8s） |

---

## 八、举一反三

### 做类似的"随机抽签"卡片需要什么？

1. **数据源**：一个 JSON 文件，定义 type 字段区分渲染方式
2. **按钮组件**：自定义图标 + 点击交互（摇晃/缩放/弹跳任选）
3. **弹窗组件**：AnimatePresence 包裹，入场/退场动画
4. **随机逻辑**：useRef 存已看 ID，useEffect 只依赖 open
5. **定位容器**：参考现有 position 组件结构
6. **三处注册**：page.tsx + card-styles.json + home-layout.tsx

### 可复用的模式

| 模式 | 复用方式 |
|------|---------|
| 粒子特效 | 改 emoji/坐标数组即可用于其他按钮 |
| 卷轴动画 | 改 initial/animate 的数值用于不同形状展开 |
| 随机不重复 | useRef + Set 模式通用 |
| 固定定位跟随 | 参考胶囊的位置计算逻辑 |
| 渐变文字 | 换颜色数组即可 |
