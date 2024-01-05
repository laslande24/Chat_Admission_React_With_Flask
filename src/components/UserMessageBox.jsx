import { useState, useRef, useEffect } from "react";
import { user, Edit } from "../assets";
import { motion, AnimatePresence } from "framer-motion";

const UserMessageBox = ({
  initialMessage,
  handleEditInput,
  conversationId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [editedMessage, setEditedMessage] = useState(initialMessage);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      adjustTextareaSize();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message).then(() => {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    });
  };

  const adjustTextareaSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (e) => {
    setEditedMessage(e.target.value);
    adjustTextareaSize();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setMessage(editedMessage);
    handleEditInput(conversationId, editedMessage);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const variants = {
    expanded: {
      opacity: 1,
    },
    collapsed: {
      opacity: 0,
    },
  };

  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <div className=" text-[#343541] dark:text-gray-100">
      <div className="flex relative justify-end text-base max-w-full ss:max-w-[90%] md:max-w-[70%] whitespace-pre-wrap mx-auto break-words p-6 m-auto">
        <div className="talk-bubble-light tri-right right-top dark:right-top-dark relative top-10 flex flex-col mr-4 ss:mr-10 ss:max-w-[65%] rounded-xl border-b border-black/10 dark:border-gray-900/50 bg-[#e6e7e9] dark:bg-[#404040]">
          <div className="flex flex-grow flex-col py-2">
            <div className="flex flex-row self-start lg:block px-4">
              <div className="flex flex-row items-center justify-end p-1 bg-[#F5F5F5] dark:bg-[#696969] rounded-md">
                <button
                  className="rounded-md p-2 hover:transition hover:duration-300 hover:ease-in-out bg-[#F5F5F5] dark:bg-[#696969] hover:bg-[#e6e7e9] hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                  onClick={copyMessage}
                >
                  {isCopying ? (
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 animate-pulse"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
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
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect
                        x="8"
                        y="2"
                        width="8"
                        height="4"
                        rx="1"
                        ry="1"
                      ></rect>
                    </svg>
                  )}
                </button>
                <hr className="w-5 rotate-90 dark:bg-white bg-[rgba(51,187,207,0.25)]" />
                <button
                  className="flex rounded-md p-2 hover:transition delay-75 hover:duration-300 hover:ease-in-out hover:bg-[#e6e7e9]  dark:hover:bg-gray-700"
                  onClick={startEditing}
                >
                  <Edit className="w-4 h-4 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400" />
                </button>
              </div>
            </div>
            <motion.form
              onSubmit={handleSubmit}
              initial="collapsed"
              animate={"expanded"}
              exit="collapsed"
              variants={variants}
              transition={transition}
              className="min-h-[20px] flex flex-col items-center gap-4 whitespace-pre-wrap break-words"
            >
              {isEditing ? (
                <div className="p-4 markdown prose w-full break-words dark:prose-invert light">
                  <motion.textarea
                    ref={textareaRef}
                    value={editedMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none resize-none outline-none focus:ring-0"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={variants}
                    transition={transition}
                  />
                  <div className="flex flex-row items-center justify-center gap-4">
                    <button
                      className="rounded-md hover:bg-cyan-500 dark:hover:bg-cyan-500 hover:text-gray-300"
                      type="submit"
                    >
                      <div className="bg-[#33bbcf] dark:bg-[#33bbcf] p-2 rounded-md">
                        Submit
                      </div>
                    </button>
                    <button
                      className="flex rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 markdown prose w-full break-words dark:prose-invert light">
                  {message}
                </div>
              )}
            </motion.form>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className="w-[30px]">
            <div
              style={{
                backgroundColor: "#6d97b5",
                borderRadius: "100%",
              }}
              className="relative p-1 rounded-sm h-[35px] w-[35px] ss:h-[40px] ss:w-[40px] md:h-[45px] md:w-[45px] lg:h-[50px] lg:w-[50px] text-white flex items-center justify-center"
            >
              <img src={user} alt="user" className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessageBox;
