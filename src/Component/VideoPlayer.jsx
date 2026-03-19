import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // ✅ FIX 1: Use correct BASE_URL
  const BASE_URL = "http://localhost:5000/streams";

  const availableResolutions = [
    { label: "360p", src: `${BASE_URL}/${videoId}/360p/index.m3u8` },
    { label: "480p", src: `${BASE_URL}/${videoId}/480p/index.m3u8` },
    { label: "720p", src: `${BASE_URL}/${videoId}/720p/index.m3u8` },
    { label: "1080p", src: `${BASE_URL}/${videoId}/1080p/index.m3u8` },
  ];

  const options = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    sources: [
      {
        // ✅ FIX 2: use working source (NOT master.m3u8)
        src: `${BASE_URL}/${videoId}/360p/index.m3u8`,
        type: "application/x-mpegURL",
      },
    ],
  };

  const changeResolution = (player, src) => {
    const currentTime = player.currentTime();

    player.src({
      src,
      type: "application/x-mpegURL",
    });

    player.ready(() => {
      player.currentTime(currentTime);
      player.play();
    });
  };

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options));

      player.on("error", () => {
        console.log("VIDEO ERROR:", player.error());
      });

      player.ready(() => {
        const MenuButton = videojs.getComponent("MenuButton");
        const MenuItem = videojs.getComponent("MenuItem");

        class ResolutionMenuItem extends MenuItem {
          constructor(player, options) {
            super(player, options);
            this.src = options.src;
          }

          handleClick() {
            changeResolution(player, this.src);
          }
        }

        class ResolutionMenuButton extends MenuButton {
          constructor(player, options) {
            super(player, options);
            this.controlText("Resolution");
          }

          buildCSSClass() {
            return `vjs-icon-cog vjs-menu-button ${super.buildCSSClass()}`;
          }

          createItems() {
            return availableResolutions.map((res) => {
              return new ResolutionMenuItem(player, {
                label: res.label,
                src: res.src,
              });
            });
          }
        }

        videojs.registerComponent(
          "ResolutionMenuButton",
          ResolutionMenuButton
        );

        player.getChild("ControlBar").addChild(
          "ResolutionMenuButton",
          {},
          10
        );
      });
    } else {
      const player = playerRef.current;

      player.src({
        src: `${BASE_URL}/${videoId}/360p/index.m3u8`,
        type: "application/x-mpegURL",
      });
    }
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <style>
        {`
        .video-js {
          border-radius: 14px;
          overflow: hidden;
        }

        .video-js video {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }

        .vjs-control-bar {
          background: rgba(0,0,0,0.6) !important;
        }

        .vjs-menu-button-popup .vjs-menu {
          background: #1f1f1f;
          border-radius: 8px;
        }

        .vjs-menu li {
          color: white;
        }

        .vjs-menu li:hover {
          background: #2a2a2a;
        }

        .vjs-icon-cog:before {
          color: white;
        }
        `}
      </style>

      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1000px",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },
};

export default VideoPlayer;