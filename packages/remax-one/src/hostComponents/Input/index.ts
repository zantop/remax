import * as React from 'react';
import { InputEvent } from '../../types';
import { createCallback, createInputEvent } from '../../createHostComponent';
import { InputProps } from './props';

export type { InputProps };

export interface InputState {
  value?: string;
  controlled: boolean;
}

export default class Input extends React.Component<InputProps, InputState> {
  // 平台独有的属性默认值写在这
  static defaultProps = {
    'toutiao-selection-end': 999,
    'toutiao-selection-start': 999,

    'wechat-placeholder-class': 'input-placeholder',
    'wechat-cursor-spacing': 0,
    'wechat-confirm-type': 'done',
    'wechat-confirm-hold': false,
    'wechat-selection-end': -1,
    'wechat-selection-start': -1,
    'wechat-adjust-position': true,
    'wechat-hold-keyboard': false,
  };

  state: InputState = {
    value: '',
    // 阿里
    controlled: false,
  };

  constructor(props: InputProps) {
    super(props);

    const controlled = props.value !== undefined;
    const value = controlled ? props.value : props.defaultValue;

    this.state = {
      value,
      controlled,
    };
  }

  componentDidUpdate() {
    if (this.props.value !== undefined && this.props.value !== this.state.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleInput = (e: InputEvent) => {
    const { controlled } = this.state;

    if (!controlled) {
      this.setState({ value: e.target.value });
    }

    if (typeof this.props.onInput === 'function') {
      return this.props.onInput(e);
    }

    // 微信
    // 注意，微信要对 input 受控，必须要在 onInput 方法返回值
    return controlled ? this.props.value : e.target.value;
  };

  render() {
    const inputProps = {
      ...this.props,
      onInput: createCallback(this.handleInput, createInputEvent),
    };

    if (inputProps.onConfirm) {
      inputProps.onConfirm = createCallback(this.props.onConfirm, createInputEvent);
    }

    if (inputProps.onFocus) {
      inputProps.onFocus = createCallback(this.props.onFocus, createInputEvent);
    }

    if (inputProps.onBlur) {
      inputProps.onBlur = createCallback(this.props.onBlur, createInputEvent);
    }

    // 通用属性的默认属性根据平台在这里设置
    if (process.env.REMAX_PLATFORM === 'toutiao') {
      inputProps.maxLength = inputProps.maxLength ?? 140;
    }

    if (process.env.REMAX_PLATFORM === 'wechat') {
      inputProps.type = inputProps.type ?? 'text';
      inputProps.password = inputProps.password ?? false;
      inputProps.disabled = inputProps.disabled ?? false;
      inputProps.focus = inputProps.focus ?? false;
      inputProps.maxLength = inputProps.maxLength ?? 140;
    }

    return React.createElement('input', {
      ...inputProps,
      ...this.state,
    });
  }
}
