import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";

const Speech = () => {
  const [microphoneAccess, setMicrophoneAccess] = useState(false);

  useEffect(() => {
    requestMicrophoneAccess();
  }, []);

  const requestMicrophoneAccess = async () => {
    try {
      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set the microphoneAccess state to true if access was granted
      setMicrophoneAccess(true);

      // Stop the stream to free up resources
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      // Log any errors to the console
      console.error("Error requesting microphone access:", error);
    }
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support Speech to Text</span>;
  }

  return (
    <div className="h-screen w-screen bg-pink-100 flex flex-col items-center justify-center text-lg text-black gap-4">
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        className="p-4 w-[100px] rounded-md bg-blue-400 hover:opacity-50"
        onClick={SpeechRecognition.startListening}
      >
        Start
      </button>
      <button
        className="p-4 w-[100px] rounded-md bg-blue-400 hover:opacity-50"
        onClick={SpeechRecognition.stopListening}
      >
        Stop
      </button>
      <button
        className="p-4 w-[100px] rounded-md bg-blue-400 hover:opacity-50"
        onClick={resetTranscript}
      >
        Reset
      </button>
      <p>{transcript}</p>
      {microphoneAccess ? (
        <p>Microphone access granted!</p>
      ) : (
        <p>Microphone access not granted!</p>
      )}
    </div>
  );
};

export default Speech;
