/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import Peer from "simple-peer";
import { GenericLoader } from "../../shared/GenericComponents";
import { GVideo } from "../../shared/GVideo";
import { IUser } from "../../shared/interface";
import {
  joinedUser,
  setAvailableUsers,
  setJoindedUser,
  setTotalUsers,
  setWSLoader,
  wsGlobalLoader,
} from "../../store/userSlice";
import { muiTheme } from "../../style/muiTheme";
import { StyledNameContainer } from "../../style/CommonStyles";
const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

export const MainBody = () => {
  const dispatch = useDispatch();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const joinedUserName = useSelector(joinedUser);
  const wsLoader = useSelector(wsGlobalLoader);

  const [name, setUserName] = useState("");
  const [targetName, setTargetName] = useState(null);
  const [remoteLoader, setRemoteLoader] = useState(true);
  const [hasPermissions, setPermissions] = useState(true);
  const [enableValidation, setEnableValidation] = useState(false);
  const [socketConnection, setSocketConnection] = useState<WebSocket>();

  const setupPeerEvents = useCallback((p: Peer.Instance, ws: WebSocket) => {
    p.on("signal", (signalData) => {
      ws?.send(JSON.stringify({ type: "signal", signal: signalData }));
    });

    p.on("stream", (remoteStream) => {
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
  }, []);

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

        dispatch(setWSLoader(true));
        socket = new WebSocket(SIGNAL_SERVER_URL);
        setSocketConnection(socket);

        socket.onopen = () => {
          dispatch(setWSLoader(false));
          socket.send(JSON.stringify({ type: "ready", name: joinedUserName }));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "start") {
            setRemoteLoader(true);
            setTargetName(data.targetName);
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
            setTargetName(null);
          }

          if (data.type === "updateUsers") {
            const users = data?.clients ?? [];

            const otherUsers = users.filter(
              (user: IUser) => user.id !== joinedUserName
            );

            const avail = otherUsers?.filter(
              (user: IUser) => user?.available
            )?.length;

            dispatch(setTotalUsers(otherUsers?.length ?? 0));
            dispatch(setAvailableUsers(avail ?? 0));
          }
        };
      } catch (error) {
        console.error("Media error => ", error);
        setPermissions(false);
        dispatch(setWSLoader(false));
      }
    };

    init();

    return () => {
      peerRef.current?.destroy();
      socket?.close();
    };
  }, [joinedUserName]);

  const handleJoin = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName?.length) {
      setEnableValidation(true);
    }

    if (trimmedName) {
      dispatch(setJoindedUser(name));
    }
  }, [name]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val?.length) {
      setEnableValidation(true);
    } else {
      setEnableValidation(false);
    }

    setUserName(val);
  }, []);

  const handleNext = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setRemoteLoader(true);
    setTargetName(null);

    if (socketConnection && socketConnection.readyState === WebSocket.OPEN) {
      socketConnection.send(JSON.stringify({ type: "next" }));
    }
  }, [socketConnection]);

  return (
    <Box sx={{ height: "calc(100vh - 66px)", m: 0 }}>
      {!joinedUserName ? (
        <StyledNameContainer>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
              mb={2}
            >
              <TextField
                autoFocus
                variant="outlined"
                placeholder="Enter Your Name"
                error={enableValidation}
                value={name}
                onChange={handleChange}
                sx={{
                  bgcolor: muiTheme.palette.text.secondary,
                  borderRadius: 1,
                }}
              />
              {enableValidation && (
                <Typography variant="caption" color="error">
                  Name is required.
                </Typography>
              )}
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Form>
        </StyledNameContainer>
      ) : !hasPermissions ? (
        <Box
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" color="error">
            Camera and Mike permissions are required.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: "100%", m: 0, position: "relative" }}>
          {wsLoader && <GenericLoader text="Connecting to the server..." />}
          <Grid
            container
            spacing={0}
            sx={{ height: "100%", display: wsLoader ? "none" : "" }}
          >
            <GVideo
              videoRef={remoteVideoRef}
              label={targetName ?? "Friend"}
              isLoading={remoteLoader}
            />
            <GVideo isMuted videoRef={localVideoRef} label="You" />
          </Grid>
          {joinedUserName && !wsLoader && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: 10,
              }}
            >
              <Button
                variant="contained"
                disabled={remoteLoader}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
