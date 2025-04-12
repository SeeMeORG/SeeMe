import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useRef,useState } from "react";
import Peer from "simple-peer";
import FavoriteIcon from "@mui/icons-material/Favorite";
const SIGNAL_SERVER_URL = import.meta.env.VITE_API_URL;
interface Heart {
  id: number;
  x: number;
}
export const MainBody = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [hearts, setHearts] = useState<Heart[]>([]);
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
      <Grid size={{xs:12, sm:12, md:6}} sx={{border: "2px solid", borderColor: "primary.main"}}>
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
