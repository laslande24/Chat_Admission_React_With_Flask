import { useState } from "react";

import { close, logo, menu } from "./../../assets";
import { navLinks } from "./../../constants";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img
        src={logo}
        alt="hoobank"
        className="w-[124px] h-[72px] cursor-pointer"
      />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}
            ${
              nav.id === "login"
                ? "rounded-md bg-[#5ce1e6] py-2 px-3 hover:bg-pink-100"
                : "rounded-none bg-none py-0 px-0"
            } text-white mr-10`}
            onClick={() => setActive(nav.title)}
          >
            {nav.title === "Login" ? (
              <Link to={`/signin`}>{nav.title}</Link>
            ) : (
              <a href={`#${nav.id}`}>{nav.title}</a>
            )}
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col gap-3 justify-end items-center flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[16px] hover:text-pink-300 ${
                  active === nav.title ? "text-white" : "text-dimRed"
                }${index === navLinks.length - 1 ? "mr-0" : "mr-10"}
            ${
              nav.id === "login"
                ? "rounded-md bg-[#5ce1e6] hover:bg-pink-100 py-2 px-3 "
                : "rounded-none bg-none py-0 px-0"
            } text-white`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title === "Login" ? (
                  <Link to={`/signin`}>{nav.title}</Link>
                ) : (
                  <a href={`#${nav.id}`}>{nav.title}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
