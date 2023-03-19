export interface CaptchaRequest {
  captchaType: string;
  ts: number;
  token: string;
  pointJson: string;
  clientUid: string;
}

export interface CaptchaResult {
  repCode: string;
  repMsg: string;
  repData: any;
}

export type CaptchaProps = {
  isShow: boolean;
  finishText?: string;
  showRefresh?: boolean;
  // blockPuzzle: '滑动拼图', clickWord: 文字点选
  captchaType?: 'blockPuzzle' | 'clickWord';
  transitionLeft?: string;
  transitionWidth?: string;
  verifyCaptcha: (isShow: boolean, captcha: string | undefined) => void;
};
