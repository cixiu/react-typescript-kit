import React from 'react'
import { message } from 'antd'

import logo from '../../logo.svg'
import * as classes from './index.scss'

class Hello extends React.Component {
  componentDidMount() {
    message.success('成功！！')
  }

  render() {
    return (
      <div className={classes.text}>
        <img className={classes.logo} src={logo} alt="react logo" />
        <div>Hello React And Typescript</div>
      </div>
    )
  }
}

export default Hello
