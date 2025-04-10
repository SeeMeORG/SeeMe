import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const socket = new WebSocket(SIGNAL_SERVER_URL);
        setWs(socket);

        socket.onopen = () => {
          console.log("Connected to signaling server");
          socket.send(JSON.stringify({ type: "ready" }));
        };

        socket.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          console.log("Signal received:", data);

          switch (data.type) {
            case "ready": {
              if (pc) return;

              const isInitiator = !!data.target;
              const newPc = createPeer(socket, stream);
              setPc(newPc);

              if (isInitiator) {
                const offer = await newPc.createOffer();
                await newPc.setLocalDescription(offer);
                socket.send(JSON.stringify({ type: "signal", signal: offer }));
              }
              break;
            }

            case "signal": {
              if (!pc) {
                const newPc = createPeer(socket, stream);
                setPc(newPc);
                await newPc.setRemoteDescription(
                  new RTCSessionDescription(data.signal)
                );

                const answer = await newPc.createAnswer();
                await newPc.setLocalDescription(answer);
                socket.send(JSON.stringify({ type: "signal", signal: answer }));
              } else {
                if (!pc.currentRemoteDescription) {
                  await pc.setRemoteDescription(
                    new RTCSessionDescription(data.signal)
                  );
                } else if (data.signal.candidate) {
                  await pc.addIceCandidate(
                    new RTCIceCandidate(data.signal.candidate)
                  );
                }
              }
              break;
            }

            default:
              break;
          }
        };
      } catch (error) {
        alert("Media error =>" + error);
      }
    };

    init();

    return () => {
      pc?.close();
      ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPeer = (
    socket: WebSocket,
    stream: MediaStream
  ) => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            type: "signal",
            signal: { candidate: event.candidate },
          })
        );
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      console.log("Remote stream received", remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.connectionState);
    };

    return peerConnection;
  };

  return (
    <Box sx={{ height: "92vh", m: 0 }}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{ border: "2px solid", borderColor: "primary.main" }}
        >
          <Box
            sx={{
              height: "100%",
              position: "relative",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "95%",
                height: "90%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <Box
              position="absolute"
              bottom={80}
              left={12}
              bgcolor="rgba(0,0,0,0.7)"
              px={2}
              py={0.5}
              borderRadius={2}
            >
              <Typography color="#fff" fontWeight="bold">
                You
              </Typography>
            </Box>
            <Box
              position="absolute"
              bottom={12}
              left="50%"
              sx={{
                transform: "translateX(-50%)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                px: 2,
                py: 1,
                display: "flex",
                gap: 2,
              }}
            >
              <IconButton sx={{ color: "#fff" }}>
                <Mic fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{ border: "2px solid", borderColor: "primary.main" }}
        >
          <Box
            sx={{
              height: "100%",
              position: "relative",
              backgroundColor: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "95%",
                height: "90%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <Box
              position="absolute"
              bottom={80}
              left={12}
              bgcolor="rgba(0,0,0,0.7)"
              px={2}
              py={0.5}
              borderRadius={2}
            >
              <Typography color="#fff" fontWeight="bold">
                Friend
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
