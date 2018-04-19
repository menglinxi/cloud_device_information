import http from '@/http';

export default {
    /**
     * 渠道列表
     * @param {number} page 页码
     * @param {Function} success 回调
     */
    list(page, success) {
        http.get('channel/list', {
            page: page
        }, success);
    },
    /**
     * 所有渠道（不带分页）
     * @param {Function} success 回调
     */
    allList(success) {
        http.get('channel/all', success);
    },
    /**
     * 新增渠道
     * @param {string} name 名称
     * @param {string} code 渠道码
     * @param {string} linkman 说明
     * @param {Function} success 回调  
     */
    add(msg, success) {
        http.postBody('channel/add', {
            name: msg.name,
            code: msg.code,
            linkman: msg.linkman
        }, success)
    },
    /**
     * 编辑渠道
     * @param {string} id  ID
     * @param {string} code 渠道码
     * @param {string} linkman 说明
     * @param {Function} success 回调 
     */
    edit(msg, success) {
        http.postBody('channel/edit', {
            id: msg.id,
            name: msg.name,
            code: msg.code,
            linkman: msg.linkman
        }, success)
    },
    /**
     * 搜索渠道
     * @param {string} key 关键词
     * @param {number} page 页码
     * @param {Function} success 回调
     */
    search(key, page, success) {
        http.get('channel/search', {
            key: key,
            page: page
        }, success)
    },
    /**
     * 删除渠道
     * @param {string} id ID
     * @param {Function} success 回调
     */
    delete(id, success) {
        http.get('channel/delete/' + id, success);
    }
}