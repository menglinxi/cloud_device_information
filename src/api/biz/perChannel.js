import http from '@/http';

export default {
    /**
     * 数据列表
     * @param {number} page 
     * @param {string} startTime 
     * @param {string} endTime 
     * @param {Function} success 
     */
    list(page, timeRange, success) {
        http.postBody('channel/listdayData', {
            page: page,
            startTime: timeRange[0],
            endTime: timeRange[1]
        }, success);
    },
    /**
     * 添加数据 
     * @param {Object} obj 
     * @param {Function} success 
     */
    addData(obj, success) {
        http.postBody('channel/adayData', obj, success);
    },
    /**
     * 编辑数据
     * @param {object} obj 
     * @param {Function} success 
     */
    editData(obj, success) {
        http.postBody('channel/edayData', obj, success);
    },
    /**
     * 删除数据
     * @param {number} id 
     * @param {Function} success 
     */
    delData(id, success) {
        http.get('channel/deldayData', {
            id: id
        }, success);
    }
}