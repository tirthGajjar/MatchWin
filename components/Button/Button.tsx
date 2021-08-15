import clsx from "clsx";
import values from "lodash/values";
import React, { HTMLAttributes, ReactElement, SVGProps } from "react";

enum ButtonSizesEnum {
  EXTRA_SMALL = "EXTRA_SMALL",
  SMALL = "SMALL",
  DEFAULT = "DEFAULT",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

enum ButtonTypesEnum {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  LINK = "LINK",
}

type ButtonSizes = `${ButtonSizesEnum}`;
type ButtonTypes = `${ButtonTypesEnum}`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  Icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
  type?: ButtonTypes;
  size?: ButtonSizes;
}

const ButtonStyles = {
  BaseStyles: {
    Placement: "inline-flex items-center",
    Border: "border border-transparent rounded-md",
    Focus: "focus:outline-none focus:ring-2 focus:ring-offset-2",
  },
};

const ButtonSizeStyles: { [key in ButtonSizes]?: any } = {
  EXTRA_SMALL: {
    Spacing: "px-3 py-1.5",
    Font: "text-xs font-medium",
  },
  SMALL: {
    Spacing: "px-3 py-2",
    Font: "text-sm leading-4 font-medium",
  },
  DEFAULT: {
    Spacing: "px-4 py-2",
    Font: "text-sm leading-4 font-medium",
  },
  MEDIUM: {
    Spacing: "px-4 py-2",
    Font: "text-base font-medium",
  },
  LARGE: {
    Spacing: "px-6 py-3",
    Font: "text-base font-medium",
  },
};

const ButtonTypeStyles: { [key in ButtonTypes]?: any } = {
  PRIMARY: {
    Colors: "text-white bg-gray-600",
    Hover: "hover:bg-gray-700",
    Focus: "focus:ring-gray-500",
    Border: "shadow-sm",
  },
  SECONDARY: {
    Colors: "text-gray-600 bg-gray-100",
    Hover: "hover:text-gray-700 hover:bg-gray-200",
    Focus: "focus:ring-gray-500",
    Border: "shadow-sm",
  },
  LINK: {
    Colors: "text-gray-600",
    Hover: "hover:text-gray-700 hover:bg-gray-100",
    Focus: "focus:ring-gray-500 focus:border-gray-200",
  },
};

const ButtonIconStyles = {
  BaseStyles: {
    Spacing: "-ml-0.5 mr-2",
    Dimension: "h-4 w-4",
  },
};

const ButtonVariantIconStyles = {
  EXTRA_SMALL: {
    Spacing: "-ml-0.5 mr-2",
    Dimension: "h-4 w-4",
  },
  SMALL: {
    Spacing: "-ml-0.5 mr-2",
    Dimension: "h-4 w-4",
  },
  DEFAULT: {
    Spacing: "-ml-1 mr-2",
    Dimension: "h-5 w-5",
  },
  MEDIUM: {
    Spacing: "-ml-1 mr-3",
    Dimension: "h-5 w-5",
  },
  LARGE: {
    Spacing: "-ml-1 mr-3",
    Dimension: "h-5 w-5",
  },
};

export const Button: React.FC<Props> = ({
  Icon,
  children,
  type = "PRIMARY",
  size = "DEFAULT",
  ...btnProps
}) => {
  const styles = clsx(
    values(ButtonStyles.BaseStyles),
    values(ButtonSizeStyles[size]),
    values(ButtonTypeStyles[type])
  );

  const iconStyles = clsx(
    values(ButtonIconStyles.BaseStyles),
    values(ButtonVariantIconStyles[size])
  );

  return (
    <button type="button" className={styles} {...btnProps}>
      {Icon && <Icon className={iconStyles}></Icon>}
      {children}
    </button>
  );
};
