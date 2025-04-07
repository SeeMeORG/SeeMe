import React, { useEffect, useRef } from "react";
import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";

const SIGNAL_SERVER_URL = "ws://localhost:8080";

export const MainBody = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ws = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });
  };

  useEffect(() => {
    const init = async () => {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      ws.current = new WebSocket(SIGNAL_SERVER_URL);

      ws.current.onopen = () => {
        console.log("Connected to signaling server");
        ws.current.send(JSON.stringify({ type: "ready" }));
      };

      ws.current.onmessage = async (message) => {
        const data = JSON.parse(message.data);

        switch (data.type) {
          case "ready":
            if (!peerConnection.current) {
              createPeerConnection();
              const offer = await peerConnection.current.createOffer();
              await peerConnection.current.setLocalDescription(offer);
              ws.current.send(JSON.stringify({ type: "offer", offer }));
            }
            break;

          case "offer":
            if (!peerConnection.current) createPeerConnection();
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            ws.current.send(JSON.stringify({ type: "answer", answer }));
            break;

          case "answer":
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            break;

          case "candidate":
            if (data.candidate) {
              try {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(data.candidate)
                );
              } catch (err) {
                console.error("Error adding ICE candidate", err);
              }
            }
            break;

          default:
            break;
        }
      };
    };

    init();

    return () => {
      peerConnection.current?.close();
      ws.current?.close();
    };
  }, []);

  return (
    <Box sx={{ height: "92vh", m: 0 }}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid xs={12} sm={12} md={6} sx={{ border: "2px solid", borderColor: "primary.main" }}>
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
            <Box position="absolute" bottom={80} left={12} bgcolor="rgba(0,0,0,0.7)" px={2} py={0.5} borderRadius={2}>
              <Typography color="#fff" fontWeight="bold">You</Typography>
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

        <Grid xs={12} sm={12} md={6} sx={{ border: "2px solid", borderColor: "primary.main" }}>
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
            <Box position="absolute" bottom={80} left={12} bgcolor="rgba(0,0,0,0.7)" px={2} py={0.5} borderRadius={2}>
              <Typography color="#fff" fontWeight="bold">Friend</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
