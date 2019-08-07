import React from 'react';
import { Button } from 'antd';
// import ClassNames from 'classnames';
// import GamepadItem from './GamepadItem';

import './index.scss';
import parentsUntil from '../../utils/utils';

interface GamepadListState {
  gamepads: (Gamepad | null)[];
}

interface GamepadInfo {
  A?: number;
  B?: number;
  X?: number;
  Y?: number;
  L1?: number;
  R1?: number;
  L2?: number;
  R2?: number;
  Select?: number;
  Start?: number;
  LeftThumb?: number;
  RightThumb?: number;
  Up?: number;
  Down?: number;
  Left?: number;
  Right?: number;
}

interface Candidate {
  el: Element;
  x: number;
  y: number;
  distance: number;
  index: number;
}

export default class GamepadList extends React.Component<{}, GamepadListState> {
  public state = { gamepads: [] };

  public gamepadInfo: GamepadInfo = {};

  public offset = {
    x: 0,
    y: 0,
  };

  public componentDidMount(): void {
    this.tick();
  }

  public tick = () => {
    const gamepads = this.pollGamepads();
    this.setState({ gamepads });
    window.requestAnimationFrame(() => {
      this.operateGamepad(gamepads);
      this.tick();
    });
  };

  public pollGamepads = () => {
    return navigator.getGamepads();
  };

  public operateGamepad = (gamepads: (Gamepad | null)[]): void => {
    let gamepad: Gamepad | null = null;
    if (gamepads.length !== 0) {
      Object.keys(gamepads).forEach((key) => {
        const newKey = +key;
        if (gamepads[newKey]) {
          gamepad = gamepads[newKey];
        }
      });
    }

    if (!gamepad) {
      return;
    }

    const { buttons } = gamepad as Gamepad;
    // buttons.forEach((item, index) => {
    //   if (item.pressed) {
    //     console.log(index);
    //   }
    // });
    const buttonA = buttons[0];
    const buttonB = buttons[1];
    const buttonX = buttons[2];
    const buttonY = buttons[3];
    const buttonL1 = buttons[4];
    const buttonR1 = buttons[5];
    const buttonL2 = buttons[6];
    const buttonR2 = buttons[7];
    const buttonSelect = buttons[8];
    const buttonStart = buttons[9];
    const buttonLeftThumb = buttons[10];
    const buttonRightThumb = buttons[11];
    const buttonUp = buttons[12];
    const buttonDown = buttons[13];
    const buttonLeft = buttons[14];
    const buttonRight = buttons[15];

    this.gamepadButtonPress(buttonA, 'A', () => {
      (document.querySelector('.customSelected') as HTMLElement).click();
    });
    this.gamepadButtonPress(buttonB, 'B');
    this.gamepadButtonPress(buttonX, 'X');
    this.gamepadButtonPress(buttonY, 'Y');
    this.gamepadButtonPress(buttonL1, 'L1');
    this.gamepadButtonPress(buttonR1, 'R1');
    this.gamepadButtonPress(buttonL2, 'L2');
    this.gamepadButtonPress(buttonR2, 'R2');
    this.gamepadButtonPress(buttonSelect, 'Select');
    this.gamepadButtonPress(buttonStart, 'Start');
    this.gamepadButtonPress(buttonLeftThumb, 'LeftThumb');
    this.gamepadButtonPress(buttonRightThumb, 'RightThumb');

    this.gamepadButtonPress(buttonUp, 'Up', () => {
      this.moveButton('Up');
    });

    this.gamepadButtonPress(buttonDown, 'Down', () => {
      this.moveButton('Down');
    });

    this.gamepadButtonPress(buttonLeft, 'Left', () => {
      this.moveButton('Left');
    });

    this.gamepadButtonPress(buttonRight, 'Right', () => {
      this.moveButton('Right');
    });
  };

  public moveButton = (key: 'Up' | 'Down' | 'Left' | 'Right') => {
    const els = document.querySelectorAll(`[data-can-click='yes']`);
    const focusedEl = document.querySelector('.customSelected') as HTMLElement;
    // const focusedParentNode = parentsUntil(focusedEl, 'group-btn')[0];
    const parentList = parentsUntil(focusedEl, 'parent');
    console.log(parentList, 'parentList');
    // const focusedParentNode = parentList[parentList.length - 1];
    const focusedParentNode = parentsUntil(focusedEl, 'parent')[0];
    const focusedParentNodeRect = focusedParentNode.getBoundingClientRect();
    const focusedParentNodeLeft = focusedParentNodeRect.left;
    const focusedParentNodeRight = focusedParentNodeRect.right;
    const focusedParentNodeTop = focusedParentNodeRect.top;
    const focusedParentNodeBottom = focusedParentNodeRect.bottom;
    console.log(focusedParentNode);
    const focusedRect = focusedEl.getBoundingClientRect();
    const focuseElX = focusedRect.left + focusedRect.width / 2;
    const focuseElY = focusedRect.top + focusedRect.height / 2;
    const focuseElLeft = focusedRect.left;
    const focuseElRight = focusedRect.right;
    const focuseElTop = focusedRect.top;
    const focuseElBottom = focusedRect.bottom;
    const candidates: Candidate[] = [];
    let sortKey: 'x' | 'y' = 'y';

    els.forEach((el) => {
      const elParentNode = parentsUntil(el, 'parent')[0];
      const elParentNodeRect = elParentNode.getBoundingClientRect();
      const elParentNodeLeft = elParentNodeRect.left;
      const elParentNodeRight = elParentNodeRect.right;
      const elParentNodeTop = elParentNodeRect.top;
      const elParentNodeBottom = elParentNodeRect.bottom;

      const elRect = el.getBoundingClientRect();
      const elX = elRect.left + elRect.width / 2;
      const elY = elRect.top + elRect.height / 2;
      const elLeft = elRect.left;
      const elRight = elRect.right;
      const elTop = elRect.top;
      const elBottom = elRect.bottom;
      let elDiffX = 0;
      let elDiffY = 0;
      // const elDiffX = Math.abs(elX - focuseElX);
      // const elDiffY = Math.abs(elY - focuseElY);
      const elDisX = Math.abs(elX - focuseElX);
      const elDisY = Math.abs(elY - focuseElY);
      let flag = false;
      let index = 0;

      if (key === 'Up') {
        flag =
          elBottom < focuseElTop &&
          elRight > focuseElLeft &&
          elLeft < focuseElRight &&
          focusedParentNode === elParentNode;
        if (!flag) {
          flag =
            elBottom < focusedParentNodeTop &&
            elParentNodeRight > focusedParentNodeLeft &&
            elParentNodeLeft < focusedParentNodeRight;
          // flag =
          //   elBottom < focusedParentNodeTop &&
          //   elRight > focusedParentNodeLeft &&
          //   elLeft < focusedParentNodeRight;
          if (!flag) {
            flag = elBottom < focusedParentNodeTop;
            if (flag) {
              index = 3;
            }
          } else {
            index = 2;
          }
        } else {
          index = 1;
        }
        // flag =
        //   elY < focuseElY && elRight > focuseElLeft && elLeft < focuseElRight;
        // if (!flag) {
        //   flag =
        //     elY < focusedParentNodeTop &&
        //     elRight > focusedParentNodeLeft &&
        //     elLeft < focusedParentNodeRight;
        // }
        sortKey = 'y';
      }

      if (key === 'Down') {
        // console.log(focusedParentNode === elParentNode);
        flag =
          elTop > focuseElBottom &&
          elRight > focuseElLeft &&
          elLeft < focuseElRight &&
          focusedParentNode === elParentNode;
        if (!flag) {
          flag =
            elTop > focusedParentNodeBottom &&
            elParentNodeRight > focusedParentNodeLeft &&
            elParentNodeLeft < focusedParentNodeRight;
          // console.log(elParentNode, elParentNodeRight, focusedParentNodeLeft);
          // flag =
          //   elTop > focusedParentNodeBottom &&
          //   elRight > focusedParentNodeLeft &&
          //   elLeft < focusedParentNodeRight;
          if (!flag) {
            flag =
              elTop > focusedParentNodeBottom &&
              elRight > focusedParentNodeLeft;
            if (flag) {
              index = 3;
            }
          } else {
            index = 2;
          }
        } else {
          index = 1;
        }
        // flag =
        //   elY > focuseElY && elRight > focuseElLeft && elLeft < focuseElRight;
        // if (!flag) {
        //   flag =
        //     elY > focusedParentNodeBottom &&
        //     elRight > focusedParentNodeLeft &&
        //     elLeft < focusedParentNodeRight;
        // }
        sortKey = 'y';
      }

      if (key === 'Left') {
        flag =
          elRight < focuseElLeft &&
          elTop < focuseElBottom &&
          elBottom > focuseElTop &&
          focusedParentNode === elParentNode;
        if (!flag) {
          flag =
            elRight < focusedParentNodeLeft &&
            elParentNodeTop < focusedParentNodeBottom &&
            elParentNodeBottom > focusedParentNodeTop;
          // flag =
          //   elRight < focusedParentNodeLeft &&
          //   elTop < focusedParentNodeBottom &&
          //   elBottom > focusedParentNodeTop;
          if (!flag) {
            flag = elRight < focusedParentNodeLeft;
            if (flag) {
              index = 3;
            }
          } else {
            index = 2;
          }
        } else {
          index = 1;
        }
        // flag =
        //   elX < focuseElX && elTop < focuseElBottom && elBottom > focuseElTop;
        // if (!flag) {
        //   flag =
        //     elX < focusedParentNodeLeft &&
        //     elTop < focusedParentNodeBottom &&
        //     elBottom > focusedParentNodeTop;
        // }
        sortKey = 'x';
      }

      if (key === 'Right') {
        // flag = elX > focuseElX;

        flag =
          elLeft > focuseElRight &&
          elTop < focuseElBottom &&
          elBottom > focuseElTop &&
          focusedParentNode === elParentNode;
        if (!flag) {
          flag =
            elLeft > focusedParentNodeRight &&
            elParentNodeTop < focusedParentNodeBottom &&
            elParentNodeBottom > focusedParentNodeTop;
          // flag =
          //   elLeft > focusedParentNodeRight &&
          //   elTop < focusedParentNodeBottom &&
          //   elBottom > focusedParentNodeTop;
          if (!flag) {
            flag =
              elLeft > focusedParentNodeRight &&
              elTop < focusedParentNodeBottom;
            if (flag) {
              index = 3;
            }
          } else {
            index = 2;
          }
        } else {
          index = 1;
        }
        // flag =
        //   elX > focuseElX && elTop < focuseElBottom && elBottom > focuseElTop;
        // if (!flag) {
        //   flag =
        //     elX > focusedParentNodeRight &&
        //     elTop < focusedParentNodeBottom &&
        //     elBottom > focusedParentNodeTop;
        // }
        sortKey = 'x';
        // console.log(flag);
      }

      if (flag) {
        let distance = 0;
        if (key === 'Up') {
          elDiffY = Math.abs(focuseElTop - elBottom);
          elDiffX = Math.abs(focuseElLeft - elLeft);
          distance = Math.abs(focuseElTop - elBottom);
        }
        if (key === 'Down') {
          elDiffY = Math.abs(focuseElBottom - elTop);
          elDiffX = Math.abs(focuseElLeft - elLeft);
          distance = Math.abs(focuseElBottom - elTop);
        }
        if (key === 'Left') {
          elDiffX = Math.abs(focuseElLeft - elRight);
          elDiffY = Math.abs(focuseElTop - elTop);
          distance = Math.abs(focuseElLeft - elRight);
        }
        if (key === 'Right') {
          elDiffX = Math.abs(focuseElRight - elLeft);
          elDiffY = Math.abs(focuseElTop - elTop);
          distance = Math.abs(focuseElRight - elLeft);
        }
        candidates.push({
          el,
          x: elDiffX,
          y: elDiffY,
          // distance,
          distance: Math.sqrt(elDisX * elDisX + elDisY * elDisY),
          index,
        });
      }
    });

    if (candidates.length === 0) {
      return;
    }

    candidates.sort((a, b) => {
      return a[sortKey] - b[sortKey];
    });

    const candidatesArray1: Candidate[] = [];
    const candidatesArray2: Candidate[] = [];
    const candidatesArray3: Candidate[] = [];

    let nextEl: Element | undefined;

    candidates.forEach((item) => {
      if (item.index === 1) {
        candidatesArray1.push(item);
        candidatesArray1.sort((a, b) => {
          return a[sortKey] - b[sortKey];
        });
      } else if (item.index === 2) {
        candidatesArray2.push(item);
        candidatesArray1.sort((a, b) => {
          return a[sortKey] - b[sortKey];
        });
      } else {
        candidatesArray3.push(item);
        candidatesArray1.sort((a, b) => {
          return a[sortKey] - b[sortKey];
        });
      }
    });

    console.log(candidatesArray1);
    console.log(candidatesArray2);
    console.log(candidatesArray3);
    console.log(candidates);

    if (candidatesArray3.length !== 0) {
      // nextEl = candidatesArray3[0].el;
      nextEl = this.getNext(candidatesArray3, sortKey);
    }
    if (candidatesArray2.length !== 0) {
      nextEl = this.getNext(candidatesArray2, sortKey);
      // nextEl = candidatesArray2[0].el;
    }
    if (candidatesArray1.length !== 0) {
      // nextEl = candidatesArray1[0].el;
      nextEl = this.getNext(candidatesArray1, sortKey);
    }

    if (focusedEl && nextEl) {
      focusedEl.classList.remove('customSelected');
      nextEl.classList.add('customSelected');
    }
  };

  public getNext = (list: Candidate[], sortKey: 'x' | 'y'): Element => {
    const nextCandidates: Candidate[] = [];
    list.forEach((item) => {
      if (item[sortKey] === list[0][sortKey]) {
        nextCandidates.push(item);
      }
    });
    nextCandidates.sort((a, b) => {
      if (sortKey === 'x') {
        return a.y - b.y;
      }
      return a.x - b.x;
    });

    return nextCandidates[0].el;
  };

  public gamepadButtonPress = (
    gamepadButton: GamepadButton,
    key: keyof GamepadInfo,
    callback?: () => void,
  ) => {
    if (gamepadButton.pressed || gamepadButton.touched) {
      if (this.gamepadInfo[key] === 1) {
        return;
      }
      this.gamepadInfo[key] = 1;
      console.log(`按下了 ${key} 按钮`);
      callback && callback();
    } else {
      this.gamepadInfo[key] = 0;
    }
  };

  public pressA = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.focusSelected(e);
  };

  public focusSelected = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.nativeEvent.target as HTMLElement;
    const el = document.querySelector('.customSelected') as HTMLElement;

    if (target && el) {
      const { offset } = target.dataset;
      if (offset) {
        const xyArr = offset.split(',');
        const x = +xyArr[0];
        const y = +xyArr[1];
        this.offset.x = x;
        this.offset.y = y;
      }

      if (!target.classList.contains('customSelected')) {
        el.classList.remove('customSelected');
        target.classList.add('customSelected');
      }
    }
  };

  public render(): JSX.Element {
    const gamepadArr: (Gamepad | null)[] = [].slice.call(this.state.gamepads);
    // console.log(gamepadArr);
    return (
      <div className="gamepad-list">
        {gamepadArr.length === 0 ? (
          <p>没有检测到任何设备</p>
        ) : (
          gamepadArr.map((g, i) => {
            if (g) {
              return <div key={i}>{g.id}</div>;
            }
            return <div key={i}>N/A</div>;
          })
        )}
        <div className="container">
          <div className="parent row-no-wrap top">
            <button data-can-click="yes" className="child tab">
              Tab1
            </button>
            <button data-can-click="yes" className="child tab">
              Tab2
            </button>
            <button data-can-click="yes" className="child tab">
              Tab3
            </button>
            <button data-can-click="yes" className="child tab">
              Tab4
            </button>
            <button data-can-click="yes" className="child tab">
              Tab5
            </button>
            <button data-can-click="yes" className="child tab">
              Tab6
            </button>
          </div>
          <div className="row-no-wrap">
            <div className="col item-box">
              <button
                data-can-click="yes"
                className="child item customSelected"
              >
                Item1
              </button>
              <button data-can-click="yes" className="child item">
                Item2
              </button>
              <button data-can-click="yes" className="child item">
                Item3
              </button>
              <button data-can-click="yes" className="child item">
                Item4
              </button>
              <button data-can-click="yes" className="child item">
                Item5
              </button>
              <button data-can-click="yes" className="child item">
                Item6
              </button>
              <button data-can-click="yes" className="child item">
                Item7
              </button>
              <button data-can-click="yes" className="child item">
                Item8
              </button>
              <button data-can-click="yes" className="child item">
                Item1
              </button>
              <button data-can-click="yes" className="child item">
                Item2
              </button>
              <button data-can-click="yes" className="child item">
                Item3
              </button>
              <button data-can-click="yes" className="child item">
                Item4
              </button>
              <button data-can-click="yes" className="child item">
                Item5
              </button>
              <button data-can-click="yes" className="child item">
                Item6
              </button>
              <button data-can-click="yes" className="child item">
                Item7
              </button>
              <button data-can-click="yes" className="child item">
                Item8
              </button>
            </div>
            <div className="pic-box">
              <div className="row-no-wrap">
                <div className="parent">
                  <div data-can-click="yes" className="child pic-1">
                    Item1: Img1
                  </div>
                </div>
                <div className="col pic-box-1">
                  <div>
                    <div>
                      <div data-can-click="yes" className="child pic-2">
                        Item1: Img2
                      </div>
                    </div>
                  </div>
                  <div data-can-click="yes" className="child pic-2">
                    Item1: Img3
                  </div>
                  <div data-can-click="yes" className="child pic-2">
                    Item1: Img4
                  </div>
                </div>
                <div className="row-wrap pic-box-2">
                  <div data-can-click="yes" className="child pic-3">
                    Item1: Img5
                  </div>
                  <div data-can-click="yes" className="child pic-3">
                    Item1: Img6
                  </div>
                  <div data-can-click="yes" className="child pic-3">
                    Item1: Img7
                  </div>
                  <div data-can-click="yes" className="child pic-3">
                    Item1: Img8
                  </div>
                </div>
              </div>
              <div className="parent row-no-wrap pic-box-3">
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img10
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img11
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img12
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img13
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img14
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img15
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img16
                </div>
                <div data-can-click="yes" className="child pic-4">
                  Item1: Img17
                </div>
              </div>
              <div className="parent row-no-wrap pic-box-3">
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img18
                </div>
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img19
                </div>
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img20
                </div>
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img21
                </div>
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img22
                </div>
                <div data-can-click="yes" className="child pic-5">
                  Item1: Img23
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="group-btn-list">
          <div className="group-btn group-btn-column">
            <Button
              className="test-btn"
              data-offset="0,0"
              data-can-click="yes"
              type="primary"
              onClick={this.pressA}
            >
              按钮1
            </Button>
            <Button
              className="test-btn"
              data-offset="0,0"
              data-can-click="yes"
              type="primary"
              onClick={this.pressA}
            >
              按钮2
            </Button>
            <Button
              className="test-btn"
              data-offset="0,0"
              data-can-click="yes"
              type="primary"
              onClick={this.pressA}
            >
              按钮3
            </Button>
            <Button
              className="test-btn"
              data-offset="0,0"
              data-can-click="yes"
              type="primary"
              onClick={this.pressA}
            >
              按钮4
            </Button>
          </div>
          <div className="group-btn-row">
            <div className="group-btn group-btn-1">
              <Button
                className="test-btn customSelected"
                data-offset="0,0"
                data-can-click="yes"
                type="primary"
                onClick={this.pressA}
              >
                按钮A
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="1,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮B
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="2,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮C
              </Button>
            </div>
            <div className="group-btn group-btn-2">
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮D
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮E
              </Button>
            </div>
            <div className="group-btn group-btn-3">
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮F
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮G
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮H
              </Button>
            </div>
            <div className="group-btn group-btn-4">
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮I
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮J
              </Button>
              <Button
                className="test-btn"
                type="primary"
                data-offset="3,0"
                data-can-click="yes"
                onClick={this.pressA}
              >
                按钮K
              </Button>
            </div>
            <div className="group-btn group-btn-5">
              <div className="group-btn group-child">
                <Button
                  className="test-btn"
                  type="primary"
                  data-offset="3,0"
                  data-can-click="yes"
                  onClick={this.pressA}
                >
                  按钮L
                </Button>
                <Button
                  className="test-btn"
                  type="primary"
                  data-offset="3,0"
                  data-can-click="yes"
                  onClick={this.pressA}
                >
                  按钮M
                </Button>
              </div>
              <div className="group-btn group-child">
                <Button
                  className="test-btn"
                  type="primary"
                  data-offset="3,0"
                  data-can-click="yes"
                  onClick={this.pressA}
                >
                  按钮N
                </Button>
                <Button
                  className="test-btn"
                  type="primary"
                  data-offset="3,0"
                  data-can-click="yes"
                  onClick={this.pressA}
                >
                  按钮O
                </Button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
