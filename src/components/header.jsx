import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useHistory } from 'umi';
const { Header } = Layout;

const header = () => {

  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory()
  // const change = () => {
  //     setCollapsed(!collapsed)
  // }
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer">
              {roleName}{username}
            </a>
          ),
        },
        {
          key: '4',
          label: (
            <a onClick={() => {
              localStorage.setItem('token', '')
              history.push('/login')
            }}>
              退出登录
            </a>
          )
        },
      ]}
    />
  );
  return (
    // <CollapsedStoreProvider>
      <Header
        className="site-layout-background"
        style={{
          padding: '0 16px',
        }}
      >
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        {/* {
          collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
        } */}
        <div style={{ float: 'right' }}>
          <Dropdown overlay={menu}>
            <Space>
              欢迎回来
              <Avatar size={32} icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </div>
      </Header>
    // {/* </CollapsedStoreProvider> */}
  )
}

export default header;