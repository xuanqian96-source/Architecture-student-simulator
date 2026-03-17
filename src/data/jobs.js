// 私活系统 - 4种私活类型

export const jobs = [
    {
        id: 'cad',
        name: '描CAD底图',
        requirement: { software: 30 },
        payment: 1000,
        description: '这种活狗都不接。'
    },
    {
        id: 'su',
        name: 'SU简单建模',
        requirement: { design: 60, software: 30 },
        payment: 2500,
        description: '甲方觉得五分钟就能推出来。'
    },
    {
        id: 'render',
        name: '后期效果图渲染',
        requirement: { software: 100, design: 80 },
        payment: 5000,
        description: '在冷淡的方案里塞进纸片人。'
    },
    {
        id: 'master',
        name: '境外外包项目',
        requirement: { software: 150, design: 150 },
        payment: 10000,
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
