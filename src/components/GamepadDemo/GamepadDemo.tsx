import React from 'react';
import { notification, Drawer } from 'antd';
// import GamepadController from '../../lib/gamepad';

import './index.scss';
import GamepadUiController from '../../lib/gamepad-ui-controller';
import GamepadController from '../../lib/gamepad';
import GamepadWsController from '../../lib/gamepad-ws-controller';

interface GamepadDemoState {
  gamepads: (Gamepad | null)[];
  slideImgs: string[];
  currentIndex: number;
  currentTabIndex: number;
  showMask: boolean;
  rangeEl?: HTMLElement;
  mode: 'ui' | 'ws';
  visible: boolean;
}

export default class GamepadDemo extends React.Component<{}, GamepadDemoState> {
  public state: GamepadDemoState = {
    gamepads: [],
    slideImgs: [
      'http://image.mhxk.com/mh/106736_2_1.jpg-800x400.webp',
      'http://image.mhxk.com/mh/106462_2_1.jpg-800x400.webp',
      'http://image.mhxk.com/mh/107123_2_1.jpg-800x400.webp',
      'http://image.mhxk.com/mh/91961_2_1.jpg-800x400.webp',
    ],
    currentIndex: 0,
    currentTabIndex: 0,
    showMask: false,
    rangeEl: undefined,
    mode: 'ui',
    visible: false,
  };

  public prevFocusEl: HTMLElement | undefined;

  public upperEl: HTMLElement | undefined;

  public activedEl: HTMLElement | undefined;

  // public gamepadController: GamepadController | undefined;

  // eslint-disable-next-line
  public componentDidMount(): void {
    GamepadUiController.getInstance({
      activedElClassName: 'customSelected',
      maskElClassName: 'mask-wrapper',
      maskCancelElClassName: 'mask-cancel',
      gamepadconnected: (gamepad?: Gamepad) => {
        notification.success({
          message: '检测到一个手柄连接成功',
          description: gamepad && `${gamepad.index} - ${gamepad.id}`,
        });
      },
      gamepaddisconnected: (gamepad?: Gamepad) => {
        notification.warning({
          message: '检测到一个手柄断开连接',
          description: gamepad && `${gamepad.index} - ${gamepad.id}`,
        });
      },
    }).init();
    GamepadWsController.getInstance({
      wsUrl: 'wss://www.koceba.com/host/hid/gamepad/xinput',
      operateDrawer: () => {
        if (this.state.visible) {
          this.onClose();
        } else {
          this.showDrawer();
        }
      },
    }).init();
    // this.gamepadController = new GamepadController({
    //   wsUrl: 'wss://www.koceba.com/host/hid/gamepad/xinput',
    //   activedElClassName: 'customSelected',
    //   maskElClassName: 'mask-wrapper',
    //   maskCancelElClassName: 'mask-cancel',
    //   gamepadconnected: (gamepad?: Gamepad) => {
    //     notification.success({
    //       message: '检测到一个手柄连接成功',
    //       description: gamepad && `${gamepad.index} - ${gamepad.id}`,
    //     });
    //   },
    //   gamepaddisconnected: (gamepad?: Gamepad) => {
    //     notification.warning({
    //       message: '检测到一个手柄断开连接',
    //       description: gamepad && `${gamepad.index} - ${gamepad.id}`,
    //     });
    //   },
    // });
    // this.gamepadController.init();
  }
  // eslint-enable-next-line

  public pressBuy = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.focusSelected(e);
    const upperEl = e.nativeEvent.target as HTMLElement;
    this.setState(
      {
        showMask: true,
      },
      () => {
        upperEl.classList.remove('customSelected');
        // 记录上一层被点击的元素
        this.upperEl = upperEl;
        // 设置下一层级中的手柄 move 的根节点
        this.setState({
          rangeEl: document.querySelector('.mask-wrapper') as HTMLElement,
        });
      },
    );
  };

  public pressCheckMode = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.focusSelected(e);
    this.switchMode();
  };

  public switchMode = () => {
    if (GamepadController.getInstance()) {
      GamepadController.getInstance().switchMode();
      this.setState({
        mode: this.state.mode === 'ui' ? 'ws' : 'ui',
      });
    }
  };

  public cancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showMask: false,
    });
    this.selectMoveLevel(e);
  };

  public confirm = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showMask: false,
    });
    this.selectMoveLevel(e);
  };

  // 选择手柄操作的层级
  public selectMoveLevel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.nativeEvent.target as HTMLElement;
    if (this.upperEl) {
      target.classList.remove('customSelected');
      this.upperEl.classList.add('customSelected');
      this.setState({
        rangeEl: undefined,
      });
      this.upperEl = undefined;
    }
  };

  public selectSlideImg = (
    index: number,
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (e) {
      this.focusSelected(e);
    }
    this.setState({
      currentIndex: index,
    });
  };

  public selectTab = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number,
  ) => {
    if (this.activedEl) {
      this.activedEl.classList.remove('actived');
    }
    const target = e.nativeEvent.target as HTMLElement;
    this.activedEl = target;
    target.classList.add('actived');

    console.log(this.activedEl);
    this.focusSelected(e);
    this.setState({
      currentTabIndex: index,
    });
  };

  public focusSelected = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.nativeEvent.target as HTMLElement;
    const el = document.querySelector('.customSelected') as HTMLElement;

    if (target && el) {
      if (!target.classList.contains('customSelected')) {
        el.classList.remove('customSelected');
        target.classList.add('customSelected');
      }
    }
  };

  public getCurrentTab = (): JSX.Element => {
    if (this.state.currentTabIndex === 0) {
      return <div className="game-tab-content">Tab1的内容</div>;
    }
    if (this.state.currentTabIndex === 1) {
      return <div className="game-tab-content">Tab2的内容</div>;
    }
    return <div className="game-tab-content">Tab3的内容</div>;
  };

  public showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.switchMode();
  };

  public onClose = () => {
    this.setState({
      visible: false,
    });
    this.switchMode();
  };

  public render(): JSX.Element {
    return (
      <div className="gamepad-list">
        <div className="group-btn-list">
          <div className="group-btn group-btn-column">
            <div className="title-img">
              <img
                src="http://image.mhxk.com/cms/dengting/89eedee0-7dfa-11e9-a063-03acf1e92b75.png-noresize.webp"
                alt="标题图片"
              />
            </div>
            <div
              className="buy-btn customSelected"
              data-can-click="yes"
              onClick={(e) => this.pressBuy(e)}
            >
              购买
            </div>
            <div
              className="check-btn"
              data-can-click="yes"
              onClick={(e) => this.pressCheckMode(e)}
            >
              切换模式
            </div>
            <div className="current-mode">当前控制模式：{this.state.mode}</div>
          </div>
          <div className="group-btn-row">
            <div className="game-slide-img">
              <img
                src={this.state.slideImgs[this.state.currentIndex]}
                alt="xxx"
              />
            </div>
            <div className="slide-img-list">
              {this.state.slideImgs.map((item, index) => {
                return (
                  <img
                    key={item}
                    src={item}
                    alt="xxx"
                    data-can-click="yes"
                    data-auto-focus
                    tabIndex={1}
                    onClick={(e) => this.selectSlideImg(index, e)}
                    onFocus={() => this.selectSlideImg(index)}
                  />
                );
              })}
            </div>
            <div className="game-intro">游戏内容介绍</div>
            <div className="game-tab-list">
              <div
                className="game-tab"
                data-can-click="yes"
                onClick={(e) => this.selectTab(e, 0)}
              >
                tab1
              </div>
              <div
                className="game-tab"
                data-can-click="yes"
                onClick={(e) => this.selectTab(e, 1)}
              >
                tab2
              </div>
              <div
                className="game-tab"
                data-can-click="yes"
                onClick={(e) => this.selectTab(e, 2)}
              >
                tab3
              </div>
            </div>
            {this.getCurrentTab()}
          </div>
          {this.state.showMask && (
            <div className="mask-wrapper">
              <div className="mask-wrapper-content">
                <div className="mask-content">内容区域</div>
                <div className="mask-operate">
                  <div
                    className="operate-btn mask-cancel"
                    data-can-click
                    onClick={(e) => this.cancel(e)}
                  >
                    取消
                  </div>
                  <div
                    className="operate-btn mask-confirm customSelected"
                    data-can-click
                    onClick={(e) => this.confirm(e)}
                  >
                    确定
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Drawer
          title="Basic Drawer"
          className="mask-wrapper"
          placement="right"
          closable={false}
          destroyOnClose
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <div
            className="drawer-operate customSelected"
            data-can-click="yes"
            onClick={(e) => {}}
          >
            操作1
          </div>
          <div
            className="drawer-operate"
            data-can-click="yes"
            onClick={(e) => {}}
          >
            操作2
          </div>
          <div
            className="drawer-operate mask-cancel"
            data-can-click="yes"
            onClick={this.onClose}
          >
            取消
          </div>
        </Drawer>
        {this.props.children}
      </div>
    );
  }
}
