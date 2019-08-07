import React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';

import { StoreState } from 'store';
import { CountAction } from 'store/reducers/count';

export default (): JSX.Element => {
  const count = useSelector((state: StoreState) => state.count);
  const dispatch = useDispatch<Dispatch<CountAction>>();

  return (
    <div>
      <p>二级导航栏3 的主要内容</p>
      <p>redux 中的 count: {count}</p>
      <Button
        type="primary"
        onClick={() => dispatch({ type: 'COUNT', num: 1 })}
      >
        点击
      </Button>
    </div>
  );
};
