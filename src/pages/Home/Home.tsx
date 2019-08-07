import React, { useState, useEffect } from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';

import { StoreState } from 'store';
import { CountAction } from 'store/reducers/count';

// 自定义 Hook
const useFriendStatus = (status: boolean): null | boolean => {
  const [isOnline, setIsOnline] = useState<null | boolean>(null);
  useEffect(() => {
    let mounted = true;
    const handleStatusChange = (state: { isOnline: boolean }): void => {
      if (mounted) {
        setIsOnline(state.isOnline);
      }
    };

    setTimeout(() => {
      handleStatusChange({
        isOnline: status,
      });
    }, 1000);

    return () => {
      mounted = false;
    };
  }, [status]);

  return isOnline;
};

const FriendItem = (): JSX.Element => {
  const isOnline = useFriendStatus(false);
  console.log('ddddddd');

  return (
    <p>
      在线状态:{' '}
      {isOnline === null ? (
        <span>Loading...</span>
      ) : (
        <span
          style={{
            color: isOnline ? 'green' : 'red',
          }}
        >
          {isOnline ? '在线' : '离线'}
        </span>
      )}
    </p>
  );
};

const MemoizedFriendItem = React.memo(FriendItem);

export default (): JSX.Element => {
  const [count, setCount] = useState(0);
  const isOnline = useFriendStatus(true);
  const storeCount = useSelector((state: StoreState) => state.count);
  const dispatch = useDispatch<Dispatch<CountAction>>();

  // 相当于 componentDidMount 和 componentDidUpdate:
  // 默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候
  useEffect(() => {
    document.title = `点击的次数${count}`;
    // 副作用函数还可以通过返回一个函数来指定如何“清除”副作用。
    // 相当于在组件销毁时在此修改title
    return () => {
      document.title = `ddd`;
    };
  });

  return (
    <div style={{ padding: 24 }}>
      <p>首页</p>
      <p>组件内count点击的次数: {count}</p>
      <p>store中count点击次数: {storeCount}</p>
      <p>
        在线状态:{' '}
        {isOnline === null ? (
          <span>Loading...</span>
        ) : (
          <span
            style={{
              color: isOnline ? 'green' : 'red',
            }}
          >
            {isOnline ? '在线' : '离线'}
          </span>
        )}
      </p>
      <MemoizedFriendItem></MemoizedFriendItem>
      <p>
        <Button type="primary" onClick={() => setCount(count + 1)}>
          点击 组件
        </Button>
      </p>
      <p>
        <Button
          type="primary"
          onClick={() => dispatch({ type: 'COUNT', num: 1 })}
        >
          点击 store
        </Button>
      </p>
    </div>
  );
};
