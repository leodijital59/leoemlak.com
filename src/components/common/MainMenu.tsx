import {Link, useLocation} from "@tanstack/react-router";
import menu from "@/data/menu";

const MainMenu = () => {
  const path = useLocation({
    select: (location) => location.pathname
  });

  return (
    <ul className="ace-responsive-menu">
      {menu.map((item, index) => (
        <li key={index} className={item.subMenu?.length ? "visible_list dropitem" : "visible_list"}>
          <Link className="list-item" to={item.href || "#"}>
            <span className={item.href == path ? "title menuActive" : "title"}>
              {item.label}
            </span>
            {item.subMenu?.length && <span className="arrow"></span>}
          </Link>
          {item.subMenu?.length && <ul className="sub-menu">
            {item.subMenu.map((subMenuItem, subIndex) => (
              <li key={subIndex} className="dropitem">
                <Link to={subMenuItem.href || "#"}>
                  <span className={subMenuItem.href == path ? "menuActive" : ""}>
                    {subMenuItem.label}
                  </span>
                  {subMenuItem.subMenu?.length && <span className="arrow"></span>}
                </Link>
                {subMenuItem.subMenu?.length && <ul className="sub-menu">
                  {subMenuItem.subMenu.map((itemSubMenu, itemSubIndex) => (
                      <li key={itemSubIndex}>
                        <Link
                            className={itemSubMenu.href == path ? "menuActive" : ""}
                            to={itemSubMenu.href || "#"}
                        >
                          {itemSubMenu.label}
                        </Link>
                      </li>
                  ))}
                </ul>}
              </li>
            ))}
          </ul>}
        </li>
      ))}
    </ul>
  );
};

export default MainMenu;
