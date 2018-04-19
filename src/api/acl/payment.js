import http from '@/http';

export default {
    /**
     * 支付数据列表
     * @param {Number} page 页码
     * @param {String} orderid 订单id
     * @param {String} gamename 游戏名称
     * @param {Function} success 成功回调
     */
        payList(page, orderid, gamename, success) {
            http.get('pay/list', {
                page: page,
                orderid: orderid,
                gamename: gamename
            }, success)
        },
    
    /**
     * 修改支付状态
     * @param {Number} id ID
     * @param {Number} status 支付状态
     * @param {Function} success 成功回调
     */
        payStatus(id, status, success) {
            http.postBody('pay/updpay', {
                id: id,
                status: status
            }, success)
        }
}