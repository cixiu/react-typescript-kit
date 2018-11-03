import * as React from 'react'
import { Button, Rate } from 'antd'

class A extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40
        }}
      >
        <div>
          <Button type="primary">A组件中的按钮</Button>
        </div>
        <div>
          <Rate />
        </div>
      </div>
    )
  }
}

export default A
