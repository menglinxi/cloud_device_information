import http from '@/http'

export default {
  /**
   * 登录
   * @param {Object} loginForm 登录信息
   * @param {*} success 回调
   */
  login(loginForm, success, fail) {
    http.postBody('user/login', loginForm, success, fail);
  },
  /**
   * Token列表
   * @param {Function} success 回调
   */
  list(success) {
    http.get('userToken/list', success);
  },
  /**
   * Token检索
   * @param {number} page 页码
   * @param {string} key 关键词
   * @param {Function} success 回调
   */
  search(key, success) {
    http.get('userToken/search', {
      key: key
    }, success);
  },
  /**
   * 添加Token
   * @param {Object} user 用户
   * @param {Function} success 回调
   */
  add(user, success) {
    http.postBody('userToken/add', user, success)
  },
  /**
   * 编辑Token
   * @param {Object} data 用户
   * @param {Function} success 回调
   */
  edit(data, success) {
    http.postBody('userToken/edit', data, success)
  },
  /**
   * Token状态
   * @param {Object} user 用户
   * @param {Function} success 回调
   */
  status(user, success) {
    http.get('userToken/status', user, success);
  },
}
