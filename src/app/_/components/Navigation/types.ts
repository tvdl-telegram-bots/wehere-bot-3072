export type Item = {
  key?: React.Key;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  href: string;
  tooltip?: string;
  active?: boolean;
};

export type Item$Navigation = Item;
