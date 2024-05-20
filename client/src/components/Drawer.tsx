import { FC, ReactNode } from "react";
import NewTab from "./NewTab";

const Drawer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content pb-20 bg-base-200 min-h-screen max-w-full">
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <NewTab link="https://github.com/dawmsi" title="Github" />
          </li>
          <li>
            <NewTab
              link="https://testprovider.com/ru/search-certificate/tp93152536"
              title="React Advanced"
            />
          </li>
          <li>
            <NewTab
              link="https://testprovider.com/ru/search-certificate/tp58062868"
              title="
              Asynchronous programming in JavaScript"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
