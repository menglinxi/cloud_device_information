import http from '@/http';

export default {
    /**
     * 图片列表
     * @param {number} page 页码
     * @param {Function} success 成功回调
     */
    imgList(page, success) {
        http.get('games/listimg', {
            page: page
        }, success);
    },
    /**
     * 上传图片
     * @param {object} file 图片
     * @param {Function} success 成功回调
     */
    uploadImg(file, success) {
        http.postBody('image/uploadimg', file, success)
    },
    /**
     * 添加图片
     * @param {string} imgurl 图片url
     * @param {Function} success 成功回调
     */
    addImg(imgurl, success) {
        http.postBody('games/addimg', {
            imgurl: imgurl
        }, success)
    },
    /**
     * 删除图片
     * @param {number} id ID
     * @param {Function} success 成功回调
     */
    delImg(id, success) {
        http.get('games/delimg', {
            id: id
        }, success)
    }
}