const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight-150

const image = new Image();
image.src = "../images/bacon.png";

let angle = 0;
let mouseX = canvas.width/2;
let mouseY = canvas.height/2;

window.addEventListener("mousemove", (event) => {
   mouseX = event.clientX - canvas.getBoundingClientRect().left;
   mouseY = event.clientY - canvas.getBoundingClientRect().top;
});

function draw() {
   ctx.fillStyle = "rgba(255, 255, 255, 0.005)";
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   ctx.save();
   ctx.translate(mouseX, mouseY);
   ctx.rotate((angle * Math.PI) / 180);
   ctx.drawImage(image, -image.width / 2, -image.height / 2);
   ctx.restore();
   angle += 0.8;
   requestAnimationFrame(draw);
}

image.onload = function () {
   draw()
};

window.onresize = () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight-150;
};