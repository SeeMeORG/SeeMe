/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import {
  joinedUser,
  setAvailableUsers,
  setJoindedUser,
  setTotalUsers,
} from "../../store/userSlice";
import { muiTheme } from "../../style/muiTheme";
import { GenericLoader } from "../../shared/GenericComponents";
import { Form } from "react-router-dom";
const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody = () => {
  const dispatch = useDispatch();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const joinedUserName = useSelector(joinedUser);

  const [name, setUserName] = useState("");
  const [remoteLoader, setRemoteLoader] = useState(true);
  const [wsLoader, setWSLoader] = useState(true);

  const setupPeerEvents = (p: Peer.Instance, ws: WebSocket) => {
    p.on("signal", (signalData) => {
      ws?.send(JSON.stringify({ type: "signal", signal: signalData }));
    });

    p.on("stream", (remoteStream) => {
      alert("मनु जग्गी जिंदाबाद...");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setRemoteLoader(false);
    });
    p.on("error", (err) => {
      console.error("Peer error:", err);
    });

    p.on("close", () => {
      console.warn("Peer connection closed");
      setRemoteLoader(true);
    });
  };

  useEffect(() => {
    if (!joinedUserName) return;
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

        setWSLoader(true);
        socket = new WebSocket(SIGNAL_SERVER_URL);

        socket.onopen = () => {
          setWSLoader(false);
          socket.send(JSON.stringify({ type: "ready", name: joinedUserName }));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "start") {
            setRemoteLoader(true);
            if (peerRef.current) {
              console.warn("Peer already exists, ignoring new start signal.");
              return;
            }

            const newPeer = new Peer({
              initiator: data.initiator,
              trickle: false,
              stream,
            });

            setupPeerEvents(newPeer, socket);
            peerRef.current = newPeer;
          }

          if (data.type === "signal") {
            if (!peerRef.current || peerRef.current.destroyed) {
              console.warn("No active peer for signal, ignoring.");
              return;
            }

            try {
              peerRef.current.signal(data.signal);
            } catch (err) {
              console.error("Failed to apply signal:", err);
            }
          }

          if (data.type === "partner_disconnected") {
            if (peerRef.current) {
              peerRef.current.destroy();
              peerRef.current = null;
            }
            setRemoteLoader(true);
            socket.send(JSON.stringify({ type: "ready" }));
          }

          if (data.type === "updateUsers") {
            const users = data?.clients ?? [];

            const otherUsers = users.filter(
              (user: any) => user.id !== joinedUserName
            );

            const avail = otherUsers?.filter(
              (user: any) => user?.available
            )?.length;

            dispatch(setTotalUsers(otherUsers?.length ?? 0));
            dispatch(setAvailableUsers(avail ?? 0));
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
  }, [joinedUserName]);

  const handleJoin = () => {
    if (name.trim()) {
      dispatch(setJoindedUser(name));
    }
  };

  return (
    <Box sx={{ height: "calc(100vh - 66px)", m: 0 }}>
      {!joinedUserName ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "#111",
            color: "#fff",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Enter Your Name
          </Typography>
          <Form
            onSubmit={handleJoin}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              autoFocus
              variant="outlined"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setUserName(e.target.value)}
              sx={{
                bgcolor: muiTheme.palette.text.secondary,
                borderRadius: 1,
                mb: 2,
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Form>
        </Box>
      ) : (
        <Box sx={{ height: "100%", m: 0 }}>
          {wsLoader && <GenericLoader text="Connecting to the server..." />}
          <Grid
            container
            spacing={0}
            sx={{ height: "100%", display: wsLoader ? "none" : "" }}
          >
            <Grid
              size={{ xs: 12, sm: 12, md: 6 }}
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                height: { xs: "50%", sm: "50%", md: "100%" },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  position: "relative",
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
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  position="absolute"
                  bottom={80}
                  left={12}
                  bgcolor="rgba(0,0,0,0.5)"
                  px={2}
                  py={0.5}
                  borderRadius={2}
                  sx={{
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography color="#fff" fontWeight="bold">
                    You
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 12, md: 6 }}
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                height: { xs: "50%", sm: "50%", md: "100%" },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {remoteLoader && (
                  <GenericLoader
                    text={
                      joinedUser.length === 1
                        ? "Finding Someone you..."
                        : "Connecting with other..."
                    }
                  />
                )}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: remoteLoader ? "none" : "block",
                  }}
                />
                <Box
                  position="absolute"
                  bottom={80}
                  left={12}
                  bgcolor="rgba(0,0,0,0.5)"
                  px={2}
                  py={0.5}
                  borderRadius={2}
                  sx={{
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography color="#fff" fontWeight="bold">
                    Friend
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};
