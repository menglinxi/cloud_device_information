import http from '@/http'

export default {
    /**
     * 设备列表
     * @param {num} page
     * @param {string} type
     * @param {Function} success 回调
     */
    list(page,type,success) {
        if(type=='ios'){
            http.get('devices/ioslist', {
                page: page
            }, success);
        }else{
            http.get('devices/list', {
                page: page
            }, success);
        }
    },
    /**
     * 设备检索
     * @param {number} page 页码
     * @param {string} key 关键词
     * @param {string} type 关键词
     * @param {Function} success 回调
     */
    search(key,page,type, success) {
        console.log(type);
        if (type =='Android'){
            http.get('devices/search', {
                key: key,
                page: page
            }, success);
        }else{
            http.get('devices/iossearch', {
                key: key,
                page: page
            }, success);
        }
    },
}
