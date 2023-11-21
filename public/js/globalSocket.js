let isErrorOccured = false;
const socket = io(game, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("[Socket.IO] Connected to server");
  if (isErrorOccured) {
    iziToast.success({
      title: "Connected",
      message: socketi18n.connected,
      timeout: 2000,
      layout: 2,
      transitionIn: "fadeInLeft",
    });
  }
});

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    alert(socketi18n.error);
    window.location.href = `${api}/auth/logout?redirect=true`; // Session error, need to relogin
  } else if (reason === "io client disconnect") return;
  console.error("[Socket.IO] Disconnected from server");
  iziToast.warning({
    title: "Disconnected",
    message: socketi18n.reconnecting,
    timeout: 2000,
    layout: 2,
    transitionIn: "fadeInLeft",
  });
  isErrorOccured = true;
});

socket.on("connect_error", () => {
  console.error("[Socket.IO] Cannot connect to server");
  iziToast.error({
    title: "Connection error",
    message: socketi18n.reconnecting,
    timeout: 2000,
    layout: 2,
    transitionIn: "fadeInLeft",
  });
  setTimeout(() => {
    socket.connect();
  }, 1000);
  isErrorOccured = true;
});

socket.on("connection:conflict", () => {
  socket.disconnect();
  alert(socketi18n.conflict);
  window.location.href = `${api}/auth/logout?redirect=true`;
});

socket.on("connection:unauthorized", () => {
  socket.disconnect();
  alert(socketi18n.unauthorized);
  window.location.href = `${api}/auth/logout?redirect=true`;
});

socket.on("pong", () => {
  console.log("[Socket.IO] Pong");
});

socket.on("achievement", (data) => {
  console.log("[Socket.IO] Achievement");
  console.log(data);
});

const ping = setInterval(() => {
  console.log("[Socket.IO] Ping");
  socket.emit("ping");
}, 5000);
