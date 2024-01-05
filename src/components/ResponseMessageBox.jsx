import { useState, useEffect } from "react";
import { openai } from "../assets";

const ResponseMessageBox = ({
  initialMessage,
  speed,
  isLastMessage,
  isLoading,
}) => {
  const [isCopying, setIsCopying] = useState(false);

  const [displayText, setDisplayText] = useState("");

  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    setShowCursor(true);
    let currentText = "";
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < initialMessage.length) {
        currentText += initialMessage[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
        setTimeout(typeText, speed);
      } else {
        setShowCursor(false);
      }
    };

    typeText();

    return () => {
      clearTimeout();
    };
  }, [initialMessage, speed]);

  const copyMessage = () => {
    navigator.clipboard.writeText(initialMessage).then(() => {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    });
  };

  return (
    <div className="text-[#343541] dark:text-gray-100">
      <div className="flex relative text-base max-w-full ss:max-w-[90%] md:max-w-[70%] mx-auto break-words p-6 m-auto">
        <div className="flex-shrink-0 flex flex-col relative items-start">
          <div className="w-[30px]">
            <div
              style={{
                backgroundColor: "rgb(51,187,207)",
                borderRadius: "100%",
              }}
              className="relative p-1 rounded-sm h-[35px] w-[35px] ss:h-[40px] ss:w-[40px] md:h-[45px] md:w-[45px] lg:h-[50px] lg:w-[50px] text-white flex items-center justify-center"
            >
              <img src={openai} alt="openai" className="cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="talk-bubble-light tri-right left-top relative top-10 flex flex-col ml-4 ss:ml-10 ss:max-w-[70%] rounded-xl border-b border-black/10 dark:border-gray-900/50 bg-[#e6e7e9] dark:bg-[#404040]">
          {/* buttons */}
          <div className="flex flex-row self-end mt-2 lg:block px-4">
            <button
              className="flex rounded-md p-2 bg-[#F5F5F5] dark:bg-[#696969] hover:bg-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
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
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              )}
            </button>
          </div>
          {/* message box */}
          <div className="flex flex-grow flex-col">
            <div className="min-h-[20px] flex flex-col items-start whitespace-pre-wrap break-words">
              <div className="flex gep-2 p-4 dark:prose-invert light">
                {/* Rest of the code */}
                {isLastMessage && (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: displayText }} />
                    {showCursor && (
                      <svg
                        viewBox="8 4 8 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor"
                      >
                        <rect x="10" y="6" width="4" height="12" fill="#6b7280" />
                      </svg>
                    )}
                    {isLoading && (
                      <svg
                        viewBox="8 4 8 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor"
                      >
                        <rect x="10" y="6" width="4" height="12" fill="#6b7280" />
                      </svg>
                    )}
                  </>
                )}
                {!isLastMessage && initialMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseMessageBox;
