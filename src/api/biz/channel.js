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
    /**获取所属公司列表
     * 
     * 
     * @param {Function} success 回调
     */
    companylist(success) {
        http.get('codebook/sub/2',success);
    },
    /**
    * 所有渠道（不带分页）
    * @param {string} type
    * @param {Function} success 回调
    */
    allList(type, success) {
        http.get('channel/all', {
            type: type
        },
            success);
    },
    /**
     * 新增渠道
     * @param {string} name 名称
     * @param {string} companyid
     * @param {string} code 渠道码
     * @param {string} linkman 说明
     * @param {Function} success 回调  
     */
    add(msg, success) {
        http.postBody('channel/add', {
            name: msg.name,
            code: msg.code,
            linkman: msg.linkman,
            companyid: msg.companyid
        }, success)
    },
    /**
    * 新增子渠道
    * @param {string} pid
    * @param {string} name 名称
    * @param {string} code 渠道码
    * @param {string} linkman 说明
    * @param {Function} success 回调  
    */
    addchild(pid, msg, success) {
        http.postBody('channel/addchild', {
            name: msg.name,
            code: msg.code,
            linkman: msg.linkman,
            pid:pid     
        }, success)
        console.log('msg',msg)
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