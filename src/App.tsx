import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import Hello from '@components/Hello/Hello'

import * as classes from './App.scss'

const lazy = (React as any).lazy
const Suspense = (React as any).Suspense

const A = lazy(() => import(/* webpackChunkName: 'A' */ './pages/A/A'))
const B = lazy(() => import(/* webpackChunkName: 'B' */ './pages/B/B'))

const AsyncAComponent = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <A />
    </Suspense>
  )
}

const AsyncBComponent = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <B />
    </Suspense>
  )
}

@hot(module)
class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <Hello />

        <div className={classes.appRouter}>
          <Link to="/a" className={classes.routerLink}>A路由</Link>
          <Link to="/b" className={classes.routerLink}>B路由</Link>
        </div>

        <Switch>
          <Route path="/a" component={AsyncAComponent} />
          <Route path="/b" component={AsyncBComponent} />
        </Switch>
      </div>
    )
  }
}

export default App
