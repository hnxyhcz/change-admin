import { checkCaptcha, pictureCaptcha } from '@/services/rms/login';
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group';
import { aesEncrypt } from './utils/ase';
import defaultImg from './assets/default.jpg'

import './index.less';

const defaultProps = {
  mode: 'fixed',
  vSpace: 5,
  imgSize: {
    width: '310px',
    height: '200px',
  },
  barSize: {
    width: '310px',
    height: '40px',
  },
  setSize: {
    imgHeight: '200px',
    imgWidth: '310px',
    barHeight: '40px',
    barWidth: '310px',
  },
  blockSize: {
    width: '50px',
    height: '50px'
  },
}

type CaptchaProps = {
  isShow: boolean;
  finishText?: string;
  showRefresh?: boolean;
  // blockPuzzle: '滑动拼图', clickWord: 文字点选
  captchaType?: 'blockPuzzle' | 'clickWord';
  transitionLeft?: string;
  transitionWidth?: string;
  verifyCaptcha: (isShow: boolean, captcha: string | undefined) => void;
}
const SlideCaptcha: React.FC<CaptchaProps> = (props) => {

  const { vSpace, blockSize, setSize, imgSize, barSize } = defaultProps
  const {
    isShow,
    finishText,
    captchaType = 'blockPuzzle',
    transitionLeft = '',
    transitionWidth = '',
    verifyCaptcha,
  } = props;

  // 验证码背景图片
  const [backImgBase, setBackImgBase] = useState<string>('');
  // 验证滑块的背景图片
  const [blockBackImgBase, setBlockBackImgBase] = useState<string>('');
  const [moveBlockBackgroundColor, setMoveBlockBackgroundColor] = useState<string>('rgb(255, 255, 255)');
  
  const [iconColor, setIconColor] = useState<string>('');
  const [iconClass, setIconClass] = useState<string>('');
  
  const [leftBarBorderColor, setLeftBarBorderColor] = useState<string>('');
  // 是否验证完成
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [passFlag, setPassFlag] = useState<boolean>(false);
  // 提示内容，提示词的背景颜色
  const [tipWords, setTipWords] = useState<string>('');
  const [text, setText] = useState<string>('向右滑动完成验证');

  // 鼠标状态
  const statusRef = useRef<boolean>(false)
  // 左侧开始位置
  const startLeftRef = useRef<number>(0)
  // 滑块位置
  const leftBarWidthRef = useRef<number>(0)
  const [leftBarWidth, setLeftBarWidth] = useState<number>(0)
  const [moveBlockLeft, setMoveBlockLeft] = useState<number>(0)

  const barAreaLeftRef = useRef<number>(0)
  const barAreaOffsetWidthRef = useRef<number>(0)

  // 后端返回的token值
  const backTokenRef = useRef<string>('')
  // 后端返回的加密秘钥
  const secretKeyRef = useRef<string>('')

  useEffect(() => {
    uuid();
    getData();
    initinal();
    // 卸载函数
    return destory
  }, [])

  // 初始化uuid, clientUid
  const uuid = () => {
    let s = [];
    const hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    s[19] = hexDigits.substring((Number(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    // 判断下是否存在 slider
    const slider = `slider-${s.join("")}`;
    if (!localStorage.getItem('slider')) {
      localStorage.setItem('slider', slider)
    }
  }

  const initinal = () => {
    window.addEventListener("touchmove", move);
    window.addEventListener("mousemove", move);
    // 鼠标松开
    window.addEventListener("touchend", end);
    window.addEventListener("mouseup", end);
  }

  const destory = () => {
    window.removeEventListener("touchmove", move);
    window.removeEventListener("mousemove", move);
    // 鼠标松开
    window.removeEventListener("touchend", end);
    window.removeEventListener("mouseup", end);
  }

  const getData = () => {
    pictureCaptcha({
      ts: Date.now(),
      captchaType: captchaType,
      clientUid: localStorage.getItem('slider'),
    }).then(resp => {
      const { code, data } = resp
      const { repCode, repData, repMsg } = data || {}
      if (code === 200 && repCode === '0000') {
        backTokenRef.current = repData.token
        secretKeyRef.current = repData.secretKey
        setBackImgBase(repData.originalImageBase64)
        setBlockBackImgBase(repData.jigsawImageBase64)
      }
      // 请求次数超限
      if (repCode == '6201') {
        setBackImgBase('')
        setBlockBackImgBase('')
        setLeftBarBorderColor('#d9534f')
        setIconColor('#fff')
        setIconClass('icon-close');
        setPassFlag(false)
        setTipWords(repMsg)
        setTimeout(() => {
          setTipWords('')
        }, 1000);
      }
    })
  }

  const start = (e: any) => {
    e = e || window.event;
    const x = e.touches ? e.touches[0].pageX : e.clientX;
    startLeftRef.current = Math.floor(x - barAreaLeftRef.current)
    if (isEnd == false) {
      setText('')
      statusRef.current = true
      setIconColor('#fff')
      setLeftBarBorderColor('#337AB7')
      setMoveBlockBackgroundColor('#337ab7')
      e.stopPropagation();
    }
  }

  const move = (e: any) => {
    e = e || window.event;
    if (statusRef.current && isEnd == false) {
      const x = e.touches ? e.touches[0].pageX : e.clientX;
      var bar_area_left = barAreaLeftRef.current;
      // 小方块相对于父元素的left值
      let move_block_left = x - bar_area_left;
      const blockWidth = parseInt(blockSize.width);
      const halfBlockWidth = parseInt(`${blockWidth / 2}`)
      const maxMoveWidth = barAreaOffsetWidthRef.current - halfBlockWidth - 2
      if (move_block_left >= maxMoveWidth) {
        move_block_left = maxMoveWidth;
      }
      if (move_block_left <= 0) {
        move_block_left = halfBlockWidth;
      }
      // 拖动后小方块的left值
      leftBarWidthRef.current = move_block_left - startLeftRef.current
      setLeftBarWidth(leftBarWidthRef.current)
      setMoveBlockLeft(leftBarWidthRef.current)
    }
  }

  const refresh = () => {
    getData()
    leftBarWidthRef.current = 0
    setLeftBarWidth(leftBarWidthRef.current)
    setMoveBlockLeft(leftBarWidthRef.current)
    setText('向右滑动完成验证')
    setMoveBlockBackgroundColor('#fff')
    setLeftBarBorderColor('#337AB7')
    setIconColor('#fff');
    setIsEnd(false);
    statusRef.current = false;
    // transitionLeft = 'left .3s'
    // transitionWidth = 'width .3s';
  }

  const end = () => {
    // 判断是否重合
    if (statusRef.current && isEnd == false) {
      const backToken = backTokenRef.current;
      const secretKey = secretKeyRef.current;
      const moveLeftDistance = parseInt(`${leftBarWidthRef.current}`) * 310 / parseInt(setSize.imgWidth);
      const pointJson = JSON.stringify({ x: moveLeftDistance, y: 5.0 })
      checkCaptcha({
        captchaType,
        ts: Date.now(),
        token: backToken,
        pointJson: secretKey ? aesEncrypt(pointJson, secretKey) : pointJson,
      }).then(resp => {
        const { code, data } = resp
        const { repCode, repMsg } = data || {}
        if (code === 200 && repCode === '0000') {
          setIsEnd(true)
          setPassFlag(true)
          setTipWords('验证成功')
          const captcha = `${backToken}---${pointJson}`
          captchaVerification(secretKey ? aesEncrypt(captcha, secretKey) : captcha)
        } else {
          setIsEnd(true);
          setPassFlag(false);
          setIconColor('#fff');
          setIconClass('icon-close');
          setLeftBarBorderColor('#d9534f');
          setMoveBlockBackgroundColor('#d9534f');
          setTipWords(repMsg || '验证失败')
        }
        setTimeout(() => {
          refresh();
          setTipWords('');
        }, 1000);
      })
      statusRef.current = false;
    }
  }

  const setBarArea = (event: any) => {
    let barAreaLeft = event && event.getBoundingClientRect().left
    let barAreaOffsetWidth = event && event.offsetWidth
    barAreaLeftRef.current = barAreaLeft
    barAreaOffsetWidthRef.current = barAreaOffsetWidth
  }

  const captchaVerification = (captcha?: string) => {
    verifyCaptcha(false, captcha)
  }

  return (
    // 蒙层
    <div className="mask" style={{ display: isShow ? 'block' : 'none' }}>
      <div className="verifybox" style={{ maxWidth: parseInt(imgSize.width) + 30 + 'px' }}>
        <div className='verifybox-top'>
          请完成安全验证
          <span className='verifybox-close' onClick={() => captchaVerification()}>
            <i className='iconfont icon-close'></i>
          </span>
        </div>
        <div className='verifybox-bottom' style={{ padding: '15px' }}>
          {/* 验证容器 */}
          <div style={{ position: 'relative' }} className='stop-user-select'>
            <div
              className='verify-img-out'
              style={{ height: parseInt(setSize.imgHeight) + vSpace }}
            >
              <div
                className='verify-img-panel'
                style={{ width: setSize.imgWidth, height: setSize.imgHeight }}
              >
                <img
                  alt=""
                  src={backImgBase ? `data:image/png;base64,${backImgBase}` : defaultImg}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
                <div
                  className='verify-refresh'
                  onClick={refresh}
                >
                  <i className='iconfont icon-refresh'></i>
                </div>
                <CSSTransition in={!!tipWords} timeout={150} classNames="tips" unmountOnExit>
                  <span className={`verify-tips ${passFlag ? 'suc-bg' : 'err-bg'}`}>
                    {tipWords}
                  </span>
                </CSSTransition>
              </div>
            </div>

            <div
              className='verify-bar-area'
              style={{ width: setSize.imgWidth, height: barSize.height, lineHeight: barSize.height }}
              ref={(bararea) => setBarArea(bararea)}
            >
              <span className='verify-msg'>{text}</span>
              <div
                className='verify-left-bar'
                style={{
                  width: `${leftBarWidth}px` || barSize.height,
                  height: barSize.height,
                  borderColor: leftBarBorderColor,
                  transition: transitionWidth,
                }}
              >
                <span className='verify-msg'>{finishText}</span>

                <div
                  onMouseDown={start}
                  onTouchStart={start}
                  className='verify-move-block'
                  style={{
                    width: barSize.height,
                    height: barSize.height,
                    backgroundColor: moveBlockBackgroundColor,
                    left: `${moveBlockLeft}px`,
                    transition: transitionLeft,
                  }}
                >
                  <i
                    className='verify-icon iconfont icon-right'
                    style={{ color: iconColor }}
                  ></i>
                  <div
                    className='verify-sub-block'
                    style={{
                      width: `${Math.floor((parseInt(setSize.imgWidth) * 47) / 310)}px`,
                      height: setSize.imgHeight,
                      top: `-${(parseInt(setSize.imgHeight) + vSpace)}px`,
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
      </div>
    </div>
  )
}

export default SlideCaptcha;