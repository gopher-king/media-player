import VideoPlayer from "@media/player";
import "./index.scss";
// import Hls from "hls.js";

// console.log(a);

const player = new VideoPlayer({
  el: ".container",
  videoList: [
    // {
    //   label: "高清",
    //   url: "https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8"
    // },
    {
      label: "高清",
      url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
    }
  ]
  // customType(videoElement, videoObj) {
  //   const hls = new Hls();
  //   hls.loadSource(videoObj.url);
  //   hls.attachMedia(videoElement);
  // }
});

const destroyButton = document.querySelector(".destroy");

destroyButton?.addEventListener("click", function () {
  player.destroy();
});
