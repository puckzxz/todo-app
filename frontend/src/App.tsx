import React, { useContext, useState } from "react";
import "./App.css";
import { ITodo } from "./api";
import { Input, Layout, List, Form, Button, message } from "antd";
import { TodoContext } from "./TodoContext";
import UpdateModal from "./UpdateModal";

function App() {
  const ctx = useContext(TodoContext);

  const [visible, setVisible] = useState<boolean>(false);

  const [updateTodo, setUpdateTodo] = useState<ITodo>();

  const [form] = Form.useForm();

  const onFinish = async (values: { title: string; description: string }) => {
    const { title, description } = values;
    const td: ITodo = {
      title,
      description,
    };

    const ok = ctx?.AddTodo(td);

    if (!ok) {
      message.error("Failed to add TODO");
      return;
    }

    message.success("TODO Added");
    form.resetFields();
  };

  return (
    <Layout>
      <Layout.Content style={{ paddingLeft: "33%", paddingRight: "33%", paddingTop: "2%" }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "A Title is required!" }]}>
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "A Description is required!" }]}
          >
            <Input.TextArea rows={6} placeholder="Description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <List
          itemLayout="vertical"
          dataSource={ctx?.Todos}
          renderItem={(i) => (
            <List.Item
              key={i.id}
              actions={[
                <Button
                  size="small"
                  ghost
                  onClick={async () => {
                    setUpdateTodo(i);
                    setVisible(true);
                  }}
                >
                  Update
                </Button>,
                <Button
                  size="small"
                  danger
                  ghost
                  onClick={async () => {
                    const ok = ctx?.DeleteTodo(i.id!);
                    if (ok) {
                      message.success("TODO Deleted");
                    } else {
                      message.error("Failed to delete");
                    }
                  }}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta title={i.title} description={i.description} />
            </List.Item>
          )}
        />
        {updateTodo && (
          <UpdateModal
            toggleVisibilty={() => {
              setVisible(false);
              setUpdateTodo(undefined);
            }}
            visible={visible}
            todo={updateTodo}
          />
        )}
      </Layout.Content>
    </Layout>
  );
}

export default App;
