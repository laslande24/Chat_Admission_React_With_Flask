import { useState, useEffect } from "react";
import {
  drawer,
  Dustbin,
  Update,
  Logout,
  Tick,
  Cross,
  user,
  Menu2,
  Refresh,
} from "../../assets";
import { motion, AnimatePresence } from "framer-motion";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

const Sidebar = (props) => {
  const [isShowing, setShowing] = useState(true);

  const [editMode, setEditMode] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [chatBoxes, setChatBoxes] = useState([]);

  const [screenSize, setScreenSize] = useState("");

  const windowSize = useWindowSize();

  const isPhoneSize = windowSize.width <= 640;

  const isTabletSize = windowSize.width <= 768;

  useEffect(() => {
    setChatBoxes(props.chatBoxes);
    if (isPhoneSize || isTabletSize) {
      setShowing(false);
      setScreenSize(true);
      props.handlescreenSize(isPhoneSize || isTabletSize);
    } else {
      setShowing(true);
      setScreenSize(false);
      props.handlescreenSize(isPhoneSize || isTabletSize);
    }
  }, [props.chatBoxes, windowSize]);

  const sidebarOpenClosed = () => {
    setShowing((isShowing) => {
      const updatedIsShowing = !isShowing;
      props.isSidebarShowing(updatedIsShowing);
      return updatedIsShowing;
    });
  };

  const handleInputChange = (event, index) => {
    const updatedChatBoxes = [...chatBoxes];
    updatedChatBoxes[index] = {
      ...updatedChatBoxes[index],
      name: event.target.value,
    };
    setInputValue(event.target.value);
    setChatBoxes(updatedChatBoxes);
  };

  const handleEdit = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = true;
    setEditMode(updatedEditMode);
  };

  const handleSave = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = false;
    const updatedInitialChatBoxes = [...props.chatBoxes];
    updatedInitialChatBoxes[index] = {
      ...updatedInitialChatBoxes[index],
      name: chatBoxes[index].name,
    };
    setEditMode(updatedEditMode);
    props.handleEditChatBoxName(inputValue);
  };

  const handleCancel = (index) => {
    const updatedChatBoxes = [...chatBoxes];
    updatedChatBoxes[index] = {
      ...updatedChatBoxes[index],
      name: props.chatBoxes[index].name,
    };
    setChatBoxes(updatedChatBoxes);

    const updatedEditMode = [...editMode];
    updatedEditMode[index] = false;
    setEditMode(updatedEditMode);
  };

  const handleSelect = (chatBox) => {
    props.selectChatBox(chatBox);
    if (screenSize) {
      setShowing((isShowing) => {
        const updatedIsShowing = !isShowing;
        props.isSidebarShowing(updatedIsShowing);
        return updatedIsShowing;
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isShowing && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`h-full inset-0 bg-[#E3E3E3] dark:bg-[#262626]`}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20 pt-4">
                <nav
                  className="flex h-full w-full flex-col"
                  aria-label="Chat history"
                >
                  <div className="absolute left-0 top-14 z-20 overflow-hidden transition-all duration-500 invisible max-h-0">
                    <div className="bg-gray-900 px-4 py-3">
                      <div className="p-1 text-sm text-gray-100">
                        Chat History is off for this browser.
                      </div>
                      <div className="p-1 text-xs text-gray-500">
                        When history is turned off, new chats on this browser
                        won't appear in your history on any of your devices, be
                        used to train our models, or stored for longer than 30
                        days.{" "}
                        <strong>
                          This setting does not sync across browsers or devices.
                        </strong>{" "}
                        <a
                          href="https://help.openai.com/en/articles/7730893"
                          target="_blank"
                          className="underline"
                          rel="noreferrer"
                        >
                          Learn more
                        </a>
                      </div>
                      <button className="btn relative btn-primary mt-4 w-full">
                        <div className="flex w-full gap-2 items-center justify-center">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                            <line x1="12" y1="2" x2="12" y2="12"></line>
                          </svg>
                          Enable chat history
                        </div>
                      </button>
                    </div>
                    <div className="h-24 bg-gradient-to-t from-gray-900/0 to-gray-900"></div>
                  </div>

                  {/*conversations topics and date*/}
                  <div className="flex flex-col w-[90%] h-1/2 flex-1 self-center bg-[#F5F5F5] dark:bg-[#404040] rounded-lg shadow-md shadow-gray-300 dark:shadow-gray-700 transition-opacity duration-500 overflow-y-auto mb-4 font-poppins font-normal">
                    <div
                      className={`flex flex-col text-[#181818] dark:text-gray-100 text-sm ${
                        props.chatBoxes.length > 0 ? "" : "h-full"
                      }`}
                    >
                      <AnimatePresence>
                        {props.chatBoxes.length > 0 ? (
                          chatBoxes.map((chatBox, index) => {
                            return (
                              <motion.div
                                key={chatBox.id}
                                initial={{ x: -100 }}
                                animate={{ x: 0 }}
                                exit={{ x: -100 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                onClick={() => handleSelect(chatBox)}
                                className="relative p-2"
                                style={{ height: "auto", opacity: "1" }}
                              >
                                <ol>
                                  <li
                                    className="relative z-[15]"
                                    style={{ opacity: "1", height: "auto" }}
                                  >
                                    <a
                                      className={`flex py-3 px-3 rounded-md items-center gap-3 relative cursor-pointer break-all group ${
                                        props.currentChatBox &&
                                        chatBox.id === props.currentChatBox.id
                                          ? "pr-[4.5rem] bg-gray-300 dark:bg-gray-700 animate-flash"
                                          : "hover:bg-gray-200 dark:hover:bg-[#343541] hover:pr-4"
                                      }`}
                                    >
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 "
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                      </svg>

                                      {/*conversation topic*/}
                                      <div
                                        className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
                                        onClick={() =>
                                          props.selectChatBox(chatBox)
                                        }
                                      >
                                        {editMode[index] ? (
                                          <input
                                            type="text"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              background: "transparent",
                                              padding: 0,
                                              fontSize: "14px",
                                            }}
                                            value={chatBox.name}
                                            onChange={(event) =>
                                              handleInputChange(event, index)
                                            }
                                          />
                                        ) : (
                                          <span>{chatBox.name}</span>
                                        )}
                                        <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-lfrom-gray-300 group-hover:from-gray-400 dark:from-[#404040] dark:group-hover:from-[#444654]"></div>
                                      </div>

                                      {/*option button*/}
                                      {props.currentChatBox &&
                                      chatBox.id === props.currentChatBox.id ? (
                                        <div className="absolute flex right-1 z-10 text-gray-700 dark:text-gray-300 visible">
                                          {editMode[index] ? (
                                            <>
                                              {/*validate button*/}
                                              <button
                                                type="button"
                                                className="p-1 hover:text-white"
                                                onClick={() =>
                                                  handleSave(index)
                                                }
                                              >
                                                <Tick className="w-5 h-5 text-gray-200 hover:text-white" />
                                              </button>

                                              {/*cancel button*/}
                                              <button
                                                type="button"
                                                className="p-1 hover:text-white"
                                                onClick={() =>
                                                  handleCancel(index)
                                                }
                                              >
                                                <Cross className="w-5 h-5 text-gray-200 hover:text-white" />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              {/*edit button*/}
                                              <button
                                                className="p-1 hover:text-gray-700 dark:hover:text-white"
                                                onClick={() =>
                                                  handleEdit(index)
                                                }
                                              >
                                                <svg
                                                  stroke="currentColor"
                                                  fill="none"
                                                  strokeWidth="2"
                                                  viewBox="0 0 24 24"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="h-4 w-4"
                                                  height="1em"
                                                  width="1em"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path d="M12 20h9"></path>
                                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                </svg>
                                              </button>
                                              {/*delete button*/}
                                              <button
                                                className="p-1 hover:text-gray-700 dark:hover:text-white"
                                                onClick={
                                                  props.handleDeleteChatBox
                                                }
                                              >
                                                <svg
                                                  stroke="currentColor"
                                                  fill="none"
                                                  strokeWidth="2"
                                                  viewBox="0 0 24 24"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="h-4 w-4"
                                                  height="1em"
                                                  width="1em"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <polyline points="3 6 5 6 21 6"></polyline>
                                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                  <line
                                                    x1="10"
                                                    y1="11"
                                                    x2="10"
                                                    y2="17"
                                                  ></line>
                                                  <line
                                                    x1="14"
                                                    y1="11"
                                                    x2="14"
                                                    y2="17"
                                                  ></line>
                                                </svg>
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      ) : null}
                                    </a>
                                  </li>
                                </ol>
                              </motion.div>
                            );
                          })
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full gap-2 flex flex-row flex-1 items-center justify-center"
                          >
                            <span onClick={props.handleRefresh}>
                              <Refresh className="w-6 h-6 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400" />
                            </span>
                            <h2 className="max-w-[65%] ss:max-w-[85%] whitespace-pre-wrap break-words">
                              No conversation History
                            </h2>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/*bottom menu*/}
                  <div className="border-t border-white/20 pt-2 empty:hidden font-poppins font-normal">
                    {/*Logout button*/}
                    <a className="flex p-3 items-center gap-3 text-[#181818] dark:text-white cursor-pointer text-sm hover:bg-gray-400 rounded-md transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                      <span className="flex w-full flex-row justify-between">
                        <span className="gold-new-button flex items-center gap-3">
                          <Logout className="w-4 h-4 cursor-pointer text-[#404040] dark:text-[#F5F5F5]" />
                          Logout
                        </span>
                      </span>
                    </a>

                    {/*delete conversations*/}
                    <a className="flex p-3 items-center gap-3 text-[#181818] dark:text-white cursor-pointer text-sm hover:bg-gray-400 rounded-md transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                      <span className="flex w-full flex-row justify-between">
                        <span className="gold-new-button flex items-center gap-3">
                          <Dustbin className="w-4 h-4 cursor-pointer text-[#404040] dark:text-[#F5F5F5]" />
                          Delete conversations
                        </span>
                      </span>
                    </a>

                    {/*upgrade to vip*/}
                    <a className="flex p-3 items-center gap-3 text-[#181818] dark:text-white cursor-pointer text-sm hover:bg-gray-400 rounded-md transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                      <span className="flex w-full flex-row justify-between">
                        <span className="gold-new-button flex items-center gap-3">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Upgrade to VIP
                        </span>
                      </span>
                    </a>

                    {/*update to FAQ*/}
                    <a className="flex p-3 items-center gap-3 text-[#181818] dark:text-white cursor-pointer text-sm hover:bg-gray-400 rounded-md transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                      <span className="flex w-full flex-row justify-between">
                        <span className="gold-new-button flex items-center gap-3">
                          <Update className="w-4 h-4 cursor-pointer text-[#404040] dark:text-[#F5F5F5]" />
                          Update to FAQ
                        </span>
                      </span>
                    </a>

                    {/*account button*/}
                    <div className="group relative">
                      <button
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-400 group-ui-open:bg-gray-800"
                        type="button"
                      >
                        {/*user image */}
                        <div className="-ml-0.5 w-5 flex-shrink-0">
                          <div className="relative flex">
                            <span
                              style={{
                                boxSizing: "border-box",
                                display: "inline-block",
                                overflow: "hidden",
                                width: "initial",
                                height: "initial",
                                background: "none",
                                opacity: "1",
                                border: "0px none",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                maxWidth: "100%",
                              }}
                            >
                              <span
                                style={{
                                  boxSizing: "border-box",
                                  display: "block",
                                  width: "initial",
                                  height: "initial",
                                  background: "none",
                                  opacity: "1",
                                  border: "0px none",
                                  margin: "0px",
                                  padding: "0px",
                                  maxWidth: "100%",
                                }}
                              >
                                <img
                                  style={{
                                    display: "block",
                                    maxWidth: "100%",
                                    width: "initial",
                                    height: "initial",
                                    background: "none",
                                    opacity: "1",
                                    border: "0px none",
                                    margin: "0px",
                                    padding: "0px",
                                  }}
                                  alt="user"
                                  aria-hidden="true"
                                  src={user}
                                />
                              </span>
                              <img
                                alt="User"
                                src={user}
                                className="rounded-sm"
                                style={{
                                  position: "absolute",
                                  inset: "0px",
                                  boxSizing: "border-box",
                                  padding: "0px",
                                  border: "medium none",
                                  margin: "auto",
                                  display: "block",
                                  width: "0px",
                                  height: "0px",
                                  minWidth: "100%",
                                  maxWidth: "100%",
                                  minHeight: "100%",
                                  maxHeight: "100%",
                                }}
                              />
                            </span>
                          </div>
                        </div>

                        {/*username */}
                        <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-[#181818] dark:text-white">
                          mykalicj@gmail.com
                        </div>
                      </button>
                    </div>
                  </div>

                  {/*new chat button and text*/}
                  <div className="mb-6 mt-2 flex flex-row gap-2 px-2 font-poppins font-medium">
                    <a
                      onClick={props.createNewChatBox}
                      className="flex p-3 items-center gap-3 text-white cursor-pointer text-sm rounded-md bg-[#33bbcf] hover:bg-[#76c6c8] h-11 flex-shrink-0 flex-grow transition ease-in-out hover:scale-105 duration-300"
                    >
                      <svg
                        className="h-4 w-4"
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="12" y="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      New Chat
                    </a>
                    <span>
                      <a
                        className="flex text-white cursor-pointer text-sm rounded-md border-white/20 bg-[#33bbcf] hover:bg-[#7de7eb] h-11 w-11 flex-shrink-0 items-center justify-center transition ease-in-out hover:scale-110 duration-300"
                        onClick={() => sidebarOpenClosed()}
                      >
                        <img
                          src={drawer}
                          title="Hide sidebar"
                          alt="drawer"
                          className="w-[2em] h-[2em] cursor-pointer"
                        />
                      </a>
                    </span>
                  </div>
                </nav>
                <h2
                  style={{
                    position: "absolute",
                    border: "0px none",
                    width: "1px",
                    height: "1px",
                    padding: "0px",
                    margin: "-1px",
                    overflow: "hidden",
                    clip: "rect(0px, 0px, 0px, 0px)",
                    whiteSpace: "nowrap",
                    overflowWrap: "normal",
                  }}
                >
                  Chat history
                </h2>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isShowing && (
          <motion.div
            initial={{ x: "280px" }}
            animate={{ x: 0 }}
            exit={{ x: "-280px" }}
            transition={{ duration: 0.3 }}
            className="fixed flex items-center justify-center left-4 top-4 z-10 "
            onClick={() => sidebarOpenClosed()}
          >
            <Menu2 className="w-10 h-10 cursor-pointer rounded-lg bg-[#33bbcf] hover:bg-cyan-400 p-2 shadow-md shadow-gray-300 dark:shadow-gray-500 text-[#404040] dark:text-[#F5F5F5] hover:text-[#F5F5F5] dark:hover:text-[#404040]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
