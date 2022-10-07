import {Table, Tag, Button, Space, Modal, Switch, Popover} from 'antd'
import { useState, useEffect } from 'react';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;

const list = () => {
    const [table, setTable] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/rights_children').then(
            res => {
                const list = res.data
                list.forEach(item => {
                  if(item.children.length === 0) {
                    item.children = ''
                  }
                })
                setTable(list)
            }
        )
    }, [])

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (id) => {
          return <b>{id}</b>
        }
      },
      {
        title: '权限名称',
        dataIndex: 'title',
      },
      {
        title: '权限路径',
        dataIndex: 'key',
        render: (key) => {
          return <Tag color="purple">{key}</Tag>
        }
      },
      {
        title: '开关',
        render: (item) => {
          return <div>
            <Space size='middle'>
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {deleteItem(item)}} />
              <Popover content={<div style={{textAlign: 'center'}}>
                <Switch checked={item.pagepermission} onChange={() => switchMethod(item)} />
              </div>} title="页面配置项" trigger={item.pagepermission === undefined? '': 'click'}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission === undefined} />
              </Popover>
            </Space> 
          </div>
        }
      }
    ];

    const switchMethod = (item) => {
      item.pagepermission = item.pagepermission === 1? 0: 1
      setTable([...table])
      if(item.grade === 1){
        axios.patch(`http://localhost:5000/rights/${item.id}`, {
          pagepermission: item.pagepermission
        })
      } else {
        axios.patch(`http://localhost:5000/children/${item.id}`, {
          pagepermission: item.pagepermission
    })
  }}
    const deleteItem = (item) => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: '确认删除吗',

        onOk() {
          deleteok(item);
        },

        onCancel() {
          console.log('Cancel');
        }
    })}

    const deleteok = (item) => {
      if(item.grade === 1) {
        setTable(table.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/rights/${item.id}`)
      } else {
        let list = table.filter(data => data.id === item.rightId) //选择子项所在的父级目录
        list[0].children = list[0].children.filter(data => data.id !== item.id)
        setTable([...table])
        axios.delete(`http://localhost:5000/children/${item.id}`)
      }
    }
    return (
        <>
           <Table dataSource={table} columns={columns} pagination={{pageSize:5}}/>;
        </>
    )
  }



export default list;