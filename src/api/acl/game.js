import http from '@/http'

export default {
    /**
     * 游戏列表
     * @param {number} page 页码
     * @param {Function} success 回调
     */
    list(page, success) {
        http.get('games/list', {
            page: page
        }, success);
    },
    /**
     * 添加游戏
     * @param {string} gamename 游戏名称
     * @param {string} pic 游戏图片地址
     * @param {string} dlurl 下载地址
     * @param {string} channel 所属渠道
     * @param {Function} success 回调
     */
    add(obj, success) {
        http.postBody('games/add', {
            gamename: obj.gamename,
            pic: obj.pic,
            dlurl: obj.dlurl,
            channel: obj.channel,
            apkpackage:obj.apkpackage
        }, success);
    },
    /**
     * 编辑游戏
     * @param {string} id ID
     * @param {string} gamename 游戏名称
     * @param {string} pic 游戏图片地址
     * @param {string} dlurl 下载地址
     * @param {string} channel 所属渠道
     * @param {Function} success 回调
     */
    edit(obj, success) {
        http.postBody('games/edit', {
            id: obj.id,
            gamename: obj.gamename,
            pic: obj.pic,
            dlurl: obj.dlurl,
            channel: obj.channel,
            apkpackage:obj.apkpackage
        }, success);
    },
    /**
     * 删除游戏
     * @param {string} id ID
     * @param {Function} success 回调
     */
    delete(id, success) {
        http.get('games/delete/' + id, success);
    },
    /**
     * 搜索游戏
     * @param {string} key 搜索关键词
     * @param {number} page 页码
     * @param {number} channelId 渠道id
     * @param {Function} success 回调
     */
    search(key, page, channelid, success) {
        http.get('games/search', {
            key: key,
            channelid: channelid,
            page: page
        }, success);
    }
}