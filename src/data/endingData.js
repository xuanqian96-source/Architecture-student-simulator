export const ALL_ENDINGS = [
    { id: 'postgrad_s', name: '清华/同济直博', type: 'S', icon: '🏛️' },
    { id: 'abroad_s', name: 'GSD/AA 全额奖学金', type: 'S', icon: '🎓' },
    { id: 'job_s', name: '明星事务所主创', type: 'S', icon: '✨' },
    { id: 'job_a', name: '市甲级院高工预备役', type: 'A', icon: '🏢' },
    { id: 'pivot_tech', name: '大厂UE/UX设计', type: 'A', icon: '💻' },
    { id: 'pivot_game', name: '游戏场景美术/TA', type: 'A', icon: '🎮' },
    { id: 'civil_success', name: '住建局处长苗子', type: 'A', icon: '🍵' },
    { id: 'postgrad_a_b', name: '强二本建筑研', type: 'B', icon: '📚' },
    { id: 'abroad_a_b', name: '澳洲/欧洲水硕', type: 'B', icon: '✈️' },
    { id: 'job_b', name: '县城画图狗', type: 'B', icon: '📐' },
    { id: 'pivot_media', name: '自媒体/设计博主', type: 'B', icon: '📱' },
    { id: 'civil_fail', name: '待业考公青年', type: 'FAIL', icon: '😔' },
    { id: 'abroad_fail', name: '黑户/遣返', type: 'FAIL', icon: '🚫' },
    { id: 'postgrad_fail', name: '二战/三战炮灰', type: 'FAIL', icon: '🌪️' },
    { id: 'failure_stress', name: '精神崩溃，休学住院', type: 'FAIL', icon: '🚑' },
    { id: 'failure_warning', name: '学分不达标，退学', type: 'FAIL', icon: '❌' },
    { id: 'failure_bankrupt', name: '负债累累，辍学打工', type: 'FAIL', icon: '💸' },
];

export const getEndingRecord = () => {
    try {
        const stored = localStorage.getItem('archsim_unlocked_endings');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const saveEndingRecord = (endingId) => {
    try {
        const current = getEndingRecord();
        if (!current.includes(endingId)) {
            current.push(endingId);
            localStorage.setItem('archsim_unlocked_endings', JSON.stringify(current));
        }
    } catch (e) {
        console.error("存档写入失败", e);
    }
};
