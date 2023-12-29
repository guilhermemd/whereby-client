import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import IconButton from "./IconButton";
import ChatInput from "./ChatInput";
import { useRoomConnection } from "@whereby.com/browser-sdk/react";

function Main() {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);
  const [isLocalScreenshareActive, setIsLocalScreenshareActive] =
    useState(false);

  const chatMessageBottomRef = useRef(null);

  const roomConnection = useRoomConnection(localStorage.getItem("roomUrl"), {
    localMediaOptions: {
      audio: true,
      video: true,
    },
  });

  const { state, components, actions } = roomConnection;
  const { localParticipant, remoteParticipants, screenshares, chatMessages } =
    state;
  const { VideoView } = components;
  const {
    toggleCamera,
    toggleMicrophone,
    startScreenshare,
    stopScreenshare,
    sendChatMessage,
  } = actions;

  function getDisplayName(id) {
    return remoteParticipants.find((p) => p.id === id)?.displayName || "Guest";
  }

  function scrollToBottom() {
    chatMessageBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="App">
      <div className="left-section">
        <div className="chat-wrapper">
          {chatMessages.map((message) => (
            <>
              <p className="chat-message">{message.text}</p>
              <p className="chat-message-name">
                {getDisplayName(message.senderId)}
              </p>
            </>
          ))}
          <div ref={chatMessageBottomRef} />
        </div>
        {localParticipant?.stream ? (
          <div className="self-view-wrapper">
            <VideoView mirror muted stream={localParticipant.stream} />
            <p className="self-name">You</p>
          </div>
        ) : null}

        <ChatInput sendChatMessage={sendChatMessage} />
      </div>

      <div className="video-stage">
        {remoteParticipants[0]?.stream ? (
          <div
            className={
              screenshares.length ? "remote-view-small" : "remote-view-wrapper"
            }
          >
            <VideoView stream={remoteParticipants[0].stream} />
            <p
              className={
                screenshares.length ? "screenshare-remote-name" : "remote-name"
              }
            >
              {remoteParticipants[0].displayName}
            </p>
          </div>
        ) : null}
        {screenshares[0]?.stream ? (
          <div className="screenshare-view-wrapper">
            <VideoView stream={screenshares[0].stream} />
          </div>
        ) : null}
      </div>

      <div className="control-wrapper">
        <div className="buttons">
          <IconButton
            variant="camera"
            onClick={() => {
              setIsCameraActive((prev) => !prev);
              toggleCamera();
            }}
            isActive={isCameraActive}
          >
            Cam
          </IconButton>
          <IconButton
            variant="microphone"
            onClick={() => {
              setIsMicrophoneActive((prev) => !prev);
              toggleMicrophone();
            }}
            isActive={isMicrophoneActive}
          >
            Mic
          </IconButton>
          <IconButton
            variant="share"
            onClick={() => {
              if (isLocalScreenshareActive) {
                stopScreenshare();
              } else {
                startScreenshare();
              }
              setIsLocalScreenshareActive((prev) => !prev);
            }}
            isActive={isLocalScreenshareActive}
          >
            {isLocalScreenshareActive ? "Stop" : "Share"}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Main;
