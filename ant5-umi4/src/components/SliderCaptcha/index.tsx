import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { ReloadOutlined, RightOutlined } from '@ant-design/icons';
import { aesEncrypt } from './utils/ase';
import { sliderCaptchaGet, sliderCaptchaCheck } from './utils/api';

import defaultImg from './assets/default.jpg';
import { CaptchaProps } from './types';
import './style.less';

const defaultProps = {
  mode: 'fixed',
  vSpace: 5,
  imgSize: {
    width: '310px',
    height: '200px',
  },
  barSize: {
    width: '308px',
    height: '48px',
  },
  setSize: {
    imgHeight: '200px',
    imgWidth: '310px',
    barHeight: '40px',
    barWidth: '310px',
  },
  blockSize: {
    width: '48px',
    height: '48px',
  },
};

const SliderCaptcha: React.FC<CaptchaProps> = (props) => {
  const { vSpace, blockSize, setSize, imgSize, barSize } = defaultProps;
  const {
    isShow,
    captchaType = 'blockPuzzle',
    transitionLeft = '',
    transitionWidth = '',
    verifyCaptcha,
  } = props;

  // 验证码背景图片
  const [backImgBase, setBackImgBase] = useState<string>('');
  // 验证滑块的背景图片
  const [blockBackImgBase, setBlockBackImgBase] = useState<string>('');
  const [moveBlockBackgroundColor, setMoveBlockBackgroundColor] =
    useState<string>('#1890ff');

  // 是否验证完成
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [passFlag, setPassFlag] = useState<boolean>(false);
  // 提示内容，提示词的背景颜色
  const [tipWords, setTipWords] = useState<string>('');
  const [text, setText] = useState<string>('向右滑动完成验证');

  // 鼠标状态
  const statusRef = useRef<boolean>(false);
  // 左侧开始位置
  const startLeftRef = useRef<number>(0);
  // 滑块位置
  const leftBarWidthRef = useRef<number>(0);
  const [leftBarWidth, setLeftBarWidth] = useState<number>(0);
  const [moveBlockLeft, setMoveBlockLeft] = useState<number>(0);

  const defaultBarLeft = (document.body.clientWidth - 406) / 2;
  const barAreaLeftRef = useRef<number>(defaultBarLeft);
  const barAreaOffsetWidthRef = useRef<number>(312);

  // 后端返回的token值
  const backTokenRef = useRef<string>('');
  // 后端返回的加密秘钥
  const secretKeyRef = useRef<string>('');

  useEffect(() => {
    uuid();
    getData();
    initinal();
    // 卸载函数
    return destory;
  }, []);

  // 初始化uuid, clientUid
  const uuid = () => {
    let s = [];
    const hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = '4';
    s[19] = hexDigits.substring((Number(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    // 判断下是否存在 slider
    const slider = `slider-${s.join('')}`;
    if (!localStorage.getItem('slider')) {
      localStorage.setItem('slider', slider);
    }
  };

  const initinal = () => {
    window.addEventListener('touchmove', move);
    window.addEventListener('mousemove', move);
    // 鼠标松开
    window.addEventListener('touchend', end);
    window.addEventListener('mouseup', end);
  };

  const destory = () => {
    window.removeEventListener('touchmove', move);
    window.removeEventListener('mousemove', move);
    // 鼠标松开
    window.removeEventListener('touchend', end);
    window.removeEventListener('mouseup', end);
  };

  const getData = () => {
    sliderCaptchaGet({
      ts: Date.now(),
      captchaType: captchaType,
      clientUid: localStorage.getItem('slider'),
    }).then((resp) => {
      const { repCode, repData, repMsg = '' } = resp || {};
      if (repCode === '0000') {
        backTokenRef.current = repData.token;
        secretKeyRef.current = repData.secretKey;
        setBackImgBase(repData.originalImageBase64);
        setBlockBackImgBase(repData.jigsawImageBase64);
      }
      // 请求次数超限
      if (repCode == '6201') {
        setBackImgBase('');
        setBlockBackImgBase('');
        setPassFlag(false);
        setTipWords(repMsg);
        setTimeout(() => {
          setTipWords('');
        }, 1000);
      }
    });
  };

  const start = (e: any) => {
    e = e || window.event;
    const x = e.touches ? e.touches[0].pageX : e.clientX;
    startLeftRef.current = Math.floor(x - barAreaLeftRef.current);
    if (isEnd == false) {
      setText('');
      statusRef.current = true;
      setMoveBlockBackgroundColor('#1890ff');
      e.stopPropagation();
    }
  };

  const move = (e: any) => {
    e = e || window.event;
    if (statusRef.current && isEnd == false) {
      const x = e.touches ? e.touches[0].pageX : e.clientX;
      // 小方块相对于父元素的left值
      let moveBlockLeft = x - barAreaLeftRef.current;
      const blockWidth = parseInt(blockSize.width);
      const maxMoveWidth = barAreaOffsetWidthRef.current - blockWidth - 2;
      // 拖动后小方块的left值
      let moveLeft = 0;
      if (moveBlockLeft > startLeftRef.current) {
        moveLeft = moveBlockLeft - startLeftRef.current;
        if (moveLeft > maxMoveWidth) {
          moveLeft = maxMoveWidth;
        }
      }
      leftBarWidthRef.current = moveLeft;
      setLeftBarWidth(leftBarWidthRef.current);
      setMoveBlockLeft(leftBarWidthRef.current);
    }
  };

  const refresh = () => {
    getData();
    leftBarWidthRef.current = 0;
    setLeftBarWidth(leftBarWidthRef.current);
    setMoveBlockLeft(leftBarWidthRef.current);
    setText('向右滑动完成验证');
    setMoveBlockBackgroundColor('#1890ff');
    setIsEnd(false);
    statusRef.current = false;
  };

  const end = () => {
    // 判断是否重合
    if (statusRef.current && isEnd == false) {
      const backToken = backTokenRef.current;
      const secretKey = secretKeyRef.current;
      const moveLeftDistance =
        (parseInt(`${leftBarWidthRef.current}`) * 310) /
        parseInt(setSize.imgWidth);
      const pointJson = JSON.stringify({ x: moveLeftDistance, y: 5.0 });
      sliderCaptchaCheck({
        captchaType,
        ts: Date.now(),
        token: backToken,
        pointJson: secretKey ? aesEncrypt(pointJson, secretKey) : pointJson,
      }).then((resp) => {
        const { repCode, repMsg } = resp || {};
        if (repCode === '0000') {
          setIsEnd(true);
          setPassFlag(true);
          setTipWords('验证成功');
          const captcha = `${backToken}---${pointJson}`;
          captchaVerification(
            secretKey ? aesEncrypt(captcha, secretKey) : captcha,
          );
        } else {
          setIsEnd(true);
          setPassFlag(false);
          setMoveBlockBackgroundColor('#d9534f');
          setTipWords(repMsg || '验证失败');
        }
        setTimeout(() => {
          refresh();
          setTipWords('');
        }, 1000);
      });
      statusRef.current = false;
    }
  };

  const setBarArea = (event: any) => {
    let barAreaLeft = event && event.getBoundingClientRect().left;
    let barAreaOffsetWidth = event && event.offsetWidth;
    barAreaLeftRef.current = barAreaLeft;
    barAreaOffsetWidthRef.current = barAreaOffsetWidth;
  };

  const captchaVerification = (captcha?: string) => {
    verifyCaptcha(false, captcha);
  };

  return (
    <Modal
      title="请完成安全验证"
      open={isShow}
      footer={false}
      destroyOnClose
      keyboard={false}
      maskClosable={false}
      width={parseInt(imgSize.width) + 48}
      onCancel={() => captchaVerification()}
      getContainer={false}
    >
      <div className="verifybox">
        {/* 验证容器 */}
        <div style={{ position: 'relative' }} className="stop-user-select">
          <div
            className="verify-img-out"
            style={{ height: parseInt(setSize.imgHeight) + vSpace }}
          >
            <div
              className="verify-img-panel"
              style={{ width: setSize.imgWidth, height: setSize.imgHeight }}
            >
              <div
                onClick={refresh}
                style={{
                  height: 32,
                  width: 32,
                  lineHeight: '32px',
                  borderRadius: 32,
                  backgroundColor: 'rgb(0, 0, 0, 0.2)',
                  textAlign: 'center',
                  position: 'absolute',
                  top: 4,
                  right: 4,
                }}
              >
                <ReloadOutlined
                  style={{ color: '#fff', fontSize: '16px', fontWeight: 800 }}
                />
              </div>
              <img
                alt=""
                src={
                  backImgBase
                    ? `data:image/png;base64,${backImgBase}`
                    : defaultImg
                }
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
              {!!tipWords && (
                <div className="tips">
                  <span
                    className={`verify-tips ${passFlag ? 'suc-bg' : 'err-bg'}`}
                  >
                    {tipWords}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="verify-bar-area"
            style={{
              width: barSize.width,
              height: barSize.height,
              lineHeight: barSize.height,
            }}
            ref={(bararea) => setBarArea(bararea)}
          >
            <span className="verify-msg">{text}</span>
            <div
              className="verify-left-bar"
              style={{
                width: `${leftBarWidth}px` || barSize.height,
                height: barSize.height,
                transition: transitionWidth,
              }}
            >
              <div
                onMouseDown={start}
                onTouchStart={start}
                className="verify-move-block"
                style={{
                  width: blockSize.height,
                  height: blockSize.height,
                  backgroundColor: moveBlockBackgroundColor,
                  left: `${moveBlockLeft}px`,
                  transition: transitionLeft,
                }}
              >
                <RightOutlined style={{ color: '#fff' }} />
                <div
                  className="verify-sub-block"
                  style={{
                    width: `${Math.floor(
                      (parseInt(setSize.imgWidth) * 48) / 310,
                    )}px`,
                    height: setSize.imgHeight,
                    top: `-${parseInt(setSize.imgHeight) + vSpace}px`,
                    backgroundSize: `${setSize.imgWidth} ${setSize.imgHeight}`,
                  }}
                >
                  <img
                    alt=""
                    src={`data:image/png;base64,${blockBackImgBase}`}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SliderCaptcha;
