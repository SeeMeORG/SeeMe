/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSelector, useDispatch } from "react-redux";
import {
  setTotalUsers,
  setAvailableUsers,
  joinedUser,
  totalUsers,
  availableUsers,
  setJoindedUser,
} from "../../store/counterSlice";
import { muiTheme } from "../../style/muiTheme";
const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;

interface Heart {
  id: number;
  x: number;
}

export const MainBody = () => {
  const dispatch = useDispatch();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const joinedUserName = useSelector(joinedUser);
  const totalUsersList = useSelector(totalUsers);
  const availUsersList = useSelector(availableUsers);

  const [name, setUserName] = useState("");
  const [hearts, setHearts] = useState<Heart[]>([]);

  const setupPeerEvents = (p: Peer.Instance, ws: WebSocket) => {
    p.on("signal", (signalData) => {
      console.log("Sending signal:", signalData);
      ws?.send(JSON.stringify({ type: "signal", signal: signalData }));
    });

    p.on("stream", (remoteStream) => {
      console.log("Got remote stream => ", remoteVideoRef);
      alert("found remote stream");
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

        socket = new WebSocket(SIGNAL_SERVER_URL);

        socket.onopen = () => {
          console.log("WebSocket connected");
          socket.send(JSON.stringify({ type: "ready", name: joinedUserName }));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("WS message:", data);

          if (data.type === "start") {
            if (peerRef.current) {
              console.warn("Peer already exists, ignoring new start signal.");
              return;
            }

            console.log("Creating new peer. Initiator:", data.initiator);

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
            console.log("Partner disconnected. Destroying peer.");
            if (peerRef.current) {
              peerRef.current.destroy();
              peerRef.current = null;
            }

            socket.send(JSON.stringify({ type: "ready" }));
          }

          if (data.type === "updateUsers") {
            const users = data?.clients ?? [];

            // Exclude self
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

  const spawnHeart = () => {
    const heart = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
    };
    setHearts((prev) => [...prev, heart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, 2000);
  };

  console.log("total users => ", totalUsersList);
  console.log("available users => ", availUsersList);

  const handleJoin = () => {
    if (name.trim()) {
      dispatch(setJoindedUser(name));
    }
  };

  return !joinedUserName ? (
    <Box
      sx={{
        height: "100vh",
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
      <TextField
        variant="outlined"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setUserName(e.target.value)}
        sx={{ bgcolor: muiTheme.palette.text.secondary, borderRadius: 1, mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleJoin}>
        Join Chat
      </Button>
    </Box>
  ) : (
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

        {/* Remote Video */}
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{ border: "2px solid", borderColor: "primary.main" }}
        >
          <Box
            onClick={spawnHeart}
            sx={{
              height: "100%",
              position: "relative",
              backgroundColor: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "pointer",
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

            {/* Floating hearts animation */}
            {hearts.map((heart) => (
              <FavoriteIcon
                key={heart.id}
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: `${heart.x}%`,
                  color: "hotpink",
                  fontSize: 40,
                  animation: "floatUp 2s ease-out forwards",
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Heart Animation Keyframes */}
      <style>{`
      @keyframes floatUp {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-100px) scale(1.3);
          opacity: 0.8;
        }
        100% {
          transform: translateY(-200px) scale(1);
          opacity: 0;
        }
      }
    `}</style>
    </Box>
  );
};
