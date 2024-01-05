import { useState, useEffect, useRef } from "react";
import { Sm, Mic, Update } from "../../assets";

const Footer = (props) => {
  const [textareaRows, setTextareaRows] = useState(1);
  const [isTextareaEmpty, setTextareaEmpty] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [isPressing, setIsPressing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support the Web Speech API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("is listening...");
    };

    recognition.onresult = (event) => {
      const finalTranscript = event.results[event.results.length - 1][0].transcript;
      console.log("finalTranscript==>", finalTranscript);
      setUserInput(finalTranscript);
    };

    recognition.onend = () => {
      console.log("stopped listening...");
      if (isListening) {
        recognition.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleButtonPress = () => {
    setIsPressing(true);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleButtonRelease = () => {
    setIsPressing(false);
    setIsListening(false);
    recognitionRef.current.stop();
  };

  const handleChange = (event) => {
    const textareaLineHeight = 35;
    const minRows = 1;
    const maxRows = 8;
    const input = event.target.value;
    setUserInput(input);
    if (input.trim().length === 0) {
      setTextareaEmpty(true);
    } else {
      setTextareaEmpty(false);
    }
    const currentRows = input.split("\n").length;
    setTextareaRows(currentRows < minRows ? currentRows : maxRows);
    event.target.style.height = `${textareaLineHeight * currentRows}px`;
  };

  const handleSubmit = () => {
    if (userInput.trim() !== "") {
      props.handleSendMessage(userInput);
      setUserInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 border-gray-100 dark:border-[#343541] md:border-transparent md:dark:border-transparent bg-gradient-to-b from-transparent via-white to-gray-200 dark:bg-gradient-to-b dark:from-transparent dark:via-[#343541] dark:to-gray-800 dark:bg-[#343541] md:!bg-transparent pt-2 md:pl-2 md:w-[calc(100%-.5rem)]">
      <div
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        <div
          className="relative flex-col h-full flex-1 items-stretch"
          role="presentation"
        >
          <div className="hidden ss:flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
            {props.currentChatBox && !props.isLoading && (
              <button
                onClick={props.regenerate_response}
                className="btn relative btn-neutral -z-0 border-0 md:border bg-red-200 hover:bg-[#C00D0D] dark:bg-[#262626] dark:hover:bg-[#404040] shadow-md shadow-gray-400"
              >
                <div className="flex w-full gap-2 items-center justify-center text-[#C00D0D] hover:text-red-200 dark:text-gray-50 dark:hover:text-gray-50">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 flex-shrink-0"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                  Regenerate response
                </div>
              </button>
            )}
          </div>
          {/*textarea and send button*/}
          <div className="flex">
            <div className="flex w-full p-2 ss:p-4 flex-grow md:py-4 md:pl-4 font-mono px-4 items-center border-black/10 bg-gray-50 dark:border-[#404040] text-[#404040] dark:text-white dark:bg-[#404040] rounded-xl shadow-md shadow-gray-300 dark:shadow-md dark:shadow-gray-600">
              <div className="flex-1 mx-4">
                <textarea
                  id="prompt-textarea"
                  placeholder="Send a message"
                  value={userInput}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="m-0 w-full placeholder:text-justify text-justify leading-none placeholder:leading-none resize-none border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                ></textarea>
              </div>
              <button
                onMouseDown={handleButtonPress}
                onMouseUp={handleButtonRelease}
                onTouchStart={handleButtonPress}
                onTouchEnd={handleButtonRelease}
                className={`${
                  isPressing ? "bg-green-500 hover:bg-red-500" : ""
                }flex justify-center rounded-md dark:disabled:hover:bg-transparent text-white transition-colors mr-4`}
                title={`${isListening ? "stop listening" : "start listening"}`}
              >
                <Mic className="w-7 h-7 cursor-pointer text-gray-400 dark:text-gray-800 hover:text-[#33bbcf]" />
              </button>
              <button
                className={`rounded-lg p-1 hover:bg-[#33bbcf] hover:text-white dark:disabled:hover:bg-transparent disabled:text-gray-400 enabled:bg-brand-purple text-white transition-colors ${
                  !isTextareaEmpty && "bg-[#33bbcf]"
                }`}
                title="Send message"
                style={{ backgroundColor: !isTextareaEmpty && "#33bbcf" }}
                onClick={handleSubmit}
              >
                <Sm
                  color={`h-5 w-5 cursor-pointer  ${
                    !isTextareaEmpty
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-800"
                  }`}
                />
              </button>
            </div>
            {props.currentChatBox && !props.isLoading && (
              <a className="flex ss:hidden p-2 items-center text-[#181818] dark:text-white cursor-pointer text-sm hover rounded-md transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300">
                <Update className="w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-800 hover:text-[#33bbcf]" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="font-poppins p-2 ss:p-4 text-center text-xs dark:text-gray-50 text-[#343541] md:pb-6 md:pt-3">
        <span>
          Free Research Preview. RoboLexicon may produce inaccurate information
          about people, places, or facts.
          <a href="#" target="_blank" rel="noreferrer" className="underline">
            RoboLexicon June 20 Version
          </a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
