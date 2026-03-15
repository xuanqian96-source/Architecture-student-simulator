// 身份配置系统 - 4种学校背景 × 4种家庭背景 = 16种组合

// 学校背景配置
export const schools = {
  elite: {
    id: 'elite',
    name: '建筑老八校',
    probability: 0.1,
    initialDesign: 50,
    initialSoftware: 10,
    initialStress: 40,
    difficulty: 1.5,
    weeklyGrowth: 0.5  // 每周设计感自然增长
  },
  newElite: {
    id: 'newElite',
    name: '新八校/双一流',
    probability: 0.25,
    initialDesign: 40,
    initialSoftware: 5,
    initialStress: 25,
    difficulty: 1.2,
    weeklyGrowth: 0.3
  },
  regular: {
    id: 'regular',
    name: '普通一本',
    probability: 0.45,
    initialDesign: 30,
    initialSoftware: 2,
    initialStress: 15,
    difficulty: 1.0,
    weeklyGrowth: 0.1
  },
  vocational: {
    id: 'vocational',
    name: '普通大专',
    probability: 0.2,
    initialDesign: 20,
    initialSoftware: 0,
    initialStress: 10,
    difficulty: 0.8,
    weeklyGrowth: 0
  }
};

// 家庭背景配置
export const families = {
  academic: {
    id: 'academic',
    name: '院士/泰斗子女',
    probability: 0.10,
    initialMoney: 12000,
    designBonus: 15,
    softwareBonus: 25,
    monthlyAllowance: 8000,
    weeklyLivingCost: 1000,
    skill: {
      id: 'masterGuidance',
      name: '大师点拨',
      description: '召唤业内大牛(可能是你爸妈)亲自改图',
      effect: { quality: 50 },
      cooldown: 8  // 每月(4周)限1次
    }
  },
  wealthy: {
    id: 'wealthy',
    name: '富二代',
    probability: 0.20,
    initialMoney: 20000,
    designBonus: 10,
    softwareBonus: 20,
    monthlyAllowance: 15000,
    weeklyLivingCost: 2000,
    skill: {
      id: 'moneyPower',
      name: '钞能力代做',
      description: '花费¥5,000雇佣校外枪手，进度增加30%',
      effect: { progress: 30, moneyCost: 5000 },
      cooldown: 8
    }
  },
  middle: {
    id: 'middle',
    name: '普通家庭',
    probability: 0.4,
    initialMoney: 4000,
    designBonus: 5,
    softwareBonus: 35,
    monthlyAllowance: 3000,
    weeklyLivingCost: 350,
    skill: {
      id: 'ordinaryPath',
      name: '平凡之路',
      description: '作为普通人,你唯一的特权就是脚踏实地。加油,建筑牲口!',
      effect: {},  // 无实际效果
      cooldown: 999
    }
  },
  poor: {
    id: 'poor',
    name: '穷困家庭',
    probability: 0.3,
    initialMoney: 800,
    designBonus: 5,
    softwareBonus: 30,
    monthlyAllowance: 1000,
    weeklyLivingCost: 250,
    skill: {
      id: 'underdog',
      name: '底层爆种',
      description: '牺牲健康换取前途',
      effect: { stress: 40, quality: 25, progress: 30 },
      cooldown: 8
    }
  }
};

// 16种身份组合的叙事介绍词
export const identityNarratives = {
  'elite-academic': {
    title: '建筑皇族',
    description: '你出生在行业的风暴中心,襁褓里闻的是晒图纸的氨水味。对你而言,普利兹克奖不是梦想,而是一份迟早要继承的家谱声明。'
  },
  'elite-wealthy': {
    title: '不差钱的精英',
    description: '你用最贵的模型材料,买最高配的电脑。既然天赋已被认可,那就用金钱把表现力堆到极致。'
  },
  'elite-middle': {
    title: '全村的希望',
    description: '你深知入场券的昂贵,每一卷硫酸纸都要省着点用。你的每一步都走得稳健而谨慎,退无可退。'
  },
  'elite-poor': {
    title: '寒门贵子',
    description: '你用惊人的精力和坚韧弥补物质的贫乏。工作室就是你的家,你的命就是用来熬夜的,你没有失败的权利。'
  },
  'newElite-academic': {
    title: '开疆拓土者',
    description: '家族的荣耀是光环也是枷锁,你在此开疆拓土,试图证明自己的血统即便在追赶者的阵营中也依然高贵。'
  },
  'newElite-wealthy': {
    title: '赞助商预备役',
    description: '你是学院的赞助商预备役。在追赶一流的道路上,你用金钱换取效率,在任何软件崩溃面前都能保持优雅。'
  },
  'newElite-middle': {
    title: '稳健的追赶者',
    description: '你明白平台的重要性,在各种竞赛和DDL之间疯狂试探,只为在精英群中占有一席之地。'
  },
  'newElite-poor': {
    title: '逆风翻盘',
    description: '你比任何人都渴望成功。接私活是你生存的手段,也是你磨炼技能的战场,你习惯了在泥泞中仰望星空。'
  },
  'regular-academic': {
    title: '深藏不露的扫地僧',
    description: '由于某些"考场意外",你降落在了这所学校。你的设计思维让教授都感到汗颜,你就是此地深藏不露的扫地僧。'
  },
  'regular-wealthy': {
    title: '平凡学校里的异类',
    description: '当同学在为打印费发愁时,你已考虑给工作室捐赠一台全自动激光切割机。'
  },
  'regular-middle': {
    title: '大多数人的缩影',
    description: '稳扎稳打,自律至上。虽然没有惊天动地的背景,但你坚信手上的功夫比什么都重要。'
  },
  'regular-poor': {
    title: '坚韧独行侠',
    description: '你深知自己退无可退。哪怕没有任何加成,你也要靠着一双磨出茧子的手,画出通往未来的蓝图。'
  },
  'vocational-academic': {
    title: '最叛逆的组合',
    description: '你拥有顶级的审美,却在最草根的环境里折腾。大家都在传,你只是在进行一场为期五年的社会实践体验。'
  },
  'vocational-wealthy': {
    title: '未来的事务所老板',
    description: '你的目标不是成为员工,而是毕业后直接收购一家事务所。这里的课程对你而言,只是为了学会如何和未来的员工沟通。'
  },
  'vocational-middle': {
    title: '务实派',
    description: '你没有太多的幻想,只想在五年里学好一门手艺,在建筑行业的底层逻辑里寻找自己的生存出口。'
  },
  'vocational-poor': {
    title: '生存狂魔',
    description: '在最残酷的开局里,你拥有最强悍的体力。你从不抱怨,因为你眼里只有活下去和变强。'
  }
};

// 随机抽取学校背景(基于概率)
export function drawSchool() {
  const rand = Math.random();
  let cumulative = 0;

  for (const school of Object.values(schools)) {
    cumulative += school.probability;
    if (rand <= cumulative) {
      return school;
    }
  }

  return schools.regular; // 默认返回普通一本
}

// 随机抽取家庭背景(基于概率)
export function drawFamily() {
  const rand = Math.random();
  let cumulative = 0;

  for (const family of Object.values(families)) {
    cumulative += family.probability;
    if (rand <= cumulative) {
      return family;
    }
  }

  return families.middle; // 默认返回普通家庭
}

// 生成完整身份
export function generateIdentity() {
  const school = drawSchool();
  const family = drawFamily();
  const narrativeKey = `${school.id}-${family.id}`;
  const narrative = identityNarratives[narrativeKey];

  return {
    school,
    family,
    narrative,
    initialAttributes: {
      design: school.initialDesign + (family.designBonus || 0),
      software: school.initialSoftware + (family.softwareBonus || 0),
      stress: school.initialStress,
      money: family.initialMoney
    }
  };
}
