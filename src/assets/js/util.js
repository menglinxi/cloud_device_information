/**
 * 格式化时间戳
 * @method dateFormat
 * @param  {[Number]}   timestamp [时间戳]
 * @param  {[String]}   symbol    [分隔符，默认为 - ]
 * @return {[String]} [返回一个指定分隔符的日期]
 */
export function dateFormat (timestamp, symbol) {

  if (!timestamp) return

  if (typeof timestamp != 'number') {
    throw("无效时间戳，timestamp 应该为 Number 类型");
  }

  if (symbol && typeof symbol != 'string') {
    throw("无效分隔符，symbol 应该为 String 类型")
  }

  let date = new Date(timestamp), sy

  symbol ? sy = symbol : sy = '-'

  let year, month, day

  year = date.getFullYear()

  date.getMonth() >= 10 ? month = date.getMonth() + 1 : month = `0${date.getMonth() + 1}`

  date.getDate() >= 10 ? day = date.getDate() : day = `0${date.getDate()}`

  return `${year}${sy}${month}${sy}${day}`
}
