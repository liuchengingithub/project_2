import {Table, Tag, Button, Space, Modal, Switch, Popover, Tree} from 'antd'
import { useState, useEffect } from 'react';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;

const list = () => {
    const [table, setTable] = useState([])
    const [treeData, setTreeData] = useState([])
    const [checkedKeys, setCheckedKeys] = useState([])
    const [rightsid, setRightsid] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(
            res => {
                setTable(res.data)
            }
        )
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/rights_children').then(
            res => {
                setTreeData(res.data)
            }
        )
    })

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (id) => {
          return <b>{id}</b>
        }
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '开关',
        render: (item) => {
          return <div>
            <Space size='middle'>
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {deleteItem(item)}} />
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                    setIsModalVisible(true)
                    setCheckedKeys(item.rights)
                    setRightsid(item.id)
                }} />
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
        setTable(table.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/roles/${item.id}`)
      }

    const handleOk = () => {
        setIsModalVisible(false);
        setTable(table.map(item => {
            if(item.id === rightsid){
                return {
                    ...item,
                    rights: checkedKeys
                }
            }
            return item
        }))
        axios.patch(`http://localhost:5000/roles/${rightsid}`, {
            rights: checkedKeys
        })
      };
    
    const handleCancel = () => {
        setIsModalVisible(false);
      };

    const onCheck = (check) => {
        setCheckedKeys(check)
      };
      
    return (
        <>
           <Table dataSource={table} columns={columns} pagination={{pageSize:5}} rowKey={item => item.id}/>;
           <Modal title="权限管理" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
                <Tree
                checkStrictly
                checkable
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                treeData={treeData}
                />
            </Modal>
        </>
    )
}
    
  



export default list;