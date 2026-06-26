# 反诈柜台 · 短视频批量管线 (_video)

《反诈柜台》竖屏短视频的生产工程。把 314 个案件程序化批量出竖屏短视频,发抖音/B站/快手。
方法论:**蒙眼剪辑法 v4(母版 + 批量)× Remotion × MJ × Seedance**。
完整方案书见知识库 `04_方法论与洞察/04_视频影像与声音/短视频批量分发方案_蒙眼剪辑法xRemotion_v1.md`。

## 管线(音频先行)

```
案件(../script.js LIBRARY)
  → 文稿(src/beats.ts 的 TEXT,字幕=逐字口播)
  → ElevenLabs 配音(scripts/generate-voiceover.ts)→ public/audio/*.mp3 + src/timing.generated.ts
  → Playwright 竖屏录屏(scripts/capture-game.ts,?case= 定向)→ public/capture/pilot.mp4
  → [可选] MJ 关键视觉锚 + Seedance 2.0 转动态 → public/broll/*(占位待替换)
  → Remotion 母版(src/FraudDeskShort.tsx)→ out/*.mp4
```

三层合成(下→上):游戏录屏 / MJ×Seedance B-roll → 逐句蹦字字幕(安全带) → 旁白 + BGM。

## 命令

```bash
npm i && npx playwright install chromium      # 首次
npm run voice:design                          # 设计/创建自定义音色(CREATE=1 IDX=n 落地)
npm run voice:gen                              # 生成旁白 + 刷新 timing.generated.ts(FORCE=1 强制重生)
# 先启动游戏静态服务在 :5273(项目根 python -m http.server 5273)
npm run capture                               # Playwright 录屏(CASE_Q=... RULE=scam|safe)
npm run typecheck && npm run render           # 渲染 out/fraud-desk-pilot.mp4
```

## 配置

- `.env`(不入库):`ELEVENLABS_API_KEY=...`;可选 `FRAUD_VOICE_ID`(默认自定义音色「反诈夜班·讲述者」)、`FRAUD_MODEL_ID`(默认 eleven_multilingual_v2)。
- 案件定向:游戏 `?case=<序号|标题关键词>`(由 ../script.js drawRound 支持)。

## 状态

- pilot 案件「这次预警是真的」:全链路打通(配音→录屏→合成→渲染)。
- 待办:接 MJ/Seedance B-roll 替换干巴游戏画面;逐词字幕(Whisper)升级;批量 dataset-render 扩到 314 条。
