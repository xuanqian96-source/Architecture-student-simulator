// 私活系统 - 4种私活类型

export const jobs = [
    {
        id: 'cad',
        name: '描CAD底图',
        requirement: { software: 0 },
        payment: 500,
        description: '这种活狗都不接。'
    },
    {
        id: 'su',
        name: 'SU简单建模',
        requirement: { software: 20 },
        payment: 1500,
        description: '甲方觉得五分钟就能推出来。'
    },
    {
        id: 'render',
        name: '渲染图后期P人',
        requirement: { design: 30 },
        payment: 3000,
        description: '在冷淡的方案里塞进纸片人。'
    },
    {
        id: 'master',
        name: '某大师方案扩初',
        requirement: { design: 100, software: 100 },
        payment: 8000,
        description: '你是真正的绘图牲口。'
    }
];

// 获取可用的私活列表(基于当前属性)
export function getAvailableJobs(currentAttributes) {
    return jobs.filter(job => {
        for (const [attr, value] of Object.entries(job.requirement)) {
            if (currentAttributes[attr] < value) {
                return false;
            }
        }
        return true;
    });
}
