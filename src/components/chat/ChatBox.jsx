import { useState, useEffect } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import axios from "axios";

const ChatBox = (props) => {
  const [isShowing, setShowing] = useState(false);

  const [chatBoxes, setChatBoxes] = useState([]);

  const [currentChatBox, setCurrentChatBox] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [userInput, setUserInput] = useState([]);

  const [screenSize, setScreenSize] = useState();

  useEffect(() => {
    fetchChatBoxes();
  }, []);

  const fetchChatBoxes = async () => {
    try {
      const response = await axios.get("/chat_boxes"); // Assuming the Flask route for fetching chat boxes is '/chat_boxes'
      setChatBoxes(response.data);
    } catch (error) {
      console.error("Error fetching chat boxes:", error);
    }
  };

  const selectChatBox = async (chatBox) => {
    setCurrentChatBox(chatBox);
    if (chatBox) {
      try {
        const response = await axios.get(
          `/conversations/${"a368b282-dba2-487e-881b-d489f66562bb"}/${
            chatBox.id
          }`
        );
        setUserInput(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setUserInput([]);
    }
  };

  const createNewChatBox = async () => {
    try {
      const response = await axios.post(
        `/new_chat_box/${"a368b282-dba2-487e-881b-d489f66562bb"}`
      );
      const newChatBox = response.data;
      setChatBoxes([...chatBoxes, newChatBox]);
      setCurrentChatBox(newChatBox);
      selectChatBox(newChatBox);
    } catch (error) {
      console.error("Error creating new chat box:", error);
    }
  };

  const handleDeleteChatBox = async () => {
    if (currentChatBox) {
      try {
        await axios.get(
          `/delete_chat_box/${"a368b282-dba2-487e-881b-d489f66562bb"}/${
            currentChatBox.id
          }`
        );
        setChatBoxes((prevChatBoxes) =>
          prevChatBoxes.filter((box) => box.id !== currentChatBox.id)
        );
        setCurrentChatBox(null);
        setUserInput([]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditChatBoxName = async (newChatBoxName) => {
    if (currentChatBox) {
      try {
        await axios.post(
          `/edit_chat_box/${"a368b282-dba2-487e-881b-d489f66562bb"}/${
            currentChatBox.id
          }`,
          {
            new_chat_box_name: newChatBoxName,
          }
        );
        setChatBoxes((prevChatBoxes) =>
          prevChatBoxes.map((box) =>
            box.id === currentChatBox.id
              ? { ...box, name: newChatBoxName }
              : box
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditInput = async (conversationId, newQuery) => {
    try {
      const response = await axios.post(
        `/edit_query/${"a368b282-dba2-487e-881b-d489f66562bb"}/${
          currentChatBox.id
        }/${conversationId}`,
        {
          new_query: newQuery,
        }
      );
      fetchChatBoxes();
      selectChatBox(currentChatBox);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSidebar = (state) => {
    setShowing(state);
  };

  const handleSendMessage = async (user_input) => {
    if (user_input.trim() === "") return;

    try {
      setIsLoading(true);
      if (!currentChatBox) {
        // If there is no active chat box, create a new one
        createNewChatBox();
        return;
      }

      setUserInput((prevInput) => [
        ...prevInput,
        { id: "", user_input: user_input, bot_response: "" },
      ]);

      const response = await axios.post("/chat", {
        user_id: "a368b282-dba2-487e-881b-d489f66562bb",
        user_input: user_input,
        current_chat_box: currentChatBox,
      });
      const botResponse = response.data.bot_response;
      const botId = response.data.id;

      // Update the chat box with the bot's response
      setUserInput((prevInput) =>
        prevInput.map((input) => {
          if (input.id === "") {
            return {
              ...input,
              id: botId,
              bot_response: botResponse,
            };
          } else {
            return input;
          }
        })
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const regenerate_response = async () => {
    const updatedObjects = [...userInput];

    const lastObject = updatedObjects[updatedObjects.length - 1];

    try {
      setUserInput((prevUserInput) => {
        const updatedData = prevUserInput.map((obj, index) => {
          if (index === prevUserInput.length - 1) {
            return { ...obj, bot_response: "" }; // Update the desired property (e.g., `value`)
          }
          return obj;
        });
        return updatedData;
      });

      setIsLoading(true);

      const response = await axios.post("/regenerate_response", {
        conversation_id: lastObject.id,
        user_input: lastObject.user_input,
      });
      const botResponse = response.data.bot_response;

      setUserInput((prevUserInput) => {
        const updatedData = prevUserInput.map((obj, index) => {
          if (index === prevUserInput.length - 1) {
            return { ...obj, bot_response: botResponse }; // Update the desired property (e.g., `value`)
          }
          return obj;
        });
        return updatedData;
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchChatBoxes();
  };

  const handlescreenSize = (value) => {
    setScreenSize(value);
  };

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="flex relative overflow-hidden w-full h-full bg-gray-50 dark:bg-[#343541]">
        <div
          className={`flex-shrink-0 overflow-x-hidden z-10 bg-transparent inset-0 sm:w-[270px] md:w-[270px] lg:w-[300px]  ${
            isShowing && screenSize ? "fixed h-full w-[320px] ss:w-[300px]" : "w-0"
          }`}
        >
          <Sidebar
            isSidebarShowing={handleSidebar}
            chatBoxes={chatBoxes}
            setChatBoxes={setChatBoxes}
            currentChatBox={currentChatBox}
            createNewChatBox={createNewChatBox}
            selectChatBox={selectChatBox}
            handleRefresh={handleRefresh}
            handleEditChatBoxName={handleEditChatBoxName}
            handleDeleteChatBox={handleDeleteChatBox}
            handlescreenSize={handlescreenSize}
          />
        </div>
        <div
          className={`${
            isShowing ? "blur-[2px] bg-opacity-75" : "blur-none"
          }relative z-0 flex h-full max-w-full flex-1 overflow-hidden`}
        >
          <div className="flex h-full max-w-full flex-1 flex-col">
            <main
              className={
                "relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1"
              }
            >
              <div className="absolute right-4 top-2 hidden flex-col gap-2 md:flex"></div>
              <Chat
                isShowing={isShowing}
                currentChatBox={currentChatBox}
                handleEditInput={handleEditInput}
                userInput={userInput}
                isLoading={isLoading}
              />
              <Footer
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
                regenerate_response={regenerate_response}
                currentChatBox={currentChatBox}
              />
            </main>
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 top-0 z-[2]"></div>
    </div>
  );
};

export default ChatBox;
