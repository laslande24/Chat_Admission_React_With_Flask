import { useState, useRef, useEffect } from "react";
import ResponseMessageBox from "../ResponseMessageBox";
import UserMessageBox from "../UserMessageBox";
import { motion } from "framer-motion";

const Chat = (props) => {
  const containerRef = useRef(null);

  const [showButton, setShowButton] = useState(false);

  const [lastMessageIndex, setLastMessageIndex] = useState(-1);

  useEffect(() => {
    setLastMessageIndex(props.userInput.length - 1);
  }, [props.userInput]);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      setShowButton(scrollTop + clientHeight < scrollHeight);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToBottom = () => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  return (
    <div
      className="flex-1 overflow-auto h-full"
    >
      <div className="h-full overflow-auto bg-transparent" ref={containerRef}>
        <div className="h-full">
          {/*message box*/}
          <div className="flex flex-col text-sm gap-y-8">
            {props.currentChatBox &&
              props.userInput.map((message, index) => {
                const isLastMessage = index === lastMessageIndex;
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <UserMessageBox
                      initialMessage={message.user_input}
                      handleEditInput={props.handleEditInput}
                      conversationId={message.id}
                    />

                    <ResponseMessageBox
                      initialMessage={message.bot_response}
                      speed={40}
                      isLastMessage={isLastMessage}
                      isLoading={props.isLoading}
                    />
                  </motion.div>
                );
              })}

            {/*bottom box*/}
            <div className="h-40 md:h-52 flex-shrink-0"></div>

            {/*scroll button */}
            {showButton && (
              <button
                onClick={handleScrollToBottom}
                className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border-2 border-gray-300 bg-gray-100 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 m-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
