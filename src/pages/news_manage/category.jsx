import { Table, Button, Modal, Form, Input, Popconfirm } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
const EditableContext = React.createContext(null);

const category = () => {
    const [table, setTable] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/categories').then(
            res => {
                setTable(res.data)
            }
        )
    }, [])

    const handleSave = (record) => {
        setTable(table.map(item => {
            if(item.id === record.id){
                return {
                    id: item.id,
                    title: record.title,
                    value: record.title
                }
            }
            return item
        }))
        axios.patch(`http://localhost:5000/categories/${record.id}`, {
            title: record.title,
            value: record.title
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave,
              }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { deleteItem(item) }} />
                </div>
            }
        }
    ];

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
        })
    }

    const deleteok = (item) => {
        setTable(table.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/categories/${item.id}`)
    }

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <>
            <Table dataSource={table} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                }
            }} />;
        </>
    )
}



export default category;