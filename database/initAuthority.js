const model = require('../src/models');

const initAuthority = async (obj) => {
    try {
        await model.authority.create(obj);
    } catch (err) {
        return false;
    }
};

const authorityData = [
    //树节点的展示的相关权限
    {
        value: 'storeInfo',
        name: '库存信息',
        description: ''
    },
    {
        value: 'storeHistory',
        name: '库存记录',
        description: ''
    },
    {
        value: 'deviceMachine',
        name: '机器',
        description: ''
    },
    {
        value: 'deviceEquip',
        name: '配件',
        description: ''
    },
    {
        value: 'deviceUseHistory',
        name: '领用/归还记录',
        description: ''
    },
    {
        value: 'userManage',
        name: '用户管理',
        description: ''
    },
    {
        value: 'healthRecord',
        name: '健康记录',
        description: ''
    },
    {
        value: 'operateRecord',
        name: '操作记录',
        description: ''
    },
    {
        value: 'optionSet',
        name: '选项设置',
        description: ''
    },
    //配件的相关权限
    {
        value: 'addNormalEquip',
        name: '添加普通配件',
        description: ''
    },
    {
        value: 'assignNormalEquip',
        name: '分配普通配件',
        description: ''
    },
    {
        value: 'returnNormalEquip',
        name: '归还普通配件',
        description: ''
    },
    {
        value: 'applyNormalEquip',
        name: '申请普通配件',
        description: ''
    },
    {
        value: 'addSupplyEquip',
        name: '添加耗材配件',
        description: ''
    },
    {
        value: 'assignSupplyEquip',
        name: '分配耗材配件',
        description: ''
    },
    {
        value: 'returnSupplyEquip',
        name: '归还耗材配件',
        description: ''
    },
    {
        value: 'applySupplyEquip',
        name: '申请耗材配件',
        description: ''
    }
];

const executeAuthority = () => {
    authorityData.forEach((val) => {
        initAuthority(val);
    })
};

module.exports = executeAuthority;