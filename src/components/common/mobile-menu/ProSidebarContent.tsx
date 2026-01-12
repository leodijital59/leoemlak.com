import { Link, useLocation } from "@tanstack/react-router";

import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { isParentActive } from "@/utilis/isMenuActive";
import mobileMenuItems from "@/data/mobileMenuItems";

const ProSidebarContent = () => {
  const path = useLocation({
      select: (location) => location.pathname
  });

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {mobileMenuItems.map((item, index) => (
          <SubMenu
            key={index}
            className={isParentActive(item.subMenu, path) ? "active" : ""}
            label={item.label}
          >
            {item.subMenu.map((subItem, subIndex) =>
              subItem.subMenu ? (
                <SubMenu
                  key={subIndex}
                  label={subItem.label}
                  className={
                    isParentActive(subItem.subMenu, path) ? "active" : ""
                  }
                >
                  {subItem.subMenu.map((nestedItem: any, nestedIndex: number) => (
                    <MenuItem
                      key={nestedIndex}
                      component={
                        <Link
                          className={nestedItem.path == path ? "active" : ""}
                          to={nestedItem.path}
                        />
                      }
                    >
                      {nestedItem.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  key={subIndex}
                  component={
                    <Link
                      className={subItem.path == path ? "active" : ""}
                      to={subItem.path}
                    />
                  }
                >
                  {subItem.label}
                </MenuItem>
              )
            )}
          </SubMenu>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
