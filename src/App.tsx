import { hot } from 'react-hot-loader/root';
import React, { Suspense, lazy } from 'react';
import {
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
  RouteProps,
} from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';

import './App.css';

const Home = lazy(() =>
  import(/* webpackChunkName: 'home' */ './pages/Home/Home'),
);
const SubNav1 = lazy(() =>
  import(/* webpackChunkName: 'subnav1' */ './pages/SubNav1/SubNav1'),
);
const SubNav3 = lazy(() =>
  import(/* webpackChunkName: 'subnav3' */ './pages/SubNav3/SubNav3'),
);

const { Header, Content, Footer } = Layout;

const App: React.FC = (props: RouteProps) => {
  console.log(props);
  return (
    <Layout
      className="layout"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Header style={{ background: '#fff' }}>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[props.location!.pathname!]}
          defaultSelectedKeys={[props.location!.pathname!]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/sub_nav_1">
            <Link to="/sub_nav_1">二级导航栏 1</Link>
          </Menu.Item>
          <Menu.Item key="/sub_nav_2">
            <Link to="/sub_nav_2">二级导航栏 2</Link>
          </Menu.Item>
          <Menu.Item key="/sub_nav_3">
            <Link to="/sub_nav_3">二级导航栏 3</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', flex: 1, background: '#eee' }}>
        <Suspense
          fallback={
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate3d(-50%, -50%, 0)',
              }}
            >
              <Spin size="large" />
            </div>
          }
        >
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/sub_nav_2" />} />
            <Route path="/sub_nav_1" component={SubNav1} />
            <Route path="/sub_nav_2" component={Home} />
            <Route path="/sub_nav_3" component={SubNav3} />
          </Switch>
        </Suspense>
      </Content>
      <Footer
        style={{ textAlign: 'center', background: '#001529', color: '#fff' }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default hot(withRouter(App));
