import React, { useEffect, useRef } from "react";
import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";

const SIGNAL_SERVER_URL = "ws://localhost:8080";

export const MainBody = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const ws = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    const start = async () => {
      // Get local camera/mic
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      ws.current = new WebSocket(SIGNAL_SERVER_URL);

      ws.current.onmessage = async (message) => {
        const data = JSON.parse(message.data);

        if (data.offer) {
          await createPeer(false);
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          ws.current.send(JSON.stringify({ answer }));
        } else if (data.answer) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } else if (data.candidate) {
          try {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          } catch (err) {
            console.error("Error adding ICE candidate", err);
          }
        }
      };

      ws.current.onopen = async () => {
        await createPeer(true);
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        ws.current.send(JSON.stringify({ offer }));
      };
    };

    const createPeer = async () => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // ✅ STUN added here
          },
        ],
      });

      // Send ICE candidates to peer
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          ws.current.send(JSON.stringify({ candidate: event.candidate }));
        }
      };

      // Receive remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Add local stream to connection
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });
    };

    start();

    return () => {
      ws.current?.close();
      peerConnection.current?.close();
    };
  }, []);

  return (
    <Box sx={{ height: "92vh", m: 0 }}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        {/* Local Video */}
        <Grid size={{xs:12, sm:12, md:6}} sx={{border: "2px solid", borderColor: "primary.main"}}>
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
              style={{ width: "95%", height: "90%", objectFit: "cover", borderRadius: "10px" }}
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

        {/* Remote Video */}
        <Grid size={{xs:12, sm:12, md:6}} sx={{border: "2px solid", borderColor: "primary.main"}}>
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
              style={{ width: "95%", height: "90%", objectFit: "cover", borderRadius: "10px" }}
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
