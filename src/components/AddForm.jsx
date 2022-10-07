import { forwardRef } from "react";
import { Form, Input, Select } from 'antd'
import { useState, useEffect } from 'react';
const { Option } = Select;

const AddForm = forwardRef(({ region, role, isUpActive, isUpdate }, ref) => {
    const [isActive, setIsActive] = useState()
    useEffect(() => {
        setIsActive(isUpActive)
    }, [isUpActive])
    const {role:{roleName}, username, region:a, roleId} = JSON.parse(localStorage.getItem('token'))
    const roleOBJ = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegion = (item) => {
        if(isUpdate){
            if(roleOBJ[roleId]==='superadmin') {
                return false
            }else {
                return true
            }
        }else {
            if(roleOBJ[roleId]==='superadmin') {
                return false
            }else {
                return item.value !== a
            }
        }
    }
    const checkRole = (item) => {
        if(isUpdate){
            if(roleOBJ[roleId]==='superadmin') {
                return false
            }else {
                return true
            }
        }else {
            if(roleOBJ[roleId]==='superadmin') {
                return false
            }else {
                return roleOBJ[item.id] !== 'editor'
            }
        }
    }

    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={                    
                        isActive? []: [{ required: true, message: '请选择区域',}]
                }
            >
                <Select disabled={isActive}>
                    {
                        region.map(item => {
                            return <Option value={item.value} key={item.id} disabled={checkRegion(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选择角色',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if(value === 1) {
                        setIsActive(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsActive(false)
                    }
                }}>
                    {
                        role.map(item => {
                            return <Option value={item.id} key={item.id} disabled={checkRole(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default AddForm;