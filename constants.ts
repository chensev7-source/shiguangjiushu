
import { StoryNode } from './types';

export const STORY_NODES: Record<string, StoryNode> = {
  'story-node-1': {
    id: 'story-node-1',
    title: '第一章：旧书店的秘密',
    content: [
      '深秋的周末午后，梧桐叶落在青石板路上，被风吹得打着旋儿。你推开了家附近那家名为“拾光旧书”的小店，木门发出“吱呀”一声轻响，带着岁月的厚重感。',
      '白发苍苍的书店老板正趴在木质柜台上打盹，他的手边放着一杯早已凉透的菊花茶。在最角落的阴影里，你发现了一本锁着的牛皮笔记本——封面磨得发亮，扉页上用烫金字体写着“致我的挚爱”。',
      '老人醒了过来，轻声说：“这本笔记是位客人落下的，放了半个月了。如果你能找到它的主人，或许能了却一桩心愿。”'
    ],
    choices: [
      { id: 'c1', text: '1. 留下笔记本，帮老人寻找主人', subtext: '（试着弥补一段可能的遗憾 - 救赎导向）', nextId: 'story-node-2-redemption', path: 'redemption' },
      { id: 'c2', text: '2. 买下笔记本，自己带走', subtext: '（不想卷入他人的琐事，只想窥探秘密 - 沉沦导向）', nextId: 'story-node-2-decline', path: 'decline' },
      { id: 'c3', text: '3. 询问细节，怀疑其中有隐情', subtext: '（觉得事情没那么简单 - 悬疑导向）', nextId: 'story-node-2-suspense', path: 'suspense' },
      { id: 'c4', text: '4. 先陪老人聊天，了解他的故事', subtext: '（感受平凡中的温暖 - 温情导向）', nextId: 'story-node-2-warmth', path: 'warmth' }
    ]
  },
  // Redemption Path
  'story-node-2-redemption': {
    id: 'story-node-2-redemption',
    title: '第二章：线索初现',
    content: [
      '你决定帮忙。老人感激地笑了，拿出一张纸条：“那天她穿米白色连衣裙，找一本1987年版的《顾城诗集》。她走得很急，笔记本落在了这里。”',
      '你接过纸条，发现监控显示她往附近的师范大学方向走了。'
    ],
    choices: [
      { id: 'c5', text: '1. 立刻去大学寻找女生', subtext: '（尽快归还笔记本，了却心愿）', nextId: 'story-node-3-redemption', path: 'redemption' },
      { id: 'c6', text: '2. 先翻阅笔记本（不拆锁）', subtext: '（仅看外露的字迹寻找线索）', nextId: 'story-node-3-redemption-2', path: 'redemption' }
    ]
  },
  'story-node-3-redemption': {
    id: 'story-node-3-redemption',
    title: '第三章：线索中断',
    content: [
      '在大学图书馆，你得知她叫林晓雅。但她因为奶奶生病回了老家。你发现一张咖啡馆的会员卡。'
    ],
    choices: [
      { id: 'c7', text: '1. 去咖啡馆碰碰运气', subtext: '（不放弃任何线索）', nextId: 'story-node-5-redemption', path: 'redemption' }
    ]
  },
  'story-node-3-redemption-2': {
    id: 'story-node-3-redemption-2',
    title: '第三章：字迹里的秘密',
    content: [
      '笔记里记录了她对一个叫阿哲的男生的暗恋。照片上两个年轻人在樱花树下笑着。'
    ],
    choices: [
      { id: 'c8', text: '1. 寻找照片中的男生阿哲', subtext: '（通过他人间接找到主人）', nextId: 'story-node-5-redemption-2', path: 'redemption' }
    ]
  },
  // Decline Path
  'story-node-2-decline': {
    id: 'story-node-2-decline',
    title: '第二章：秘密的诱惑',
    content: [
      '你花50元买下了笔记。回到家，你撬开了锁。日记里写着林晓雅得了罕见病，唯一的遗憾是没能向阿哲表白。'
    ],
    choices: [
      { id: 'c9', text: '1. 将笔记据为己有', subtext: '（这是属于你的秘密了）', nextId: 'story-node-5-decline', path: 'decline' },
      { id: 'c10', text: '2. 联系男生，但隐瞒来源', subtext: '（犹豫再三，还是决定联系）', nextId: 'story-node-5-decline-2', path: 'decline' }
    ]
  },
  // Suspense Path
  'story-node-2-suspense': {
    id: 'story-node-2-suspense',
    title: '第二章：老人的谎言',
    content: [
      '你发现老人眼神闪躲，手指有新鲜划痕。笔记本看起来根本不像是“刚落下”的。'
    ],
    choices: [
      { id: 'c11', text: '1. 蹲守观察', subtext: '（揭开真相）', nextId: 'story-node-5-suspense', path: 'suspense' },
      { id: 'c12', text: '2. 直接拆穿', subtext: '（要求说实话）', nextId: 'story-node-5-suspense-2', path: 'suspense' }
    ]
  },
  // Warmth Path
  'story-node-2-warmth': {
    id: 'story-node-2-warmth',
    title: '第二章：岁月的故事',
    content: [
      '老人告诉你，书店是他和亡妻开的。笔记本其实是他放的，只是想找人说说话。'
    ],
    choices: [
      { id: 'c13', text: '1. 留下来整理书店', subtext: '（传递温暖）', nextId: 'story-node-5-warmth', path: 'warmth' },
      { id: 'c14', text: '2. 承诺以后常来看他', subtext: '（长期陪伴）', nextId: 'story-node-5-warmth-2', path: 'warmth' }
    ]
  },
  // Endings (Simplified for the demo, actual branching is richer)
  'story-node-5-redemption': { id: 'story-node-5-redemption', title: '结局：圆满的和解', content: ['林晓雅终于拿回了笔记，并与阿哲走到了一起。你的小小善举，成就了一段美好的姻缘。'], choices: [] },
  'story-node-5-redemption-2': { id: 'story-node-5-redemption-2', title: '结局：迟来的告白', content: ['你帮她完成了告白，即便相隔千里，心依然紧贴。'], choices: [] },
  'story-node-5-decline': { id: 'story-node-5-decline', title: '结局：无尽的遗憾', content: ['你守着他人的秘密，却发现它成了你心中无法卸下的重担。'], choices: [] },
  'story-node-5-decline-2': { id: 'story-node-5-decline-2', title: '结局：残缺的真相', content: ['谎言维持的平静终究是脆弱的，你在这场游戏中迷失了自我。'], choices: [] },
  'story-node-5-suspense': { id: 'story-node-5-suspense', title: '结局：隐藏的真相', content: ['真相总是残酷的，但直面它才是解脱的开始。'], choices: [] },
  'story-node-5-suspense-2': { id: 'story-node-5-suspense-2', title: '结局：迟来的理解', content: ['和解比揭穿更重要，你们在故事的终点找到了彼此的共鸣。'], choices: [] },
  'story-node-5-warmth': { id: 'story-node-5-warmth', title: '结局：温暖的陪伴', content: ['夕阳下，老书店依旧宁静。你成为了老人生命中一道温柔的光。'], choices: [] },
  'story-node-5-warmth-2': { id: 'story-node-5-warmth-2', title: '结局：长久的牵挂', content: ['有些情谊不分血缘，陪伴是最长情的告白。'], choices: [] },
};
