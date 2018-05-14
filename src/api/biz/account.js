import http from '@/http'

export default {
    /**
     * 列表
     * @param {number} page 页码
     * @param {Function} success 回调
     */
    list(page, success) {
        http.get('account/list', {
            page: page
        }, success);
    },
    /**
     * 添加
     * @param {string} name 名称
     * @param {string} pwd 密码
     * @param {string} channelid 渠道id
     * @param {string} descs 说明
     * @param {Function} success 回调
     */
    add(obj, success) {
        http.postBody('account/add', {
            name: obj.name,
            pwd: obj.pwd,
            channel: obj.channelid || '',
            descs: obj.descs || ''
        }, success);
    },
    /**
     * 编辑
     * @param {string} id ID
     * @param {string} name 名称
     * @param {string} pwd 密码
     * @param {string} channelid 渠道id
     * @param {Function} success 回调
     */
    edit(obj, success) {
        http.postBody('account/edit', {
            id: obj.id,
            name: obj.name,
            pwd: obj.pwd,
            channel: obj.channelid,
            descs: obj.descs
        }, success);
    },
    /**
     * 删除
     * @param {string} id ID
     * @param {Function} success 回调
     */
    delete(id, success) {
        http.get('account/delete/' + id, success);
    },
    /**
     * 搜索
     * @param {string} key 搜索关键词
     * @param {number} page 页码
     * @param {channelid} channelid 页码
     * @param {Function} success 回调
     */
    search(key, page, channelid, success) {
        http.get('account/search', {
            key: key,
            channelid:channelid,
            page: page
        }, success);
    },
    /**
     * 分配渠道
     * @param {array} ids IDs
     * @param {number} channelId 渠道ID
     * @param {Function} success 回调
     */
    editChannel(id, channelId, success) {
        http.postBody('account/updchannel', {
            ids: id,
            channelid: channelId
        }, success)
    },
    /**
     * 上传txt文件
     * @param {Object} txt txt文件
     * @param {Function} success 成功回调
     */
    uploadTxt(txt, success) {
        http.postBody('/account/uploadtxt', txt, success)
    }
}