/* =========================================================================
   THE FRAUD DESK — editorial dossier build (EN / 中文）
   LIBRARY = full case bank. Each shift draws 5–10 cases at random (CASES).
   A 25s decision timer runs per case; timing out counts as a miss.
   answer: "scam" = fraud, must be FLAGGED. "safe" = genuine, let pass.
   ========================================================================= */

const DECISION_SECONDS = 25;

const L = {
  en: {
    dossierKicker: "An Interactive Dossier", demoBadge: "This is a Demo",
    issueMeta: "Night Shift · Random Draw",
    saved: "Recovered", lost: "Lost", callsRight: "Correct",
    introKicker: "Field Manual · Night Shift",
    coverTitle: 'Catch it before<br/>they <em>click</em>.',
    introDek: "Every day, scammers steal billions — one believable message at a time. Tonight, you sit at the desk where those messages are caught.",
    introBody: "You are the night analyst. Texts, transfers and calls cross your desk; some are honest, some are built to empty a life's savings. Read closely, find the tell, and rule before the clock runs out. Block the frauds — but cry wolf on a real message and you lose trust, too.",
    startBtn: "Begin the shift →",
    introContentsTitle: "How a shift works",
    introContentsBody: "Each shift deals 5–10 cases at random from the file room, with 25 seconds to rule on each. The real scams are drawn from China's most common fraud playbooks.",
    caseKickerWord: "Case", exhibitWord: "Exhibit", transcriptWord: "Transcript",
    atRisk: "At risk", timerLabel: "Time to rule",
    rulingPrompt: "Your ruling",
    btnGenuineLbl: "Rule it", btnGenuine: "Genuine",
    btnFraudLbl: "Rule it", btnFraud: "Fraud",
    hint: "Remember: a real institution never asks you to read back a one-time code.",
    stampBlocked: "Blocked", stampCleared: "Cleared", stampMissed: "Missed", stampFalse: "False Alarm", stampTimeout: "Timed Out",
    tells: "The tells",
    next: "Next case →", seeReport: "Close the file →",
    reportKicker: "End of Shift · Assessment",
    gS: "A flawless shift. Nothing got past you.",
    gA: "Sharp eyes. You're reading the tells now.",
    gB: "A solid shift — a couple of clever ones slipped by.",
    gC: "Some got through. Re-read the tells and draw again.",
    moneySaved: "Recovered", moneyLost: "Lost", accuracy: "Accuracy",
    lockTitle: "In the full edition",
    lockItem1: "Eight shifts — across elderly, student and small-business desks",
    lockItem2: "60+ real scam playbooks: deepfake voice, QR swaps, fake support lines",
    lockItem3: "A career mode where the cons adapt to the way you play",
    lockItem4: "A free, open case library you can share with your family",
    mission: "The aim: make fraud awareness a reflex — free, and for everyone.",
    replay: "Draw a new shift →",
    footer: "<b>This is a demo</b><br/>A vertical slice for The Demo Jam, 2026. Built in a single HTML file, vibe-coded with Claude Code (Anthropic). Scam patterns adapted from public anti-fraud education (incl. China's National Anti-Fraud Center, 2025); no real names or brands are used.",
  },
  zh: {
    dossierKicker: "互动调查档案", demoBadge: "这是一个 Demo",
    issueMeta: "夜班 · 随机抽案",
    saved: "已挽回", lost: "已损失", callsRight: "判断正确",
    introKicker: "实务手册 · 夜班",
    coverTitle: '在他们<em>点下去</em>之前，<br/>拦住它。',
    introDek: "每天，骗子卷走数十亿——一次，一条像模像样的消息。今夜，你坐在拦下这些消息的柜台前。",
    introBody: "你是夜班分析员。短信、转账、来电从你桌上经过；有的诚实，有的专为掏空一个人的积蓄而生。仔细读，找出破绽，在倒计时归零前判下裁定。拦下骗局——但对真消息草木皆兵，你也会失去信任。",
    startBtn: "开始当班 →",
    introContentsTitle: "一个班次怎么玩",
    introContentsBody: "每个班次从案件库随机发 5–10 桩，每桩限时 25 秒裁定。骗局都取材于中国最高发的真实诈骗剧本。",
    caseKickerWord: "案件", exhibitWord: "物证", transcriptWord: "记录",
    atRisk: "风险金额", timerLabel: "限时裁定",
    rulingPrompt: "你的裁定",
    btnGenuineLbl: "判定为", btnGenuine: "属实",
    btnFraudLbl: "判定为", btnFraud: "诈骗",
    hint: "记住：正规机构，绝不会让你回读一次性验证码。",
    stampBlocked: "已拦截", stampCleared: "已放行", stampMissed: "漏网", stampFalse: "误判", stampTimeout: "超时未判",
    tells: "破绽",
    next: "下一桩 →", seeReport: "归档结案 →",
    reportKicker: "当班结束 · 考评",
    gS: "完美的一班。没有一个漏网。",
    gA: "好眼力。你已经在读破绽了。",
    gB: "这一班不错——有几个精巧的溜了过去。",
    gC: "有些过去了。重读破绽，再抽一班。",
    moneySaved: "已挽回", moneyLost: "已损失", accuracy: "准确率",
    lockTitle: "完整版收录",
    lockItem1: "八个班次——覆盖老年、学生、小微企业等柜台",
    lockItem2: "60+ 真实诈骗剧本：深伪语音、收款码掉包、假冒客服专线",
    lockItem3: "职业生涯模式：骗术随你的打法自适应进化",
    lockItem4: "一个可免费分享给家人的开放案例库",
    mission: "目标：把反诈意识练成本能——免费，人人可用。",
    replay: "再抽一个班次 →",
    footer: "<b>这是一个 Demo</b><br/>为 The Demo Jam 2026 制作的切片。单个 HTML 文件，借助 Claude Code（Anthropic）vibe-coding。诈骗话术改编自公开反诈科普（含国家反诈中心 2025 年资料），未使用任何真实人名或品牌。",
  },
};

const LIBRARY = [
  {
    answer: "scam", risk: 3200,
    title: { en: "The Thirty-Minute Lockout", zh: "三十分钟冻结术" },
    chan: { en: "SMS", zh: "短信" },
    sender: { en: 'Sender — <b>+1 (804) 220-9913</b>, claiming to be a bank security line',
              zh: '发件人 — <b>+1 (804) 220-9913</b>，自称某银行「安全中心」' },
    text: {
      en: `Bank alert: a login from a NEW DEVICE was detected on your account.
If this was NOT you, your account will be LOCKED in 30 minutes.

Verify now: http://yourbank-secure-verify.com/login
Reply with the 6-digit code we just texted you to confirm it's you.`,
      zh: `银行提醒：检测到您的账户在一台新设备上登录。
如果这不是您本人操作，您的账户将在 30 分钟内被冻结。

立即验证：http://yourbank-secure-verify.com/login
回复我们刚发给您的 6 位验证码以确认身份。` },
    flags: [
      { en: "Manufactured urgency — “locked in 30 minutes” pushes you to act before you think.",
        zh: "人为制造紧迫感——「30 分钟内冻结」逼你不假思索地行动。" },
      { en: "It asks for the one-time code. A real bank will never ask you to share it.",
        zh: "它索要一次性验证码。真正的银行绝不会让你把它交出去。" },
      { en: "A look-alike link that is not the bank's true domain.",
        zh: "一个仿冒链接，并非银行的真实域名。" } ],
    truthScam: { en: "Classic phishing. That code is the last wall between a thief and the account.",
                 zh: "典型钓鱼。那串验证码，是窃贼与账户之间的最后一道墙。" },
    truthSafe: { en: "It was a scam — blocking it kept the customer's balance intact.",
                 zh: "这是骗局——拦下它，保住了客户的余额。" },
  },
  {
    answer: "safe", risk: 0,
    title: { en: "Fifty, No Strings", zh: "五十块，没有钩子" },
    chan: { en: "App notification", zh: "App 通知" },
    sender: { en: 'Source — <b>a wallet app the customer already uses</b>',
              zh: '来源 — <b>客户本来就在用的钱包 App</b>' },
    text: {
      en: `Your friend Mei sent you ¥50.00 — “thanks for dinner!”
The money is already in your balance. No action needed.`,
      zh: `你的好友 Mei 给你转了 ¥50.00 ——「请你吃饭的钱，谢啦！」
钱已到你的余额。无需任何操作。` },
    flags: [
      { en: "No link to tap, no code requested, no countdown.",
        zh: "没有要点的链接，不要验证码，也没有倒计时。" },
      { en: "The money is incoming and already settled — there is nothing to approve.",
        zh: "钱是转入的，而且已经到账——根本没什么要你批准。" },
      { en: "It arrives through the app the customer truly installed, not a stray text.",
        zh: "它来自客户真正安装的 App，而非来路不明的短信。" } ],
    truthScam: { en: "This one was honest — flagging real messages teaches people to distrust real alerts.",
                 zh: "这条是真的——把真消息当骗局拦，会教人不再相信真正的提醒。" },
    truthSafe: { en: "Right call. Not everything is a trap — knowing what's safe matters just as much.",
                 zh: "判得对。不是一切都是陷阱——分得清什么安全，同样重要。" },
  },
  {
    answer: "scam", risk: 8000,
    title: { en: "The Uncle's Private Fund", zh: "叔叔的私募基金" },
    chan: { en: "Dating app → chat", zh: "交友软件 → 私聊" },
    sender: { en: 'Sender — <b>“Daniel”</b>, matched three weeks ago, never met in person',
              zh: '发件人 — <b>「Daniel」</b>，三周前匹配，从未线下见过面' },
    text: {
      en: `I hate seeing you stressed about money. My uncle runs a private
fund — I'm already up 12% this week, look at my dashboard.

The bonus window closes tonight. Start with ¥8,000 and I'll walk
you through every step. Trust me, I'd never let you lose.`,
      zh: `看你为钱发愁，我心疼。我叔叔管着一只私募基金——
这周我已经赚了 12%，看我的后台截图。

加成窗口今晚就关。先投 ¥8,000，我全程教你。
相信我，我绝不会让你亏。` },
    flags: [
      { en: "A “pig-butchering” pattern: romance first, then a can't-lose investment.",
        zh: "「杀猪盘」套路：先谈感情，再推一个稳赚不赔的投资。" },
      { en: "Never met in person, yet steering you to send a very large sum.",
        zh: "从未线下见面，却引导你转出一大笔钱。" },
      { en: "Faked profit screenshots plus a closing “bonus window” to force a fast yes.",
        zh: "伪造的盈利截图，加上即将关闭的「加成窗口」，逼你快速点头。" } ],
    truthScam: { en: "Romance-investment scams are among the costliest of all. The platform is fake; deposits vanish.",
                 zh: "杀猪盘是损失最惨重的骗局之一。平台是假的，入金即蒸发。" },
    truthSafe: { en: "It was a scam — you just stopped an ¥8,000 loss and a breaking heart.",
                 zh: "这是骗局——你刚拦下了 ¥8,000 的损失，和一颗将碎的心。" },
  },
  {
    answer: "scam", risk: 1500,
    title: { en: "A Favour for the Boss", zh: "老板的一个小忙" },
    chan: { en: "Work IM", zh: "工作群消息" },
    sender: { en: 'Sender — <b>“the CEO”</b>, a new account whose photo matches the boss',
              zh: '发件人 — <b>「老板」</b>，一个头像与老板相同的新账号' },
    text: {
      en: `Hi — stuck in a meeting, can't talk. Quick favour: buy
5 × ¥300 gift cards for a client reward and send me the codes.

Keep this between us for now; I'll approve reimbursement after.`,
      zh: `在吗——正开会，不方便讲话。帮个急忙：买
5 张 300 元的礼品卡做客户答谢，把卡密发我。

先别跟别人说，回头我批报销。` },
    flags: [
      { en: "Authority, urgency and secrecy — the three levers of a “boss fraud”.",
        zh: "权威、紧迫、保密——「冒充领导」骗局的三根杠杆。" },
      { en: "Payment as gift-card codes: untraceable, irreversible, never a real company process.",
        zh: "用礼品卡卡密付款：无法追踪、无法撤回，绝非真实的公司流程。" },
      { en: "“New account” and “can't talk now” neatly block you from verifying by voice.",
        zh: "「新账号」加「现在不方便讲话」，刚好堵死你电话核实的路。" } ],
    truthScam: { en: "A boss-impersonation scam. The fix: call the boss back on a number you already know.",
                 zh: "冒充领导骗局。破解：用你早已知道的号码，回拨老板核实。" },
    truthSafe: { en: "It was a scam — a confidential gift-card request is almost always fraud.",
                 zh: "这是骗局——要求保密的礼品卡请求，几乎都是诈骗。" },
  },
  {
    answer: "safe", risk: 0,
    title: { en: "The Call That Says No", zh: "那通说「不」的电话" },
    chan: { en: "Phone call · transcript", zh: "来电 · 通话记录" },
    sender: { en: "Source — the number printed on the back of the customer's own card",
              zh: "来源 — 客户自己卡片背面印着的那个号码" },
    text: {
      en: `“This is your bank's fraud team. We blocked a ¥2,000 charge we don't think was you.
We will never ask for your PIN or a one-time code.

Please don't read any code to anyone. To continue, hang up and call us
back using the number on the back of your card.”`,
      zh: `「这里是您银行的反诈团队。我们拦下了一笔 ¥2,000 的扣款，怀疑不是您本人。
我们绝不会向您索要密码或一次性验证码。

请不要把任何验证码读给任何人。如需继续，请挂断，
用您卡片背面的号码回拨我们。」` },
    flags: [
      { en: "It says outright it will never ask for your code — the opposite of a scammer.",
        zh: "它直截了当地说绝不会要你的验证码——和骗子恰恰相反。" },
      { en: "No link, no pressure to pay; it sends you to the official number to verify.",
        zh: "没有链接、不催你付款；反而让你用官方号码去核实。" },
      { en: "“Hang up and call the number on your card” is exactly the safe habit to build.",
        zh: "「挂断，用卡背号码回拨」正是该养成的安全习惯。" } ],
    truthScam: { en: "It was genuine — over-blocking means the next real fraud alert gets ignored.",
                 zh: "这是真的——过度拦截，意味着下一次真正的反诈提醒会被忽视。" },
    truthSafe: { en: "Right call. The mark of a real bank: it tells you to verify it through official channels.",
                 zh: "判得对。真银行的标志：它让你通过官方渠道去核实它自己。" },
  },

  {
    answer: "scam", risk: 5000,
    title: { en: "Easy Money, One Tap at a Time", zh: "动动手指，日入过千" },
    chan: { en: "Part-time job chat", zh: "兼职群" },
    sender: { en: 'Sender — a “recruiter” who added you after you left your number on a job site',
              zh: '发件人 — 「闪电兼职客服」，你在招聘网站留过手机号后加你' },
    text: {
      en: `Legit online side-gig — boost a shop's sales and earn commission per task.
Your first three tasks paid out instantly. This is a bigger one:
front ¥5,000 and you'll get ¥5,650 back. Slots close today!`,
      zh: `正规线上兼职——给商家刷单冲销量，做一单返一单佣金。
前三单本金加佣金已秒返。这是一笔大额任务：
垫付 ¥5,000，完成后连本带利返 ¥5,650。名额今天截止哦~` },
    flags: [
      { en: "Small early payouts hook you; then a big “task” swallows the money you front.",
        zh: "先用小额返利让你尝到甜头，再设大额任务卷走你垫付的本金。" },
      { en: "Any “pay first, get a rebate” task is a scam — and brushing sales is itself illegal.",
        zh: "任何「先垫钱、再返现」的任务都是诈骗，刷单本身也违法。" },
      { en: "“Slots close today” manufactures urgency so you can't stop to check.",
        zh: "「名额今天截止」制造紧迫，不给你停下来查证的时间。" } ],
    truthScam: { en: "Task-rebate fraud is the single most common scam. The small payout is bait for the big deposit.",
                 zh: "刷单返利是发案量最高的骗局。返的小钱，是钓你垫大钱的饵。" },
    truthSafe: { en: "It was a scam — you blocked ¥5,000 and dodged an illegal brushing job.",
                 zh: "这是骗局——你拦下了 ¥5,000，也躲过了违法刷单。" },
  },
  {
    answer: "scam", risk: 200000,
    title: { en: "The 'Safe Account' That Isn't", zh: "涉嫌洗钱的「安全账户」" },
    chan: { en: "Phone — transferred call", zh: "电话转接" },
    sender: { en: 'Sender — claims to be the “police criminal division”; the number starts with +00',
              zh: '发件人 — 自称「市公安局刑侦支队」，来电显示 +00 开头' },
    text: {
      en: `You're implicated in a major money-laundering case — there's a warrant.
We'll take your statement by video, in strict secrecy; tell no one.
To clear your name, move your funds to our designated “safe account”
for review; you'll get it all back once you're cleared.`,
      zh: `你涉嫌一起特大洗钱案，已有逮捕令。
现在与你视频做笔录，全程保密，不许告诉家人。
为自证清白，请把名下资金转入我们指定的「安全账户」
接受资金清算，查清后原路退回。` },
    flags: [
      { en: "Real police never take statements or demand transfers by phone or video — and “safe accounts” do not exist.",
        zh: "公检法办案绝不会电话或视频要你转账，更没有所谓「安全账户」。" },
      { en: "Fear (“warrant”, “felony”) plus enforced secrecy cuts you off from anyone who'd warn you.",
        zh: "用「逮捕令」「涉嫌重罪」制造恐惧，再用「保密」切断你向家人求证。" },
      { en: "A +00 / spoofed overseas number — no real agency contacts you like this.",
        zh: "来电号码 +00、境外改号——真机关不会这样联系你。" } ],
    truthScam: { en: "Police-impersonation scams cause the heaviest single losses. Transfer to a “safe account” = always fraud.",
                 zh: "冒充公检法，单案损失往往最惨重。转账到「安全账户」＝一定是诈骗。" },
    truthSafe: { en: "It was a scam — you just stopped a ¥200,000 “asset review”.",
                 zh: "这是骗局——你刚拦下一笔 ¥200,000 的「资金清算」。" },
  },
  {
    answer: "scam", risk: 180000,
    title: { en: "Erase Your Student Loan — or Wreck Your Credit", zh: "注销学生贷，否则毁征信" },
    chan: { en: "Phone call", zh: "电话" },
    sender: { en: 'Sender — a “finance / regulator” rep who knows your name and your school',
              zh: '发件人 — 自称「金融平台 / 监管部门」客服，准确报出你的姓名和学校' },
    text: {
      en: `Your old campus-loan account was never closed — under new rules
it will hurt your credit! To fix it, draw down your quota on every
lending app and transfer it to our “supervision account” to verify.
It'll be restored to normal right after.`,
      zh: `您学生时期注册的校园贷账户没有注销——按新规会影响个人征信！
需要配合清空额度：把各网贷平台的额度都借出来，
转到我们的「监管账户」核验，核验完立即恢复正常。` },
    flags: [
      { en: "Credit records are managed solely by the central bank — they cannot be “erased” or “repaired”. The premise is fake.",
        zh: "个人征信由央行统一管理，无法人为「注销」或「修复」，这套说法本身就是假的。" },
      { en: "It makes you take real loans on many apps, then transfer them out — the debt stays yours.",
        zh: "它引导你在多个平台真实借款再转出，债留给你，钱归骗子。" },
      { en: "Knowing your name and school proves nothing — that data is bought and traded.",
        zh: "报得出你的姓名和学校，只是买来的信息，并不代表身份真实。" } ],
    truthScam: { en: "Anything that cites “your credit score” to make you transfer or borrow is a scam.",
                 zh: "凡以「影响征信」为由要你转账或借贷的，都是诈骗。" },
    truthSafe: { en: "It was a scam — you dodged taking on ¥180,000 of loans.",
                 zh: "这是骗局——你躲过了背上 ¥180,000 网贷的陷阱。" },
  },
  {
    answer: "scam", risk: 95000,
    title: { en: "The Boss on the Video Call", zh: "视频里的「领导」" },
    chan: { en: "Video call", zh: "微信视频" },
    sender: { en: 'Sender — a newly added contact whose face on video really looks like your boss',
              zh: '发件人 — 新加的好友，视频里的脸的确是领导本人' },
    text: {
      en: `(the video drops after nine seconds) Bad signal, let's just chat.
I'm away closing a deal and a payment must go out now — wire ¥95,000
from the company account to this number, I'll sort the paperwork later.
Hurry, within ten minutes.`,
      zh: `（视频接通 9 秒后挂断）画面卡了，先这样。
我在外地谈项目，有笔款急着走对公账户，
你先从公司账上垫 ¥95,000 到这个账号，手续费回头报。
急，十分钟内办好。` },
    flags: [
      { en: "AI face-swap and voice-cloning need only seconds of footage — “I saw their face” is no longer proof.",
        zh: "AI 换脸加拟声只需几秒素材，「亲眼看到脸」已不再可信。" },
      { en: "A very short call that “lags” and drops is the classic trick to stop you spotting the fake.",
        zh: "视频极短、信号「卡顿」就挂断，正是不让你细看破绽的惯用手法。" },
      { en: "Urgent transfer, a company account, a ten-minute deadline — any one means: call back to verify first.",
        zh: "急转账、对公账户、十分钟限时——任何一条都该让你先电话核实。" } ],
    truthScam: { en: "When money is involved, call the person back on a number you already have. Seeing is no longer believing.",
                 zh: "涉及转账，务必用旧号码回拨本人当面或电话核实——眼见不再为实。" },
    truthSafe: { en: "It was a scam — you saw through a nine-second deepfake and saved ¥95,000.",
                 zh: "这是骗局——你识破了一段 9 秒的 AI 换脸，守住了 ¥95,000。" },
  },
  {
    answer: "scam", risk: 4000,
    title: { en: "Faulty Order, Triple Refund", zh: "订单有问题，主动赔你三倍" },
    chan: { en: "Phone + SMS link", zh: "电话 + 短信链接" },
    sender: { en: 'Sender — a “marketplace agent” who reads back your real order number and item',
              zh: '发件人 — 自称「电商客服」，准确报出你买过的商品和订单号' },
    text: {
      en: `The item you bought failed a quality check — we're refunding you triple.
Tap the link in our text, enter your bank-card number and the code we
send you, and the compensation lands right away.`,
      zh: `您购买的商品质检不合格，我们主动按三倍理赔。
请点短信里的链接，填写您的银行卡号和收到的验证码，
理赔款立即到账。` },
    flags: [
      { en: "A real refund returns by the original payment path — it never needs your card number or a code.",
        zh: "真退款会原路退回，绝不需要你的卡号和验证码。" },
      { en: "Knowing your order details means your data leaked, not that the caller is official.",
        zh: "准确报出订单信息，是信息泄露，不是官方身份的证明。" },
      { en: "“Triple compensation” is far too generous — it baits the wish for a windfall.",
        zh: "「三倍赔付」远超合理，是用占便宜的心理钓你。" } ],
    truthScam: { en: "When “customer service” asks for your code, that code is the key to drain your account.",
                 zh: "客服「理赔」只要验证码，那串码就是把钱划走的口令。" },
    truthSafe: { en: "It was a scam — you kept the ¥4,000 in the customer's card.",
                 zh: "这是骗局——你保住了卡里的 ¥4,000。" },
  },
  {
    answer: "scam", risk: 6000,
    title: { en: "Flight Cancelled, Claim Compensation", zh: "航班取消，改签赔偿" },
    chan: { en: "SMS", zh: "短信" },
    sender: { en: 'Sender — an “airline” mass-text (actually a spoofed station) quoting your real flight number',
              zh: '发件人 — 「航空公司」短信（其实是伪基站群发），精准报出你的航班号' },
    text: {
      en: `Your flight is cancelled (mechanical fault). You may rebook or refund
and claim ¥300 in compensation. Do NOT use the official app — contact
our dedicated agent on a chat app; bank-card verification required first.`,
      zh: `您乘坐的航班因机械故障取消，可改签或退票并领 ¥300 延误补偿。
请勿在官方 App 操作，联系专属客服在聊天软件办理，
需先验证银行卡。` },
    flags: [
      { en: "A correct flight number lowers your guard — but itinerary data leaks, too.",
        zh: "精准报出航班号会让人卸下戒心，但行程信息也可能泄露。" },
      { en: "“Don't use the official app, message us on a chat app” is designed to pull you off safe channels.",
        zh: "「别用官方 App、加聊天软件私聊办理」正是要把你拉离安全渠道。" },
      { en: "Real rebooking refunds never need you to “verify a bank card” or pay first.",
        zh: "退改签退款从不需要「验证银行卡」，更不会让你先付费。" } ],
    truthScam: { en: "If you get a flight alert, verify only via the airline's official app or the number on your ticket.",
                 zh: "收到航班异常，只在航司官方 App、官网，或票面客服电话核实。" },
    truthSafe: { en: "It was a scam — that spoofed text didn't walk off with ¥6,000.",
                 zh: "这是骗局——你没被那条伪基站短信带走 ¥6,000。" },
  },
  {
    answer: "scam", risk: 12000,
    title: { en: "You're on a ¥800-a-Month Plan", zh: "您开通了会员，每月扣 800" },
    chan: { en: "Phone call", zh: "电话" },
    sender: { en: 'Sender — a “platform agent” saying the system mistakenly enrolled you in a premium plan',
              zh: '发件人 — 自称「平台客服」，说系统误给你开通了付费会员' },
    text: {
      en: `You accidentally signed up for a plan — the system auto-charges ¥800
a month and won't stop. I'll switch it off for you: download this
“meeting” app, share your screen, and follow my steps to cancel.`,
      zh: `您之前不小心开通了会员，系统每月自动扣 ¥800，不取消会一直扣。
我帮您关闭，请下载这个「会议」App，和我屏幕共享，
按我说的操作就能退订。` },
    flags: [
      { en: "“Download an app, share your screen, follow my steps” hands the scammer your banking codes.",
        zh: "「下载 App、屏幕共享、按我操作」＝把你的银行验证码暴露给骗子。" },
      { en: "Real platforms let you cancel in the app's own settings — never via screen-share.",
        zh: "真平台取消扣费，在 App 设置里自己就能关，绝不用屏幕共享。" },
      { en: "It uses fear of “endless charges” and targets those less familiar with phones.",
        zh: "用「持续扣费」制造焦虑，专挑不熟悉手机操作的老人下手。" } ],
    truthScam: { en: "Anyone asking you to “share your screen” to cancel a charge is running a scam.",
                 zh: "任何让你「屏幕共享、远程协助」办理退费的，都是诈骗。" },
    truthSafe: { en: "It was a scam — you protected ¥12,000 in an elderly customer's account.",
                 zh: "这是骗局——你护住了老人卡里的 ¥12,000。" },
  },
  {
    answer: "scam", risk: 8800,
    title: { en: "Tonight's Lucky Viewer", zh: "恭喜被选为幸运观众" },
    chan: { en: "SMS", zh: "短信" },
    sender: { en: 'Sender — claims to be a hit TV show, with a “claim your prize” web link',
              zh: '发件人 — 自称某热播节目组，短信带一个领奖网址' },
    text: {
      en: `Congratulations! Our show drew you as a lucky off-site viewer —
second prize: ¥188,000 and a laptop. Log in to the prize site and pay
¥8,800 in income tax and a deposit, and the prize will be released.`,
      zh: `恭喜！您被某热播节目后台抽为场外幸运观众，
获二等奖 ¥188,000 及笔记本电脑一台。
请登录领奖网址，缴纳个人所得税及保证金 ¥8,800 后发放。` },
    flags: [
      { en: "Legitimate prizes never charge “tax or a deposit” up front — pay-to-claim is always fake.",
        zh: "正规奖项不会先收「税费、保证金」，凡先交钱才能领奖的都是假的。" },
      { en: "You never entered this show, yet you “won second prize”.",
        zh: "你从没参加过这个节目，却「中了二等奖」。" },
      { en: "A stray prize link is usually a phishing site after your logins.",
        zh: "陌生领奖链接多是钓鱼网站，会套走你的账号密码。" } ],
    truthScam: { en: "If a windfall asks you to pay first, it is, without exception, a scam.",
                 zh: "「天上掉馅饼」却先要你交钱的，百分百是诈骗。" },
    truthSafe: { en: "It was a scam — you didn't hand over the ¥8,800 “deposit”.",
                 zh: "这是骗局——你没给那 ¥8,800 的「保证金」。" },
  },
  {
    answer: "safe", risk: 0,
    title: { en: "The Insurance Rebate", zh: "医保返还到账" },
    chan: { en: "SMS · official channel", zh: "短信 · 官方渠道" },
    sender: { en: 'Source — the national insurance service, an official text with no link',
              zh: '来源 — 国家医保局官方短信，没有链接' },
    text: {
      en: `Your 2025 resident health-insurance rebate of ¥260 has been credited;
check it in the official insurance app. Questions? Call the public
hotline 12393. We will never ask you for a code or a transfer.`,
      zh: `您 2025 年度城乡居民医保个人账户返还 ¥260 已到账，
可在「国家医保服务平台」App 查询。如有疑问请拨打 12393。
本短信不会向您索要任何验证码或转账。` },
    flags: [
      { en: "The money is incoming, not requested — and there's no link to tap.",
        zh: "钱是「到账」，不是要你转出；也没有要点的链接。" },
      { en: "It states outright it will never ask for a code or a transfer — exactly what a real agency does.",
        zh: "主动写明「绝不索要验证码或转账」，正是正规机构的做法。" },
      { en: "It points you to the official app and a public hotline to check for yourself.",
        zh: "指引你去官方 App 和公开热线 12393 自助查询。" } ],
    truthScam: { en: "This was genuine — blocking real notices makes people miss money they're owed.",
                 zh: "这条是真的——把真政务通知当骗局拦，会让人错过该领的钱。" },
    truthSafe: { en: "Right call. “We'll never ask for your code” is the mark of a real notice.",
                 zh: "判得对。主动告知「不索要验证码」，是正规通知的标志。" },
  },
  {
    answer: "safe", risk: 0,
    title: { en: "A Charge From Another City", zh: "一笔异地刷卡提醒" },
    chan: { en: "Bank SMS · official number", zh: "银行短信 · 官方号段" },
    sender: { en: "Source — your bank's official alert number",
              zh: "来源 — 你银行的官方短信号段（95 开头）" },
    text: {
      en: `Your card ending 6621 was charged ¥1,299 in another city at 10:24.
If this was you, ignore this. If not, call the number on the back of
your card. We will never ask for your PIN or a code via this message.`,
      zh: `您尾号 6621 信用卡 10:24 在异地完成一笔 ¥1,299 消费。
如为本人操作请忽略；如有疑问请拨打卡片背面客服电话核实。
我行不会以此短信向您索要密码或验证码。` },
    flags: [
      { en: "It simply notifies a charge — no link, no pressure to act.",
        zh: "只是消费「告知」，没有链接、不催你操作。" },
      { en: "It tells you to call the number on your card, not one it provides.",
        zh: "让你拨「卡背官方电话」核实，而不是它给你的号码。" },
      { en: "It says plainly it will never ask for your PIN or code — the opposite of a scammer.",
        zh: "明说「不会索要密码或验证码」，与骗子恰恰相反。" } ],
    truthScam: { en: "This was a genuine alert — over-blocking means a real fraudulent charge gets missed.",
                 zh: "这是真的银行提醒——过度拦截，真有盗刷时反而会被忽略。" },
    truthSafe: { en: "Right call. A real bank sends you to the official number on your card to verify it.",
                 zh: "判得对。真银行让你用卡背官方电话核实它自己。" },
  },
  {
    answer: "safe", risk: 0,
    title: { en: "Parcel at the Pickup Point", zh: "快递已到驿站" },
    chan: { en: "App notification", zh: "App 通知" },
    sender: { en: "Source — the parcel app the customer actually uses",
              zh: "来源 — 客户常用的快递驿站 App 通知" },
    text: {
      en: `Your parcel is at the pickup point. Code 8-2-5103 — show it to
collect. The point will never ask you to pay or for bank details.`,
      zh: `您的包裹已到驿站，取件码 8-2-5103，请凭码取件。
驿站不会要求您付款或提供银行卡信息。` },
    flags: [
      { en: "It gives a pickup code only — no payment, no bank details.",
        zh: "只给取件码，不要钱、不要银行信息。" },
      { en: "It comes from the official app the customer really uses, not a stray link.",
        zh: "来自客户真正安装、常用的官方 App，不是陌生短信链接。" },
      { en: "Scammers usually hook with “lost-parcel compensation” — this asks for nothing.",
        zh: "「包裹丢失理赔」才是骗子常用的切口，这条没有任何索取。" } ],
    truthScam: { en: "This was genuine — an ordinary pickup notice, nothing to fear.",
                 zh: "这条是真的——正常的取件通知，无需警惕。" },
    truthSafe: { en: "Right call. A real notice gives a code and never touches your money or card.",
                 zh: "判得对。真通知只给取件码，不碰你的钱和卡。" },
  },
];

let CASES = [];
const state = { i: 0, saved: 0, lost: 0, correct: 0, answered: 0, decided: false, lastChoice: null };
let lang = localStorage.getItem("fd_lang") || ((navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en");
let screenName = "intro";
let timerId = null, timeLeft = 0;

const $ = (id) => document.getElementById(id);
const T = (k) => L[lang][k];
const tc = (o) => o[lang];
const money = (n) => (lang === "zh" ? "¥" : "$") + n.toLocaleString(lang === "zh" ? "zh-CN" : "en-US");
const pad2 = (n) => String(n).padStart(2, "0");

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draw 5–10 random cases, guaranteeing at least one scam and one genuine.
function drawRound() {
  const pool = shuffle(LIBRARY.slice());
  const n = Math.min(LIBRARY.length, 5 + Math.floor(Math.random() * 6)); // 5..10
  const picked = pool.slice(0, n);
  if (!picked.some((c) => c.answer === "scam")) {
    const s = pool.find((c) => c.answer === "scam" && !picked.includes(c));
    if (s) picked[picked.length - 1] = s;
  }
  if (!picked.some((c) => c.answer === "safe")) {
    const s = pool.find((c) => c.answer === "safe" && !picked.includes(c));
    if (s) picked[0] = s;
  }
  CASES = shuffle(picked);
  Object.assign(state, { i: 0, saved: 0, lost: 0, correct: 0, answered: 0, decided: false, lastChoice: null });
}

function applyLang() {
  document.documentElement.lang = lang;
  localStorage.setItem("fd_lang", lang);
  document.querySelectorAll("#langToggle button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = T(el.dataset.i18nHtml); });
  syncStats();
  if (screenName === "case") { paintCase(); if (state.decided) renderVerdict(); }
  else if (screenName === "report") { renderReport(); }
}

function buildTicks() {
  const t = $("ticks"); t.innerHTML = "";
  CASES.forEach((_, idx) => {
    const i = document.createElement("i");
    if (idx < state.i) i.className = "done";
    t.appendChild(i);
  });
}

function syncStats() {
  $("statSaved").textContent = money(state.saved);
  $("statLost").textContent = money(state.lost);
  $("statAcc").textContent = `${state.correct}/${state.answered}`;
}

function show(screen) {
  stopTimer();
  ["introScreen", "caseScreen", "reportScreen"].forEach((s) => $(s).classList.add("hidden"));
  $(screen).classList.remove("hidden");
  screenName = screen === "introScreen" ? "intro" : screen === "caseScreen" ? "case" : "report";
  $("ledger").style.display = screen === "introScreen" ? "none" : "flex";
}

/* ----- decision timer ----- */
function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
function paintTimer() {
  const pct = Math.max(0, timeLeft) / (DECISION_SECONDS * 1000) * 100;
  $("timerFill").style.width = pct + "%";
  $("timerSecs").textContent = fmtTime(timeLeft);
  $("timer").classList.toggle("low", timeLeft <= 5000);
}
function startTimer() {
  stopTimer();
  timeLeft = DECISION_SECONDS * 1000;
  $("timer").style.display = "flex";
  paintTimer();
  timerId = setInterval(() => {
    timeLeft -= 100;
    if (timeLeft <= 0) { timeLeft = 0; paintTimer(); decide(null, true); return; }
    paintTimer();
  }, 100);
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

/* ----- rendering ----- */
function paintCase() {
  const c = CASES[state.i];
  $("caseKicker").innerHTML = `${T("caseKickerWord")} <b>${pad2(state.i + 1)}</b> / ${pad2(CASES.length)} · ${tc(c.chan)}`;
  $("caseTitle").textContent = tc(c.title);
  $("exhibitTab").textContent = `${T("exhibitWord")} ${String.fromCharCode(65 + state.i)} — ${T("transcriptWord")}`;
  $("caseMessage").innerHTML = tc(c.text);
  $("caseSender").innerHTML = tc(c.sender);
  if (c.risk > 0) { $("atRisk").style.display = "flex"; $("atRiskFig").textContent = money(c.risk); }
  else { $("atRisk").style.display = "none"; }
}

function renderCase() {
  state.decided = false;
  $("caseScreen").classList.remove("decided");
  paintCase();
  $("caseActions").classList.remove("hidden");
  $("rulingPrompt").classList.remove("hidden");
  $("caseHint").classList.remove("hidden");
  $("verdictBox").innerHTML = "";
  buildTicks();
  syncStats();
  show("caseScreen");
  startTimer();
}

function decide(choice, timedOut) {
  if (state.decided) return;
  stopTimer();
  const c = CASES[state.i];
  const right = !timedOut && choice === c.answer;
  state.answered++;
  if (right) state.correct++;
  if (c.answer === "scam") { right ? (state.saved += c.risk) : (state.lost += c.risk); }
  state.decided = true;
  state.lastChoice = timedOut ? "timeout" : choice;
  syncStats();
  renderVerdict();
}

function renderVerdict() {
  const c = CASES[state.i];
  const timedOut = state.lastChoice === "timeout";
  const right = !timedOut && state.lastChoice === c.answer;

  $("caseScreen").classList.add("decided");
  $("caseActions").classList.add("hidden");
  $("rulingPrompt").classList.add("hidden");
  $("caseHint").classList.add("hidden");
  $("timer").style.display = "none";

  const stampKey = timedOut ? "stampTimeout"
    : right ? (c.answer === "scam" ? "stampBlocked" : "stampCleared")
            : (c.answer === "scam" ? "stampMissed" : "stampFalse");
  const truth = tc(c.answer === "scam" ? c.truthScam : c.truthSafe);
  const tells = c.flags.map((f) => `<li>${tc(f)}</li>`).join("");
  const last = state.i === CASES.length - 1;

  $("verdictBox").innerHTML = `
    <div class="verdict">
      <span class="stamp ${right ? "ok" : ""}">${T(stampKey)}</span>
      <div class="kicker tells-kicker">${T("tells")}</div>
      <ol class="tells">${tells}</ol>
      <p class="pull">${truth}</p>
      <div class="next-wrap">
        <button class="linkbtn" id="nextBtn">${last ? T("seeReport") : T("next")}</button>
      </div>
    </div>`;

  $("nextBtn").onclick = () => {
    if (last) renderReport();
    else { state.i++; renderCase(); }
  };
}

function renderReport() {
  state.i = CASES.length;
  buildTicks();
  syncStats();
  $("rSaved").textContent = money(state.saved);
  $("rLost").textContent = money(state.lost);
  $("rAcc").textContent = `${state.correct}/${state.answered}`;

  const pct = state.answered ? state.correct / state.answered : 0;
  let grade = "C", lineKey = "gC";
  if (pct === 1) { grade = "S"; lineKey = "gS"; }
  else if (pct >= 0.8) { grade = "A"; lineKey = "gA"; }
  else if (pct >= 0.6) { grade = "B"; lineKey = "gB"; }
  $("grade").textContent = grade;
  $("gradeLine").textContent = T(lineKey);
  show("reportScreen");
}

/* ----- wiring ----- */
$("langToggle").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-lang]");
  if (b && b.dataset.lang !== lang) { lang = b.dataset.lang; applyLang(); }
});
$("startBtn").onclick = () => { drawRound(); renderCase(); };
$("replayBtn").onclick = () => { drawRound(); renderCase(); };
$("caseActions").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-choice]");
  if (btn) decide(btn.dataset.choice, false);
});

// Boot
show("introScreen");
applyLang();
