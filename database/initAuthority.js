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
    //机器相关权限
    {
        value: 'addMachine',
        name: '添加',
        description: '添加机器'
    },
    {
        value: 'modifyMachine',
        name: '修改',
        description: '修改机器(普通修改)'
    },
    {
        value: 'address',
        name: '查看机器地址',
        description: '查看地址'
    },
    {
        value: 'addAddress',
        name: '设置IP/IPMI',
        description: '设置机器IP/IPMI,用户名，密码'
    },
    {
        value: 'modifyAddress',
        name: '修改IP/IPMI',
        description: '修改机器IP/IPMI，用户名，密码'
    },
    //配件的相关权限
    {
        value: 'addNormalEquip',
        name: '添加',
        description: '添加普通配件'
    },
    {
        value: 'modifyNormalEquip',
        name: '修改',
        description: '修改普通配件'
    },
    {
        value: 'assignNormalEquip',
        name: '分配',
        description: '分配普通配件'
    },
    {
        value: 'returnNormalEquip',
        name: '归还',
        description: '归还普通配件'
    },
    {
        value: 'applyNormalEquip',
        name: '申请',
        description: '申请普通配件'
    },
    {
        value: 'linkNormalEquip',
        name: '关联',
        description: '关联普通配件'
    },
    {
        value: 'unlinkNormalEquip',
        name: '取消关联',
        description: '取消关联普通配件'
    },
    {
        value: 'addSupplyEquip',
        name: '添加',
        description: '添加耗材配件'
    },
    {
        value: 'modifySupplyEquip',
        name: '修改',
        description: '修改耗材配件'
    },
    {
        value: 'assignSupplyEquip',
        name: '分配',
        description: '分配耗材配件'
    },
    {
        value: 'returnSupplyEquip',
        name: '归还',
        description: '归还耗材配件'
    },
    {
        value: 'applySupplyEquip',
        name: '申请',
        description: '申请耗材配件'
    },
    {
        value: '',
        name: '',
        description: ''
    }
];

const executeAuthority = () => {
    authorityData.forEach((val) => {
        initAuthority(val);
    })
};

module.exports = executeAuthority;