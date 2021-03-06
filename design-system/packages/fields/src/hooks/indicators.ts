import { useTheme } from '@keystone-ui/core';

export type IndicatorTokensProps = {
  // size: SizeType;
  type: 'checkbox' | 'radio';
  /* Causes the indicator to invert background and foreground when selected */
  invertOnSelect?: boolean;
};

type IndicatorStateTokens = {
  background?: string;
  borderColor?: string;
  shadow?: string;
  foreground?: string;
};

export type IndicatorTokens = {
  borderRadius?: string | number;
  borderWidth?: string | number;
  boxSize: string | number;
  transition?: string;
  hover: IndicatorStateTokens;
  focus: IndicatorStateTokens;
  selected: IndicatorStateTokens;
  disabled: IndicatorStateTokens;
} & IndicatorStateTokens;

export const useIndicatorTokens = ({ type }: IndicatorTokensProps): IndicatorTokens => {
  const { animation, sizing, fields } = useTheme();
  return {
    background: fields.controlBackground,
    borderColor: fields.controlBorderColor,
    borderRadius: type === 'checkbox' ? fields.controlBorderRadius : '50%',
    borderWidth: fields.controlBorderWidth,
    boxSize: sizing.xsmall,
    foreground: fields.controlBackground, // visually hide the icon unless the control is checked
    transition: `
      background-color ${animation.duration100},
      box-shadow ${animation.duration100},
      border-color ${animation.duration100},
      color ${animation.duration100}
    `,
    hover: {
      background: fields.hover.controlBackground,
      borderColor: fields.hover.controlBorderColor,
      shadow: fields.hover.shadow,
      foreground: fields.hover.controlForeground,
    },
    focus: {
      background: fields.focus.controlBackground,
      borderColor: fields.focus.controlBorderColor,
      shadow: fields.focus.shadow,
      foreground: fields.focus.controlForeground,
    },
    selected: {
      background:
        type === 'checkbox' ? fields.selected.controlBackground : fields.selected.controlForeground,
      borderColor: fields.selected.controlBorderColor,
      shadow: fields.selected.shadow,
      foreground:
        type === 'checkbox' ? fields.selected.controlForeground : fields.selected.controlBackground,
    },
    disabled: {
      background: fields.disabled.controlBackground,
      borderColor: fields.disabled.controlBorderColor,
      shadow: fields.disabled.shadow,
      foreground: fields.disabled.controlForeground,
    },
  };
};

export type IndicatorStylesProps = { tokens: IndicatorTokens };

export const useIndicatorStyles = ({ tokens }: IndicatorStylesProps) =>
  ({
    alignItems: 'center',
    backgroundColor: tokens.background,
    borderColor: tokens.borderColor,
    borderRadius: tokens.borderRadius,
    borderStyle: 'solid',
    borderWidth: tokens.borderWidth,
    boxSizing: 'border-box',
    color: tokens.foreground,
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    height: tokens.boxSize,
    justifyContent: 'center',
    transition: tokens.transition,
    width: tokens.boxSize,

    'input:hover + &': {
      backgroundColor: tokens.hover.background,
      borderColor: tokens.hover.borderColor,
      boxShadow: tokens.hover.shadow,
      color: tokens.hover.foreground,
    },
    'input:focus + &': {
      backgroundColor: tokens.focus.background,
      borderColor: tokens.focus.borderColor,
      boxShadow: tokens.focus.shadow,
      color: tokens.focus.foreground,
    },
    'input:checked + &': {
      backgroundColor: tokens.selected.background,
      borderColor: tokens.selected.borderColor,
      boxShadow: tokens.selected.shadow,
      color: tokens.selected.foreground,
    },
    'input:disabled + &': {
      backgroundColor: tokens.disabled.background,
      borderColor: tokens.disabled.borderColor,
      boxShadow: tokens.disabled.shadow,
      color: tokens.disabled.background,
      cursor: 'default',
    },
    'input:checked:disabled + &': {
      color: tokens.disabled.foreground,
    },
  } as const);
