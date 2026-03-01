// 25个专业课题库 - 5个年级 × 5个课题

export const projects = {
    year1: [
        { id: 'y1p1', name: '空间构成练习', year: 1, baseProgress: 0, baseQuality: 0 },
        { id: 'y1p2', name: '艺术家工作室', year: 1, baseProgress: 0, baseQuality: 0 },
        { id: 'y1p3', name: '校园茶室设计', year: 1, baseProgress: 0, baseQuality: 0 },
        { id: 'y1p4', name: '木构装置建构', year: 1, baseProgress: 0, baseQuality: 0 },
        { id: 'y1p5', name: '极小住宅', year: 1, baseProgress: 0, baseQuality: 0 }
    ],
    year2: [
        { id: 'y2p1', name: '独栋别墅设计', year: 2, baseProgress: 0, baseQuality: 0 },
        { id: 'y2p2', name: '社区幼儿园', year: 2, baseProgress: 0, baseQuality: 0 },
        { id: 'y2p3', name: '小型图书馆', year: 2, baseProgress: 0, baseQuality: 0 },
        { id: 'y2p4', name: '水岸划船俱乐部', year: 2, baseProgress: 0, baseQuality: 0 },
        { id: 'y2p5', name: '乡村文化中心', year: 2, baseProgress: 0, baseQuality: 0 }
    ],
    year3: [
        { id: 'y3p1', name: '城市美术馆', year: 3, baseProgress: 0, baseQuality: 0 },
        { id: 'y3p2', name: '创意产业办公', year: 3, baseProgress: 0, baseQuality: 0 },
        { id: 'y3p3', name: '适老化社区', year: 3, baseProgress: 0, baseQuality: 0 },
        { id: 'y3p4', name: '实验剧场设计', year: 3, baseProgress: 0, baseQuality: 0 },
        { id: 'y3p5', name: '高层办公基础', year: 3, baseProgress: 0, baseQuality: 0 }
    ],
    year4: [
        { id: 'y4p1', name: '旧城遗存更新', year: 4, baseProgress: 0, baseQuality: 0 },
        { id: 'y4p2', name: '综合性医院', year: 4, baseProgress: 0, baseQuality: 0 },
        { id: 'y4p3', name: '城市交通枢纽', year: 4, baseProgress: 0, baseQuality: 0 },
        { id: 'y4p4', name: '超高层综合体', year: 4, baseProgress: 0, baseQuality: 0 },
        { id: 'y4p5', name: '工业遗址博物馆', year: 4, baseProgress: 0, baseQuality: 0 }
    ],
    year5: [
        { id: 'y5p1', name: 'TOD综合体', year: 5, baseProgress: 0, baseQuality: 0 },
        { id: 'y5p2', name: '未来机场设计', year: 5, baseProgress: 0, baseQuality: 0 },
        { id: 'y5p3', name: '垂直城市社区', year: 5, baseProgress: 0, baseQuality: 0 },
        { id: 'y5p4', name: '零碳生态园区', year: 5, baseProgress: 0, baseQuality: 0 },
        { id: 'y5p5', name: '毕业设计：大型奥体中心', year: 5, baseProgress: 0, baseQuality: 0 }
    ]
};

// 根据年级随机抽取课题
export function drawProject(year) {
    const yearProjects = projects[`year${year}`];
    if (!yearProjects || yearProjects.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * yearProjects.length);
    const selectedProject = yearProjects[randomIndex];

    // 返回带有正确字段名的副本
    return {
        id: selectedProject.id,
        name: selectedProject.name,
        year: selectedProject.year,
        progress: selectedProject.baseProgress,  // 重命名为progress
        quality: selectedProject.baseQuality,    // 重命名为quality
        hasModel: false
    };
}

// 获取所有课题列表
export function getAllProjects() {
    return Object.values(projects).flat();
}
