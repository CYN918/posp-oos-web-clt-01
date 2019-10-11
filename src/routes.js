import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import terminalStorage from './views/terminal/terminalStorage.vue'
import terminalTransfer from './views/terminal/terminalTransfer.vue'
import transferRecord from './views/terminal/transferRecord.vue'
import transferVendor from './views/terminal/transferVendor.vue'
import policyManagement from './views/policy/policyManagement.vue'
import activateCashback from './views/policy/activateCashback.vue'
import activityCashBack from './views/policy/activityCashBack.vue'
import vipcashBack from './views/policy/vipcashBack.vue'
import couPon from './views/policy/couPon.vue'
import agentManagement from './views/agency/agentManagement.vue'
import creditCardTransaction from './views/transaction/creditCardTransaction.vue'
import VIPTransactionRecord from './views/transaction/VIPTransactionRecord.vue'
import repaymentOrder from './views/transaction/repaymentOrder.vue'
import separateRecord from './views/transaction/separateRecord.vue'
import cashBackRecord from './views/transaction/cashBackRecord.vue'
import withdrawalsRecord from './views/transaction/withdrawalsRecord.vue'
import merchantManagement from './views/merchant/merchantManagement.vue'
import bankCardManagement from './views/merchant/bankCardManagement.vue'
import factoringManagement from './views/factoring/factoringManagement.vue'
import repaymentRecord from './views/factoring/repaymentRecord.vue'
import deductibleRecord from './views/factoring/deductibleRecord.vue'
import rechargeRecord from './views/factoring/rechargeRecord.vue'
import agentManagements from './views/statistical/agentManagements.vue'
import terminalManagement from './views/statistical/terminalManagement.vue'
import incomeStatistics from './views/statistical/incomeStatistics.vue'
import adManagement from './views/advertising/adManagement.vue'
import appManagement from './views/systemManagement/appManagement.vue'
import adMinistrator from './views/systemManagement/adMinistrator.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '终端管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/terminalStorage', component: terminalStorage, name: '终端入库' },
            { path: '/terminalTransfer', component: terminalTransfer, name: '终端划拨' },
            { path: '/transferRecord', component: transferRecord, name: '划拨记录' },
            { path: '/transferVendor', component: transferVendor, name: '厂商管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '政策管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/policyManagement', component: policyManagement, name: '政策管理－添加' },
            { path: '/activateCashback', component: activateCashback, name: '激活返现' },
            { path: '/activityCashBack', component: activityCashBack, name: '活动返现' },
            { path: '/vipcashBack', component: vipcashBack, name: 'VIP返现' },
            { path: '/couPon', component: couPon, name: '优惠券' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '代理商管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/agentManagement', component: agentManagement, name: '代理商管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '交易管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/creditCardTransaction', component: creditCardTransaction, name: '刷卡交易' },
            { path: '/VIPTransactionRecord', component: VIPTransactionRecord, name: 'VIP交易记录' },
            { path: '/repaymentOrder', component: repaymentOrder, name: '还款交易订单' },
            { path: '/separateRecord', component: separateRecord, name: '分润记录' },
            { path: '/cashBackRecord', component: cashBackRecord, name: '返现记录' },
            { path: '/withdrawalsRecord', component: withdrawalsRecord, name: '提现记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商户管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/merchantManagement', component: merchantManagement, name: '商户管理' },
            { path: '/bankCardManagement', component: bankCardManagement, name: '银行卡管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '保理管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/factoringManagement', component: factoringManagement, name: '保理管理' },
            { path: '/repaymentRecord', component: repaymentRecord, name: '还款记录' },
            { path: '/deductibleRecord', component: deductibleRecord, name: '抵扣记录' },
            { path: '/rechargeRecord', component: rechargeRecord, name: '充值记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/agentManagements', component: agentManagements, name: '代理商管理' },
            { path: '/terminalManagement', component: terminalManagement, name: '终端管理' },
            { path: '/incomeStatistics', component: incomeStatistics, name: '收益统计' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '公告管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/adManagement', component: adManagement, name: '公告管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/appManagement', component: appManagement, name: 'APP版本管理' },
            { path: '/adMinistrator', component: adMinistrator, name: '管理员' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;