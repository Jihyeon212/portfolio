const quizUrl = new URL("who-am-i.html", window.location.href).href;
const qrImage = document.querySelector("[data-qr-image]");
if (qrImage) {
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=" + encodeURIComponent(quizUrl);
}
