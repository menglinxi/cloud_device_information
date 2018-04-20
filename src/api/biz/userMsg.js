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
     * 获取渠道列表
     * @param {Number} type 渠道级别0为顶级，1为子级
     * @param {Function} success 成功回调
     */
    channels(type, success) {
        http.get('channel/all', {
            type: type
        }, success)
    }
}