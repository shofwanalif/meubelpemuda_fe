import { App } from "antd";

export function useMessage() {
  const { message } = App.useApp();
  return message;
}

export function useNotification() {
  const { notification } = App.useApp();
  return notification;
}

export function useModal() {
  const { modal } = App.useApp();
  return modal;
}
