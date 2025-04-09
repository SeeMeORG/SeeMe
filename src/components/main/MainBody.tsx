/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const setupPeerEvents = (currentPeer: Peer.Instance, socket: WebSocket) => {
    console.log("currentPeer => ", currentPeer, socket);

    currentPeer.on("signal", (signalData: any) => {
      console.log("Sending signal:", signalData);
      socket.send(JSON.stringify({ type: "signal", signal: signalData }));
    });

    currentPeer.on("stream", (remoteStream: MediaStream) => {
      console.log("Received remote stream", remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    currentPeer.on("error", (err: any) => {
      console.error("Peer error:", err);
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const socket = new WebSocket(SIGNAL_SERVER_URL);
        setWs(socket);

        socket.onopen = () => {
          console.log("Connected to signaling server");
          socket.send(JSON.stringify({ type: "ready" }));
        };

        socket.onmessage = async (message) => {
          const data = JSON.parse(message.data);
          console.log("Received:", data, peer);

          if (!localStream) return;

          switch (data.type) {
            case "ready": {
              if (peer) return; // already connected

              const isInitiator = !!data.target;
              const newPeer = new Peer({
                initiator: isInitiator,
                trickle: false,
                stream: localStream,
              });

              console.log("check point 1 => ", newPeer);
              setupPeerEvents(newPeer, socket);
              console.log("check point 2 => ");
              setPeer(newPeer);
              break;
            }

            case "signal": {
              if (!peer) {
                const newPeer = new Peer({
                  initiator: false,
                  trickle: false,
                  stream: localStream,
                });

                setPeer(newPeer);
                setupPeerEvents(newPeer, socket);
                newPeer.signal(data.signal);
              } else {
                peer.signal(data.signal);
              }
              break;
            }

            default:
              break;
          }
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    init();

    return () => {
      if (peer && typeof peer.destroy === "function") {
        peer.destroy();
      }
      if (ws && typeof ws.close === "function") {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
