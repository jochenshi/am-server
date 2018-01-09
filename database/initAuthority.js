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
        value: 'assignMachine',
        name: '分配机器',
        description: '分配机器'
    },
    {
        value: 'withdrawMachine',
        name: '收回机器',
        description: '收回机器'
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
        value: 'withdrawNormalEquip',
        name: '收回',
        description: '收回普通配件'
    },
    // {
    //     value: 'applyNormalEquip',
    //     name: '申请',
    //     description: '申请普通配件'
    // },
    {
        value: 'linkNormalEquip',
        name: '关联',
        description: '普通配件展示列表的关联操作'
    },
    {
        value: 'unlinkNormalEquip',
        name: '取消关联',
        description: '普通配件展示列表的取消关联操作'
    },
    {
        value: 'linkManyNormal',
        name: '批量关联',
        description: '在机器的详情页面批量关联相应类型的配件'
    },
    {
        value: 'unlinkManyNormal',
        name: '批量取消关联',
        description: '在机器的详情页面批量取消关联相应类型的配件'
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
        value: 'withdrawSupplyEquip',
        name: '收回',
        description: '收回耗材配件'
    },
    // {
    //     value: 'applySupplyEquip',
    //     name: '申请',
    //     description: '申请耗材配件'
    // }
    //用户管理的相关的权限
    {
        value: 'addUser',
        name: '添加',
        description: '创建用户'
    },
    {
        value: 'showNotRoot',
        name: '展示',
        description: '展示非Root用户'
    },
    // {
    //     value: 'showIncludeRoot',
    //     name: '展示',
    //     description: '展示包括Root用户的所有用户'
    // }
];

const finalAuthority = {
    'R0002': authorityData
}

const executeAuthority = async () => {
    for (let k in finalAuthority) {
        let role = await model.role.findAll({
            where: {
                code: k
            }
        });
        if (role.length) {
            for (let i = 0; i < finalAuthority[k].length; i++) {
                let auth = await model.authority.create(finalAuthority[k][i])
                //await initAuthority(finalAuthority[k][i]);
                await role[0].addAuthority(auth)
            }
        }
    }
};

module.exports = executeAuthority;