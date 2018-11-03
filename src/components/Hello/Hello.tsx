import React from 'react'
import { message } from 'antd'

import * as styles from './index.scss'

class Hello extends React.Component {
  componentDidMount() {
    message.success('成功！！')
  }

  render() {
    return (
      <div>
        <div className={styles.text}>Hello World!!</div>
      </div>
    )
  }
}

export default Hello
