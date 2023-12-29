import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const [meetingId, setMeetingId] = useState("");
  const [meetingData, setMeetingData] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);

  const saveRoomUrlToLocalStorage = useCallback(
    (roomUrl) => {
      localStorage.setItem("roomUrl", roomUrl);
    },
    [meetingInfo]
  );

  const createMeeting = async () => {
    try {
      const response = await fetch("http://localhost:8000/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMeetingId(data.meetingId);
      setMeetingInfo(data);
      saveRoomUrlToLocalStorage(data.hostRoomUrl);
    } catch (error) {
      console.error("Erro ao criar reunião", error);
    }
  };

  const getMeetingData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/get-meeting/${meetingId}`
      );
      const data = await response.json();
      setMeetingData(data);
    } catch (error) {
      console.error("Erro ao obter informações da reunião", error);
    }
  };

  useEffect(() => {
    if (meetingId) {
      getMeetingData();
    }
  }, [meetingId]);

  const inputRef = useRef(null);

  const navigate = useNavigate();
  const handleSaveClick = () => {
    const roomUrl = inputRef.current.value.trim();

    saveRoomUrlToLocalStorage(roomUrl);
    const regex = /https:\/\/g-teste\.whereby\.com/;

    if (regex.test(roomUrl)) {
      navigate("/main");
    } else {
      alert("Please enter a valid room URL");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Whereby Client</h1>
        {meetingId ? null : (
          <div>
            <button onClick={createMeeting}>Create Meeting</button>
            <p>or</p>
            <input type="text" ref={inputRef} placeholder="Enter Room URL" />
            <button onClick={handleSaveClick}>Go to the meeting room</button>
          </div>
        )}

        {meetingId && (
          <div>
            <p>Copy the link and forward it to the second user:</p>
            {meetingData && (
              <div>
                <p>{meetingInfo.roomUrl}</p>
                <button type="button" onClick={() => navigate("/main")}>
                  Go To The meeting Room
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
