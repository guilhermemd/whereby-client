import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [meetingId, setMeetingId] = useState("");
  const [meetingData, setMeetingData] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  console.log({ meetingInfo });

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
      saveRoomUrlToLocalStorage(data.roomUrl);
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Whereby Client</h1>
        <button onClick={createMeeting}>Criar Reunião</button>
        {meetingId && (
          <div>
            <p>ID da Reunião: {meetingId}</p>
            {meetingData && (
              <div>
                <p>Nome da Reunião: {meetingInfo.roomName}</p>
                <p>
                  Copie o link e encaminhei para o segundo usuário:{" "}
                  {meetingInfo.roomUrl}
                </p>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
