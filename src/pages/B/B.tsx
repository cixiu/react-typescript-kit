import * as React from 'react'
import { Button, Rate, Switch } from 'antd'

class B extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40,
        }}
      >
        <div>
          <Button type="primary">B组件中的按钮</Button>
        </div>
        <div>
          <Rate />
        </div>
        <div>
          <Switch />
        </div>
      </div>
    )
  }
}

export default B
