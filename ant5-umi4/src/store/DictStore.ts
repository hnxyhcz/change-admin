import { action, define, observable } from '@formily/reactive';
import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';
import { LiteralUnion } from 'antd/es/_util/type';

import { listSimpleDeptApi } from '@/services/system/dept';
import { DeptVO } from '@/services/system/dept/types';
import {
  listSimpleDictDataApi,
  simpleDictDataByType,
} from '@/services/system/dict/dictData';
import { DictDataVO } from '@/services/system/dict/types';
import { getListSimpleUsersApi } from '@/services/system/user';
import { handleTree } from '@/shared/tree';

export interface DictData {
  label: string;
  value: string | number;
  colorType: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  cssClass: string;
  parentCode?: string | number;
  children?: DictData[];
}

export default class DictStore {
  /** 系统字典集合 */
  dictMap: Record<string, DictData[]> = {};
  cascadeMap: Record<string, DictData[]> = {};

  constructor() {
    this.makeObservable();
    this.initDictData();
  }

  makeObservable() {
    define(this, {
      dictMap: observable.shallow,
      cascadeMap: observable.shallow,
      getDictData: action,
      getDeptDict: action,
      getCascadeDict: action,
      getDictItem: action,
    });
  }

  /**
   * 初始化字典
   */
  initDictData() {
    this.getCascadeDict(DICT_TYPE.DEPT);

    listSimpleDictDataApi().then((res) => {
      this.dictMap = res?.reduce(
        (dataArr: Record<string, DictData[]>, data: DictDataVO) => {
          const { dictType, ...dictData } = data;
          dataArr[dictType] ??= [];
          dataArr[dictType].push(dictData);
          return dataArr;
        },
        {},
      );
    });
  }

  /**
   * 根据字典类型获取字典
   * @param dictType  字典类型
   * @param refresh 是否强制刷新
   * @returns 字典集合
   */
  async getDictData(dictType: string, refresh: boolean = false) {
    if (this.dictMap[dictType] && !refresh) {
      return this.dictMap[dictType];
    }
    if (dictType === DICT_TYPE.USER) {
      const result = await getListSimpleUsersApi();
      this.dictMap[dictType] = result;
      return result || [];
    }
    const result = await simpleDictDataByType(dictType);
    if (result) {
      delete result.dictType;
      this.dictMap[dictType] = result;
    }
    return result || [];
  }

  /**
   * 根据字典类型获取字典
   * @param refresh 是否强制刷新
   * @returns 字典集合
   */
  async getDeptDict(refresh: boolean = false) {
    if (this.dictMap[DICT_TYPE.DEPT] && !refresh) {
      return this.dictMap[DICT_TYPE.DEPT];
    }
    const result = await listSimpleDeptApi();
    if (result) {
      this.dictMap[DICT_TYPE.DEPT] = result.map((dept: DeptVO) => ({
        label: dept.name,
        value: dept.id,
        parentCode: dept.parentId,
      }));
    }
    return this.dictMap[DICT_TYPE.DEPT] || [];
  }

  /**
   * 根据字典类型获取级联
   * @param refresh 是否强制刷新
   * @returns 级联
   */
  async getCascadeDict(dictType: string, refresh: boolean = false) {
    if (this.cascadeMap[dictType] && !refresh) {
      return this.cascadeMap[dictType];
    }
    let result;
    if (dictType === DICT_TYPE.DEPT) {
      result = await this.getDeptDict(refresh);
    } else {
      result = await this.getDictData(dictType, refresh);
    }
    if (result) {
      this.cascadeMap[dictType] = handleTree(result, 'value', 'parentCode');
      return this.cascadeMap[dictType];
    }
    return [];
  }

  /**
   * 获取字典项
   * @param dictType 字典类型
   * @param sourceValue 字典值
   */
  getDictItem(dictType: DICT_TYPE, sourceValue: number | string) {
    const dictData = this.dictMap[dictType];
    return dictData?.filter(({ value }) => `${value}` === `${sourceValue}`)[0];
  }
}

export enum DICT_TYPE {
  USER = 'user_type',
  DEPT = 'dept_type',
  COMMON_STATUS = 'common_status',
  SYSTEM_TENANT_PACKAGE_ID = 'system_tenant_package_id',

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_OPERATE_TYPE = 'system_operate_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_ERROR_CODE_TYPE = 'system_error_code_type',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_REDIS_TIMEOUT_TYPE = 'infra_redis_timeout_type',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',

  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY = 'bpm_model_category',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_ASSIGN_RULE_TYPE = 'bpm_task_assign_rule_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_INSTANCE_RESULT = 'bpm_process_instance_result',
  BPM_TASK_ASSIGN_SCRIPT = 'bpm_task_assign_script',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',

  // ========== PAY 模块 ==========
  PAY_CHANNEL_WECHAT_VERSION = 'pay_channel_wechat_version', // 微信渠道版本
  PAY_CHANNEL_ALIPAY_SIGN_TYPE = 'pay_channel_alipay_sign_type', // 支付渠道支付宝算法类型
  PAY_CHANNEL_ALIPAY_MODE = 'pay_channel_alipay_mode', // 支付宝公钥类型
  PAY_CHANNEL_ALIPAY_SERVER_TYPE = 'pay_channel_alipay_server_type', // 支付宝网关地址
  PAY_CHANNEL_CODE_TYPE = 'pay_channel_code_type', // 支付渠道编码类型
  PAY_ORDER_NOTIFY_STATUS = 'pay_order_notify_status', // 商户支付订单回调状态
  PAY_ORDER_STATUS = 'pay_order_status', // 商户支付订单状态
  PAY_ORDER_REFUND_STATUS = 'pay_order_refund_status', // 商户支付订单退款状态
  PAY_REFUND_ORDER_STATUS = 'pay_refund_order_status', // 退款订单状态
  PAY_REFUND_ORDER_TYPE = 'pay_refund_order_type', // 退款订单类别
}
