/**
 * 截取固定小数位
 */
export function toFixeds(val, digits = 2) {
    if (val === undefined || val === null) return 0
    val = val.toString()
    let index = val.indexOf('.')
    if (index !== -1) {
        val = val.substring(0, index + digits + 1)
    }
    return Number(val).toFixed(digits)
}

/**
 * 数字转化成金额并保留固定小数位
  */
export function transMoney(value, digit = 2) {
    if (value === 0) {
        return parseFloat(value).toFixed(2);
    }
    if (value != "") {
        var num = "";
        value += "";
        let n = value.replace(/,/g, '')
        value = toFixeds(n, digit)
        if (value.indexOf(".") == -1) {
            num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                return s + ',';
            });
        } else {
            num = value.replace(/(\d)(?=(\d{3})+\.)/g, function (s) {
                return s + ',';
            });
        }
    } else {
        num = ""
    }
    return num;
}
