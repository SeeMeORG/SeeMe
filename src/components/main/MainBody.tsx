import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import Peer from "simple-peer";

const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const peerRef = useRef<Peer.Instance | null>(null); // ✅ Add ref for stable peer access

  const setupPeerEvents = (p: Peer.Instance, ws: WebSocket) => {
    p.on("signal", (signalData) => {
      console.log("Sending signal:", signalData);
      ws?.send(JSON.stringify({ type: "signal", signal: signalData }));
    });

    p.on("stream", (remoteStream) => {
      console.log("Got remote stream");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    p.on("error", (err) => {
      console.error("Peer error:", err);
    });

    p.on("close", () => {
      console.log("Peer connection closed");
    });
  };

  useEffect(() => {
    let stream: MediaStream;
    let socket: WebSocket;

    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket = new WebSocket(SIGNAL_SERVER_URL);

        socket.onopen = () => {
          console.log("WebSocket connected");
          socket.send(JSON.stringify({ type: "ready" }));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("WS message:", data);

          if (data.type === "start") {
            if (peerRef.current) return; // ✅ Avoid duplicate creation

            const newPeer = new Peer({
              initiator: data.initiator,
              trickle: false,
              stream,
            });

            setupPeerEvents(newPeer, socket);
            peerRef.current = newPeer;
          }

          if (data.type === "signal") {
            console.log("Received signal:", data.signal);

            if (!peerRef.current) {
              const newPeer = new Peer({
                initiator: false,
                trickle: false,
                stream,
              });

              setupPeerEvents(newPeer, socket);
              peerRef.current = newPeer;

              newPeer.signal(data.signal);
            } else {
              try {
                peerRef.current.signal(data.signal);
              } catch (err) {
                console.error("Signal application error:", err);
              }
            }
          }
        };
      } catch (error) {
        alert("Media error =>" + error);
      }
    };

    init();

    return () => {
      peerRef.current?.destroy();
      socket?.close();
    };
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
