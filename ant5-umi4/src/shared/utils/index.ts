export * from './jsencrypt';

/**
 * 获取字符串中包含字符种类个数
 * @param value 字符串
 * @returns 字符种类个数
 */
export const getContainCharsTotal = (value: string) => {
  let Modes = 0;
  for (let i = 0; i < value.length; i += 1) {
    Modes |= CharMode(value.charCodeAt(i));
  }
  return bitTotal(Modes);

  // CharMode函数
  function CharMode(iN: number) {
    if (iN >= 48 && iN <= 57)
      // 数字
      return 1;
    if (iN >= 65 && iN <= 90)
      // 大写字母
      return 2;
    if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
      // 大小写
      return 4;
    else return 8; // 特殊字符
  }

  // bitTotal函数
  function bitTotal(num: number) {
    let modes = 0;
    for (let i = 0; i < 4; i += 1) {
      if (num & 1) modes += 1;
      num >>>= 1;
    }
    return modes;
  }
};

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
