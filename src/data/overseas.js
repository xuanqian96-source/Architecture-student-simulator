// 出国留学系统 - 雅思题库 + 院校库

export const IELTS_COST = 2170; // 报考费

// 雅思30道趣味题库
export const ieltsQuestions = [
    // [专业词汇类] 1-5
    { id: 'ie1', question: 'What does the word "Facade" mean in architecture?', options: ['The floor', 'The front of a building', 'The roof', 'The garden'], answer: 1 },
    { id: 'ie2', question: 'Choose the correct spelling:', options: ['Architacture', 'Architecture', 'Archeticture', 'Architactur'], answer: 1 },
    { id: 'ie3', question: 'A "Cantilever" is a beam supported at ________.', options: ['Both ends', 'Only one end', 'The center', 'Three points'], answer: 1 },
    { id: 'ie4', question: 'Which word describes a central open space in a building?', options: ['Cellar', 'Attic', 'Atrium', 'Porch'], answer: 2 },
    { id: 'ie5', question: 'In English, a "Section" drawing shows a building as if it were ________.', options: ['Seen from above', 'Cut vertically', 'Photographed at night', 'Painted'], answer: 1 },
    // [逻辑/语法类] 6-10
    { id: 'ie6', question: '"The building ________ by the famous architect in 1920."', options: ['was designed', 'is design', 'designing', 'was design'], answer: 0 },
    { id: 'ie7', question: 'If a building is "Sustainable", it means it is ________.', options: ['Very tall', 'Environmentally friendly', 'Made of gold', 'Very old'], answer: 1 },
    { id: 'ie8', question: 'Which phrase means "熬夜"?', options: ['Sleep all day', 'Burn the midnight oil', 'Drink the oil', 'Wake the sun'], answer: 1 },
    { id: 'ie9', question: 'Identify the synonym for "Renovate":', options: ['Destroy', 'Restore', 'Forget', 'Sell'], answer: 1 },
    { id: 'ie10', question: '"Site analysis" refers to investigating the ________.', options: ['Internal stairs', 'Building location and context', "Client's wallet", 'Menu'], answer: 1 },
    // [建筑黑话翻译类] 11-15
    { id: 'ie11', question: 'How do you translate "空间逻辑"?', options: ['Space Logic', 'Room Math', 'Air Thinking', 'Box Game'], answer: 0 },
    { id: 'ie12', question: '"Tectonic" is related to ________.', options: ['Technology', 'Construction and structural art', 'Typing speed', 'Tacos'], answer: 1 },
    { id: 'ie13', question: '"Brutalism" in architecture is known for using ________.', options: ['Glass', 'Raw concrete', 'Wood', 'Silk'], answer: 1 },
    { id: 'ie14', question: 'What is a "Drafting Table"?', options: ['A table for eating', 'A table for drawing', 'A table for meetings', 'A computer'], answer: 1 },
    { id: 'ie15', question: '"Axonometric" is a type of ________.', options: ['Drawing', 'Material', 'Scale', 'Window'], answer: 0 },
    // [趣味/生活类] 16-20
    { id: 'ie16', question: "An architecture student's best friend is ________.", options: ['A pillow', 'Coffee', 'A personal trainer', 'The sun'], answer: 1 },
    { id: 'ie17', question: 'If your laptop "crashes" during rendering, you should ________.', options: ['Dance', 'Cry and then restart', 'Throw it away', 'Call the police'], answer: 1 },
    { id: 'ie18', question: 'What is the English name for the tool used to cut foam boards?', options: ['Utility knife', 'Spoon', 'Hairdryer', 'Eraser'], answer: 0 },
    { id: 'ie19', question: 'When a professor says your design is "Interesting", it often means ________.', options: ["It's perfect", "It's weird/wrong", 'I want to buy it', 'I love it'], answer: 1 },
    { id: 'ie20', question: 'A "Deadline" is the time when you ________.', options: ['Start working', 'Must finish working', 'Go to sleep', 'Die'], answer: 1 },
    // [进阶/综合类] 21-30
    { id: 'ie21', question: 'Which style is associated with "Less is More"?', options: ['Baroque', 'Minimalism', 'Gothic', 'Pop Art'], answer: 1 },
    { id: 'ie22', question: 'A "Blueprint" is a term for a ________.', options: ['Blue building', 'Technical drawing/plan', 'Paint color', 'Blue sky'], answer: 1 },
    { id: 'ie23', question: 'Which material is most "transparent"?', options: ['Concrete', 'Steel', 'Glass', 'Brick'], answer: 2 },
    { id: 'ie24', question: '"Circulation" in a building refers to ________.', options: ['How air moves', 'How people move', 'How much money it costs', 'The height'], answer: 1 },
    { id: 'ie25', question: 'A "Skyscraper" is a very ________ building.', options: ['Long', 'Tall', 'Wide', 'Underground'], answer: 1 },
    { id: 'ie26', question: '"Vernacular" architecture uses ________ materials.', options: ['Imported', 'Local', 'Synthetic', 'Invisible'], answer: 1 },
    { id: 'ie27', question: 'The "Scale" 1:100 means 1 cm on the map equals ________ cm in reality.', options: ['1', '10', '100', '1000'], answer: 2 },
    { id: 'ie28', question: 'Which of these is NOT a 3D modeling software?', options: ['Rhino', 'SketchUp', 'Revit', 'Photoshop'], answer: 3 },
    { id: 'ie29', question: '"Typography" is to graphic design as ________ is to architecture.', options: ['Typography', 'Typology', 'Topology', 'Topography'], answer: 1 },
    { id: 'ie30', question: '"Urban Sprawl" refers to the ________ expansion of a city.', options: ['Planned', 'Uncontrolled', 'Vertical', 'Underground'], answer: 1 },
];

// 海外10所院校库
export const overseasUniversities = [
    { id: 'gsd', name: 'GSD (哈佛)', country: '美国 🇺🇸', tier: 'S', ieltsReq: 7.5, psReq: 1200, desc: '全球建筑学殿堂' },
    { id: 'bartlett', name: 'Bartlett (UCL)', country: '英国 🇬🇧', tier: 'S', ieltsReq: 7.5, psReq: 1150, desc: '实验性建筑摇篮' },
    { id: 'eth', name: 'ETH (苏黎世)', country: '瑞士 🇨🇭', tier: 'S', ieltsReq: 7.0, psReq: 1100, desc: '极致建构主义' },
    { id: 'aa', name: 'AA (建筑联盟)', country: '英国 🇬🇧', tier: 'A+', ieltsReq: 7.5, psReq: 1000, desc: '叙事性与理论极强' },
    { id: 'mit', name: 'MIT (麻省理工)', country: '美国 🇺🇸', tier: 'S', ieltsReq: 7.5, psReq: 1200, desc: '科技与建筑结合' },
    { id: 'tud', name: 'TUD (代尔夫特)', country: '荷兰 🇳🇱', tier: 'A', ieltsReq: 7.0, psReq: 850, desc: '扎实的专业素养' },
    { id: 'hku', name: 'HKU (港大)', country: '中国香港 🇭🇰', tier: 'A', ieltsReq: 7.0, psReq: 950, desc: '国际视野' },
    { id: 'nus', name: 'NUS (新国立)', country: '新加坡 🇸🇬', tier: 'A', ieltsReq: 6.5, psReq: 900, desc: '亚洲顶级' },
    { id: 'risd', name: 'RISD (罗德岛)', country: '美国 🇺🇸', tier: 'B+', ieltsReq: 6.5, psReq: 800, desc: '艺术感极强' },
    { id: 'melbourne', name: 'Melbourne (墨大)', country: '澳大利亚 🇦🇺', tier: 'B', ieltsReq: 6.5, psReq: 750, desc: '综合实力稳健' },
];

/**
 * 雅思出分逻辑
 * 10分:8.5 | 8-9:7.5 | 6-7:6.5 | 5:6.0 | <5:5.5
 */
export function calculateIeltsScore(correctCount) {
    if (correctCount >= 10) return 8.5;
    if (correctCount >= 8) return 7.5;
    if (correctCount >= 6) return 6.5;
    if (correctCount >= 5) return 6.0;
    return 5.5;
}

/**
 * 随机抽取10道雅思题
 */
export function drawIeltsQuestions() {
    const shuffled = [...ieltsQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
}

/**
 * 检查是否满足院校申请要求
 */
export function canApplyUniversity(uni, bestIelts, portfolioScore) {
    return bestIelts >= uni.ieltsReq && portfolioScore >= uni.psReq;
}
