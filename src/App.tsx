import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Button } from 'antd';

import logo from './logo.svg';
import './App.css';
import style from './index.module.css';
import styleScss from './index.module.scss';

const App: React.FC = (): JSX.Element => (
  <div className="">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React!!!##GGTTGG
      </a>
      <p className={style.text}>css modules style样式</p>
      <p className={styleScss.text}>scss modules style样式22</p>
      <p className={styleScss.title}>scss modules style Title 样式22</p>
      <Button type="primary">这是一个antd的组件</Button>
    </header>
  </div>
);

export default hot(App);
