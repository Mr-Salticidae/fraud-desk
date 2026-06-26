import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Design a custom ElevenLabs voice from a text description, save previews, and
// (optionally) create the voice. Set CREATE=1 to actually create from preview #IDX.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');
const outDir = path.join(projectRoot, 'out', 'voice-previews');

const loadEnv = () => {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
};

const VOICE_DESC =
  process.env.VOICE_DESC ||
  'A Chinese man in his early thirties speaking natural, conversational Mandarin. He sounds like a sharp, down-to-earth friend telling you a slightly chilling real story late at night: intimate, grounded, a little streetwise, with quiet tension and dry warmth. NOT a polished radio host or news anchor, not theatrical. Relaxed but compelling short-video narration, speaking directly to one listener, clear articulation, medium-low pitch.';

const PREVIEW_TEXT =
  process.env.PREVIEW_TEXT ||
  '凌晨一点，你妈收到条短信：银行卡刚在境外被刷了六千八，让她马上冻结。九五开头的号，金额吓人，口气紧急。第一反应——诈骗，拦掉。但你再看，它没让你点链接，也没要验证码，也没让你转钱去什么安全账户。这条，其实是真的。真银行的盗刷预警，就长这样。你要是把它当骗局拦了，你妈下次就再也不信预警了。';

const main = async () => {
  loadEnv();
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) throw new Error('no ELEVENLABS_API_KEY');
  mkdirSync(outDir, { recursive: true });

  const designRes = await fetch('https://api.elevenlabs.io/v1/text-to-voice/design', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice_description: VOICE_DESC, model_id: 'eleven_multilingual_ttv_v2', text: PREVIEW_TEXT, output_format: 'mp3_44100_128' }),
  });
  if (!designRes.ok) throw new Error(`design failed ${designRes.status}: ${await designRes.text()}`);
  const design = (await designRes.json()) as any;
  const previews = design.previews ?? [];
  previews.forEach((p: any, i: number) => {
    const b64 = p.audio_base_64 ?? p.audio_base64;
    if (b64) writeFileSync(path.join(outDir, `preview_${i + 1}.mp3`), Buffer.from(b64, 'base64'));
    console.log(JSON.stringify({ idx: i + 1, generated_voice_id: p.generated_voice_id, duration: p.duration_secs }));
  });

  if (process.env.CREATE === '1') {
    const idx = Number(process.env.IDX || '1') - 1;
    const chosen = previews[idx];
    if (!chosen) throw new Error('chosen preview not found');
    const createRes = await fetch('https://api.elevenlabs.io/v1/text-to-voice', {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice_name: process.env.VOICE_NAME || '反诈夜班·讲述者', voice_description: VOICE_DESC, generated_voice_id: chosen.generated_voice_id }),
    });
    if (!createRes.ok) throw new Error(`create failed ${createRes.status}: ${await createRes.text()}`);
    const created = (await createRes.json()) as any;
    console.log('CREATED_VOICE_ID', created.voice_id ?? JSON.stringify(created));
  }
};

main().catch((e) => { console.error(e instanceof Error ? e.message : String(e)); process.exit(1); });
