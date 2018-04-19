import http from '@/http';

export default {
    /**
     * 任务列表
     * @param {num} page 页码
     * @param {Function} success 回调
     */
    list(page, success) {
        http.get('datatask/list', {
            page: page
        }, success)
    },
    /**
     * 创建任务
     * @param {Object} obj 新任务
     * @param {Function} success 回调
     */
    create(obj, success) {
        http.postBody('datatask/add', obj, success)
    },
    /**
     * 数据列表
     * @param {Object} obj 新任务
     * @param {Function} success 回调
     */
    getData(obj, success) {
        http.post('datatask/uploadexl', obj, success)
    },
    /**
     * 修改数据
     * @param {Object} newData 新数据
     * @param {Function} success 回调
     */
    editData(newData, success) {
        http.postBody('datatask/updtaskdata', newData, success)
    },
    /**
     * 删除数据
     * @param {String} id ID
     * @param {Function} success 回调
     */
    delData(id, success) {
        http.get('datatask/deltaskdate', {
            id: id
        }, success)
    },
    /**
     * 添加档位
     * @param {String} taskid ID
     * @param {String-Array} paydata 档位概率
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    editPayData(taskid, paydata, success, fail) {
        http.postBody('datatask/updpaydata', {
            id: taskid,
            paydata: paydata
        }, success, fail)
    },
    /**
     * 任务状态修改
     * @param {String} taskid ID
     * @param {Number} status 状态码
     * @param {Function} success 成功回调
     * @param {Function} fail 失败回调
     */
    changeStatus(taskid, status, success, fail) {
        http.postBody('datatask/updstatus', {
            id: taskid,
            status: status
        }, success, fail)
    },
}
