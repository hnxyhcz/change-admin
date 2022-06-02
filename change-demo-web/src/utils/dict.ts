// 姓名正则
export const NAME_REGEXP = /^[\u4e00-\u9fa5·]{2,}$/;

// 手机号正则
export const MOBILE_REGEXP = /^1[3456789]\d{9}$/

// 身份证号正则
export const ID_CARD_REGEXP = /^([1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx])$|^([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])$/

// 性别
export const SEX = [
  {
    value: 0,
    label: "男",
  },
  {
    value: 1,
    label: "女",
  },
]

// 是、否
export const YES_NO = [
  {
    value: 1,
    label: "是",
  },
  {
    value: 0,
    label: "否",
  },
]
// 北方省份编码
export const NORTH_CODE = [11, 12, 13, 14, 15, 21, 22, 23, 37, 41, 61, 62, 63, 64, 65]

// 省份
export const PROVINCE = [
  { value: 11, label: "北京市"},
  { value: 12, label: "天津市"},
  { value: 13, label: "河北省"},
  { value: 14, label: "山西省"},
  { value: 15, label: "内蒙古自治区"},
  { value: 21, label: "辽宁省"},
  { value: 22, label: "吉林省"},
  { value: 23, label: "黑龙江省"},
  { value: 31, label: "上海市"},
  { value: 32, label: "江苏省"},
  { value: 33, label: "浙江省"},
  { value: 34, label: "安徽省"},
  { value: 35, label: "福建省"},
  { value: 36, label: "江西省"},
  { value: 37, label: "山东省"},
  { value: 41, label: "河南省"},
  { value: 42, label: "湖北省"},
  { value: 43, label: "湖南省"},
  { value: 44, label: "广东省"},
  { value: 45, label: "广西壮族自治区"},
  { value: 46, label: "海南省"},
  { value: 50, label: "重庆市"},
  { value: 51, label: "四川省"},
  { value: 52, label: "贵州省"},
  { value: 53, label: "云南省"},
  { value: 54, label: "西藏自治区"},
  { value: 61, label: "陕西省"},
  { value: 62, label: "甘肃省"},
  { value: 63, label: "青海省"},
  { value: 64, label: "宁夏回族自治区"},
  { value: 65, label: "新疆维吾尔自治区"},
  { value: 71, label: "台湾省"},
  { value: 81, label: "香港特别行政区"},
  { value: 82, label: "澳门特别行政区"},
]