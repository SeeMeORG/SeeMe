/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mic } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";

const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const peer = useRef<SimplePeer.Instance | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get user media
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        // Connect to signaling server
        ws.current = new WebSocket(SIGNAL_SERVER_URL);

        ws.current.onopen = () => {
          console.log("Connected to signaling server");
          ws.current?.send(JSON.stringify({ type: "ready" }));
        };

        ws.current.onmessage = async (message) => {
          const data = JSON.parse(message.data);

          switch (data.type) {
            case "ready":
              if (!peer.current) {
                // This peer initiates
                peer.current = new SimplePeer({
                  initiator: true,
                  trickle: false,
                  stream: localStream.current!,
                });
                setupPeerEvents();
              }
              break;

            case "signal":
              if (!peer.current) {
                // This peer responds
                peer.current = new SimplePeer({
                  initiator: false,
                  trickle: false,
                  stream: localStream.current!,
                });
                setupPeerEvents();
              }
              peer.current.signal(data.signal);
              break;

            default:
              break;
          }
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    const setupPeerEvents = () => {
      if (!peer.current) return;

      peer.current.on("signal", (signalData: any) => {
        // Send SDP or ICE candidates
        ws.current?.send(
          JSON.stringify({ type: "signal", signal: signalData })
        );
      });

      peer.current.on("stream", (stream: any) => {
        // Got remote stream
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      peer.current.on("error", (err: any) => {
        console.error("Peer error:", err);
      });
    };

    init();

    return () => {
      peer.current?.destroy();
      ws.current?.close();
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
