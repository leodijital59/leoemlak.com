import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface MenuItem {
  path?: string
  subMenu?: MenuItem[]
}

export const isParentActive = (children: MenuItem[] | undefined, path: string): boolean => {
  if (!children) {
    return false;
  }
  return children.some((item) =>
      item.path?.split('/')[1] === path.split('/')[1]
          ? true
          : item.subMenu?.some((item2) => item2.path?.split('/')[1] === path.split('/')[1])
  );
};
