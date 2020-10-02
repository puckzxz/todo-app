import { Button, Form, Input, message, Modal } from "antd";
import React, { useContext } from "react";
import { ITodo } from "./api";
import { TodoContext } from "./TodoContext";

interface IProps {
  todo: ITodo;
  visible: boolean;
  toggleVisibilty: () => void;
}

const UpdateModal: React.FC<IProps> = (props: IProps) => {
  const ctx = useContext(TodoContext);

  const [form] = Form.useForm();

  const onFinish = async (values: { title: string; description: string }) => {
    const { title, description } = values;

    const td: ITodo = {
      id: props.todo.id,
      title,
      description,
    };

    const ok = await ctx?.UpdateTodo(td);

    if (ok) {
      message.success("TODO Updated");
    } else {
      message.error("Failed to update TODO");
    }

    form.resetFields();
    props.toggleVisibilty();
  };

  return (
    <Modal
      footer={null}
      title="Update TODO"
      visible={props.visible}
      onOk={props.toggleVisibilty}
      onCancel={props.toggleVisibilty}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          initialValue={props.todo.title}
          rules={[{ required: true, message: "A Title is required!" }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          initialValue={props.todo.description}
          rules={[{ required: true, message: "A Description is required!" }]}
        >
          <Input.TextArea placeholder="Description" rows={6}></Input.TextArea>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
