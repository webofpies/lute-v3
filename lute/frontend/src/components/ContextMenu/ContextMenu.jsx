import { forwardRef, Fragment, memo, useEffect, useRef, useState } from "react";
import { Menu } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import classes from "./ContextMenu.module.css";
import { contextItems } from "../../misc/menus";
import { actions } from "../../misc/actionsMap";

const ContextMenu = forwardRef(function ContextMenu(props, forwardedRef) {
  const [coords, setCoords] = useState({ clientX: null, clientY: null });
  const selectedTextRef = useRef();
  const menuRef = useClickOutside(() => {
    setCoords({ clientX: null, clientY: null });
  });
  const validCoords = coords.clientX !== null && coords.clientY !== null;

  useEffect(() => {
    const ref = forwardedRef.current;

    function handleContextMenu(e) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setCoords({ clientX, clientY });
      selectedTextRef.current = e.target.matches(".word") ? e.target : null;
    }

    ref.addEventListener("contextmenu", handleContextMenu);

    return () => ref.removeEventListener("contextmenu", handleContextMenu);
  });

  return (
    <Menu shadow="md" width={200} opened={validCoords} keepMounted>
      <div
        ref={menuRef}
        className={classes.ctxMenu}
        style={{
          left: coords?.clientX,
          top: coords?.clientY,
        }}>
        <Menu.Target>
          <div />
        </Menu.Target>
        <Menu.Dropdown>
          {contextItems.map((section) => {
            return (
              <Fragment key={section.label}>
                <Menu.Label>{section.label}</Menu.Label>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Menu.Item
                      onClick={() =>
                        selectedTextRef.current && actions[item.action]()
                      }
                      key={item.label}
                      leftSection={<Icon size="1rem" />}>
                      {item.label}
                    </Menu.Item>
                  );
                })}
              </Fragment>
            );
          })}
        </Menu.Dropdown>
      </div>
    </Menu>
  );
});

export default memo(ContextMenu);
