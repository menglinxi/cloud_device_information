import http from '@/http';

export default {
    /**
     * 信息列表
     * @param {Object} obj 请求参数
     * @param {Function} success 成功回调
     */
    list(obj, success) {
        http.get('/account/reguser', obj, success)
    },
    /**
     * 获取公司列表
     * @param {Function} success 成功回调
     */
    company(success) {
        http.get('codebook/top/2', success)
    },
    /**
     * 获取公司下的父渠道列表
     * @param {Number} companyId 公司id
     * @param {Function} success 成功回调 
     */
    channelOfCompany(companyId, success) {
        http.get('channel/channelbycompany', {
            companyid: companyId,
            type: 0
        }, success)
    },
    /**
     * 获取父渠道下的子渠道列表
     * @param {Number} id 父渠道id
     * @param {Function} success 成功回调
     */
    subOfChannel(id, success) {
        http.get('channel/sub', {
            id: id
        }, success)
    }
}