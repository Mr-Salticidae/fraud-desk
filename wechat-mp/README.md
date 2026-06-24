# 反诈柜台 · 微信小程序版（移植）

把 H5 版《The Fraud Desk / 反诈柜台》移植成**微信小程序**。游戏逻辑、200 桩案件库、双语文案与 H5 版完全一致；渲染层用 WXML/WXSS + `setData` 重写（小程序没有 DOM）。

> ⚠️ 字体：小程序不能加载 Google Fonts，标题改用系统衬线（Songti/PingFang）兜底，观感与 H5 略有差别，功能一致。

## 目录结构
```
wechat-mp/
├── project.config.json   开发者工具项目配置（appid 现为 touristappid 测试号）
├── app.js / app.json / app.wxss
├── sitemap.json
├── utils/data.js         200 桩案件库 + 双语文案（从 H5 script.js 原样抽取）
└── pages/index/
    ├── index.js          游戏逻辑（抽案/计时/计分/裁定/结算）
    ├── index.wxml        模板（intro / case / verdict / report 四屏）
    ├── index.wxss        样式（暖纸调，rpx 单位）
    └── index.json
```

## 你需要做的步骤（我无法代劳：需登录 / 桌面工具 / 审核）

1. **装微信开发者工具**：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. **拿 AppID**：登录 https://mp.weixin.qq.com → 「开发管理 → 开发设置」复制 AppID。
   - 没有小程序账号就先在 mp.weixin.qq.com 注册一个（个人主体即可注册**小程序**）。
3. **导入项目**：开发者工具 →「导入项目」→ 目录选 `E:\fraud-desk\wechat-mp` → 填入你的 AppID（想先看效果可暂用「测试号」）→ 导入。
4. **预览自测**：左侧模拟器即可玩；点「预览」生成二维码用手机微信扫码真机自测。
5. **填小程序信息（后台 mp.weixin.qq.com）**：名称、简介、**类目建议选「教育 / 工具」下的反诈科普 / 知识问答**，不要选「游戏」。
6. **上传**：开发者工具点「上传」，填版本号（如 1.0.0）和备注 → 上传成功后进入后台「版本管理 → 开发版本」。
7. **提交审核 → 发布**：后台「提交审核」，过审后「发布」。

## 重要合规提醒
- 微信规定**「游戏」必须做成小游戏（需企业主体 + 类目资质）**，**小程序内一般禁止游戏内容**。
- 本作本质是**反诈科普 / 情景判断训练**，请按**教育 / 工具**类目提交、文案上突出「反诈科普测验」而非「游戏」，过审概率更高。
- 仍存在被审核要求改做小游戏的可能；若如此，需企业认证并用 canvas 引擎重做（另一条路线）。

## 与 H5 版的同步
案件库 / 文案的唯一真源是 H5 的 `../script.js`。日后扩库后，重新抽取数据：
```
python - <<'PY'
src=open(r"E:\fraud-desk\script.js",encoding="utf-8").read()
data=src[:src.index("let CASES = [];")].rstrip()
open(r"E:\fraud-desk\wechat-mp\utils\data.js","w",encoding="utf-8",newline="\n").write(
  data+"\n\nmodule.exports = { DECISION_SECONDS, L, LIBRARY };\n")
PY
```
