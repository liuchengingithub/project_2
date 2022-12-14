import {Table, Button, Form, Input, Space, Modal, Switch, Select} from 'antd'
import { useState, useEffect, useRef } from 'react';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import AddForm from '../../components/AddForm';
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;

const list = () => {
    const ref = useRef()
    const upRef = useRef()
    const [table, setTable] = useState([])
    const [region, setRegion] = useState([])
    const [role, setRole] = useState([])
    const [current, setCurrent] = useState([])
    const [open, setOpen] = useState(false)
    const [upOpen, setUpOpen] = useState(false)
    const [isActive, setIsActive] = useState()
    const {role:{roleName}, username, region:a, roleId} = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        const roleOBJ = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get('http://localhost:5000/users?_expand=role').then(
            res => {
                setTable(roleOBJ[roleId] === "superadmin"? res.data: [
                    ...res.data.filter(item => item.username === username),
                    ...res.data.filter(item => item.region === a && roleOBJ[item.roleId] === 'editor')
                ])
            }
        )
    }, [roleId, username, a])

    useEffect(() => {
        axios.get('http://localhost:5000/regions').then(
            res => {
                setRegion(res.data)
            }
        )
    }, [])

    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(
            res => {
                setRole(res.data)
            }
        )
    }, [])

    const columns = [
      {
        title: 'εΊε',
        dataIndex: 'region',
        filters: [
            ...region.map(item => ({
                text: item.title,
                value: item.value
            })),
            {
                text: "ε¨η",
                value: ""
            }
        ],
        onFilter: (value, record) => record.region === value,
        render: (region) => {
          return <b>{region === ''? 'ε¨η': region}</b>
        }
      },
      {
        title: 'θ§θ²εη§°',
        dataIndex: 'role',
        render: (role) => {
            return <b>{role.roleName}</b>
        }
      },
      {
        title: 'η¨ζ·ε',
        dataIndex: 'username'
      },
      {
        title: 'η¨ζ·ηΆζ',
        dataIndex: 'roleState',
        render: (roleState, item) => {
            return <Switch checked={roleState} disabled={item.default} onChange={() => {handleChange(item)}} />
        }
      },
      {
        title: 'εΌε³',
        render: (item) => {
          return <div>
            <Space size='middle'>
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {deleteItem(item)}} disabled={item.default} />
                <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => {handleupdate(item)}}/>
            </Space> 
          </div>
        }
      }
    ];

    const handleupdate = (item) => {
        setTimeout(() => {
            setUpOpen(true)
            if(item.roleId === 1){
                setIsActive(true)
            }else {
                setIsActive(false)
            }
            upRef.current.setFieldsValue(item)
        }, 0)
        setCurrent(item)
    }
    const handleChange = (item) => {
        item.roleState = !item.roleState
        setTable([...table])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    const deleteItem = (item) => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'η‘?θ?€ε ι€ε',

        onOk() {
          deleteok(item);
        },

        onCancel() {
          console.log('Cancel');
        }
    })}

    const deleteok = (item) => {
        setTable(table.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)
      }
      
    return (
        <>
            <Button type="primary" onClick={() => {setOpen(true)}}>ζ·»ε η¨ζ·</Button>
            <Table dataSource={table} columns={columns} pagination={{pageSize:5}} rowKey={item => item.id}/>;
            <Modal
                open={open}
                title="ζ·»ε η¨ζ·"
                okText="η‘?θ?€"
                cancelText="εζΆ"
                onCancel={() => {
                    // console.log('cancel')
                    setOpen(false)
                }}
                onOk={() => {
                    ref.current.validateFields().then(res => {
                        console.log(res)
                        setOpen(false)
                        ref.current.resetFields()
                        axios.post('http://localhost:5000/users', {
                            ...res,
                            "roleState": true,
                            "default": false,
                        }).then(re => {
                            setTable([...table, {
                                ...re.data,
                                role: role.filter(item => item.id === res.roleId)[0]
                            }])
                        }).catch(err => console.log(err))
                    })
                }}
            >
                <AddForm region={region} role={role} ref={ref}/>
            </Modal>
            <Modal
                open={upOpen}
                title="δΏ?ζΉη¨ζ·"
                okText="η‘?θ?€"
                cancelText="εζΆ"
                onCancel={() => {
                    // console.log('cancel')
                    setUpOpen(false)
                    setIsActive(!isActive)
                }}
                onOk={() => {
                    upRef.current.validateFields().then(res => {
                        // console.log(res)
                        setUpOpen(false)
                        setTable(table.map(item => {
                            if(item.id === current.id){
                                return {
                                    ...item,
                                    ...res,
                                    role: role.filter(data => data.id === res.roleId)[0]
                                }
                            }
                            return item
                        }))
                        setIsActive(!isActive)
                        axios.patch(`http://localhost:5000/users/${current.id}`, res)
                    })
                }}
            >
                <AddForm region={region} role={role} ref={upRef} isUpActive={isActive} isUpdate={true}/>
            </Modal>
        </>
    )
}
    
  



export default list;