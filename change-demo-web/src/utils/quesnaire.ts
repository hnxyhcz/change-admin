
/**
 * 单位换算: mg/dl 转换成 mmol/L
 * @param value 值
 * @param unit 单位
 * @param spec 1 mmol/L = ? mg/dl
 */
export const convertMillimole = (value: number = 0, unit: string = 'mmol/L', spec: number) => {
  if (unit === 'mg/dl') {
    return Math.round(value / spec * 100) / 100
  }
  return value;
}

/**
 * 根据身高体重计算BMI
 * @param height 身高
 * @param weight 体重
 * @returns BMI
 */
export const calcBMI = (height: number = 0, weight: number = 0) => {
  if (!height) {
    return 0;
  }
  const bmi = weight / (height * height / 10000)
  return Math.round(bmi * 100) / 100;
}

/**
 * 格式化基础问卷答案
 */
export const formatBasicAnswer = (result: any) => {
  // 血糖单位换算
  const { glu, gluUnit } = result
  result.glu = convertMillimole(glu, gluUnit, 18);
  // 高密度脂蛋白换算
  const { hdl, hdlUnit } = result
  result.hdl = convertMillimole(hdl, hdlUnit, 38.66);
  // 总胆固醇换算
  const { tc, tcUnit } = result
  result.tc = convertMillimole(tc, tcUnit, 38.66);
  // 甘油三酯换算
  const { tg, tgUnit } = result
  result.tg = convertMillimole(tg, tgUnit, 88.6);
  // 删除单位
  Object.keys(result).filter(key => !key.endsWith("Unit"));
  // 计算BMI
  const { height, weight } = result;
  result.bmi = calcBMI(height, weight)
}

/**
 * 格式化颈动脉超声问卷答案
 */
export const formatCarotidAnswer = (result: any) => {
  // 体力活动是否达标
  result.pa = 0;
  const { activityType = 0, activityHour = 0 } = result;
  if ([1, 3, 4, 6].includes(activityType) && activityHour >= 2.5) {
    result.pa = 1
  }
  if ([2, 5].includes(activityType) && activityHour >= 1.25) {
    result.pa = 1
  }
  // 是否膳食健康
  let score = 0;
  const { dietCoarseGrain, dietMeat, dietSeafood, dietVegetables, dietFruits, dietBeans } = result;
  if (dietCoarseGrain === 1) {
    score += 1;
  }
  if ([4, 5].includes(dietMeat)) {
    score += 1;
  }
  if ([1, 2, 3].includes(dietSeafood)) {
    score += 1;
  }
  if (dietVegetables === 1) {
    score += 1;
  }
  if (dietFruits === 1) {
    score += 1;
  }
  if ([1, 2].includes(dietBeans)) {
    score += 1;
  }
  result.diet = score >= 4 ? 1 : 0;
}


/**
 * 计算事件发生的概率
 * 公式：ln(p/(1-p)) = 截距 + Σ(estimate * 变量)
 */
export const algorithm = (model: any, answer: any) => {
  // 计算 total = 截距 + Σ(estimate * 变量)
  const intercept = model['intercept'];
  let estimate = 0;
  Object.keys(model).forEach(key => {
    if (answer[key] && model[key]) {
      estimate += (answer[key] * model[key])
    }
  })
  const total = intercept + estimate
  // 则 => p = (e^total/(1+e^total))
  const et = Math.exp(total);
  const result = et / (1 + et);
  return result;
}
