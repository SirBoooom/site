const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let choice = document.getElementById("choice").value
const num = 100
const subSteps = 6;
const gravity = -0.1
const friction = 0.995
const levelBounce = 0.5
const colliderRadius = innerHeight/2.3
const mouseRadius = 100
const mouseLift = 1

let balls = []
let current
let other
let mouseX
let mouseY
let spacePressed

canvas.width = innerWidth
canvas.height = innerHeight  

function random(min, max){
   let result = Math.random() * (max - min) + min; //copied this code (sorry)
   return result
}

function randomColor(){
   return Math.floor(Math.random()*16777215).toString(16); //100% copied this code (sorry)
}

document.addEventListener('keydown', event => {
   if (event.code === 'Space') {
     spacePressed=1
   }
 }) //copied
 document.addEventListener('keyup', event => {
   if (event.code === 'Space') {
     spacePressed=0
   }
 }) //copied

let handleMousemove = (event) => {
   mouseX=event.x
   mouseY=event.y
};

document.addEventListener('mousemove', handleMousemove);

class Ball{
   constructor(x, y, radius, color, vx, vy){
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.vx = vx
      this.vy = vy
      this.mass = 3.14*(radius*radius)
   }

   draw(){
      //draw circle of specified radius and colour
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
      c.fillStyle = this.color
      c.fill()
   }
}

//Create the balls in list
for (let index = 0; index < num; index++) {
   balls.push(new Ball(random(0,canvas.width), random(0,canvas.height), random(15, 30), '#' + randomColor(), random(-5, 5), random(-5, 5)))
}

function collisions(){
   //ball collisions
   for (let index = 0; index < balls.length; index++) {
      const current = balls[index]

      for (let j = 0; j < balls.length; j++) {
         if (index !== j) { //avoid self-collision
            const other = balls[j]
            
            const distanceX = current.x - other.x
            const distanceY = current.y - other.y
            const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY))


            if(distance<current.radius+other.radius){
               //minimise overlap code
               const overlap = (current.radius + other.radius) - distance
               const unitX = distanceX / distance
               const unitY = distanceY / distance

               const displacementX = unitX * overlap / 2
               const displacementY = unitY * overlap / 2

               current.x += displacementX
               current.y += displacementY
               other.x -= displacementX
               other.y -= displacementY
               
               //momentum and bounce stuff
               const relativeVelX = current.vx - other.vx;
               const relativeVelY = current.vy - other.vy;

               const dotProduct = relativeVelX * unitX + relativeVelY * unitY;

               const impulse = (2 * dotProduct) / (current.mass + other.mass);

               current.vx -= impulse * other.mass * unitX;
               current.vy -= impulse * other.mass * unitY;
               other.vx += impulse * current.mass * unitX;
               other.vy += impulse * current.mass * unitY;
            }
         }
      }

   }

   let choice = document.getElementById("choice").value
   //border collisions
   if(choice=="on"||choice=="off"){
      if(current.y>canvas.height-current.radius){
         current.vy=-current.vy*levelBounce
         current.y = canvas.height-current.radius
      }

      if(current.y<current.radius){
         current.vy=current.vy*levelBounce
         current.y = current.radius
      }

      if(current.x<0+current.radius){
         current.vx=-current.vx*levelBounce
         current.x = 0+current.radius
      }

      if(current.x>canvas.width-current.radius){
         current.vx=-current.vx*levelBounce
         current.x = canvas.width-current.radius
      }
   }else{
      let fromCircleToPointX = current.x - innerWidth/2;
      let fromCircleToPointY = current.y - innerHeight/2;
      let distance = Math.sqrt(fromCircleToPointX * fromCircleToPointX + fromCircleToPointY * fromCircleToPointY);

      if (distance > colliderRadius) {
         current.x = innerWidth/2 + (fromCircleToPointX * colliderRadius) / distance;
         current.y = innerHeight/2 + (fromCircleToPointY * colliderRadius) / distance;
         // Calculate the unit normal vector of the circle at the point of intersection
         const unitX = fromCircleToPointX / distance;
         const unitY = fromCircleToPointY / distance;

         // Calculate the dot product of velocity and the normal vector
         const dotProduct = current.vx * unitX + current.vy * unitY;

         current.vx -= levelBounce * dotProduct * unitX;
         current.vy -= levelBounce * dotProduct * unitY;
      }
   }  
}

function update(){
   c.clearRect(0, 0, canvas.width, canvas.height)

   //physics
   for (let index = 0;   index < balls.length; index++) {
      current = balls[index]

      current.vy -= gravity
      
      let choice = document.getElementById("choice").value
      //lava lamp stuff
      if (choice == "on") {
         if(current.x>(canvas.width/5)*2&&current.x<(canvas.width/5)*3){
            if(current.y<canvas.height/2){
               current.vy=-3
               current.vx+=(current.x-(canvas.width/2))/500
            }else{
               current.vy=-3
            }
         }else{
            current.vx-=(current.x-(canvas.width/2))/30000
         } 
      }

      let fromCircleToPointX = current.x - mouseX
      let fromCircleToPointY = current.y - mouseY
      let distance = Math.sqrt(fromCircleToPointX * fromCircleToPointX + fromCircleToPointY * fromCircleToPointY);
      console.log(mouseX)
      console.log(mouseY)
      console.log(distance)
      //mouse lift
      if(distance<mouseRadius&&spacePressed==1){
         current.vy-=mouseLift
      }
      if(spacePressed==1){
         c.beginPath()
         c.arc(mouseX, mouseY, mouseRadius, 0, Math.PI*2, false)
         c.fillStyle = "#F5EBE9"
         c.fill()
      }
      
      //friction
      current.vx *= friction
      current.vy *= friction

      current.x += current.vx
      current.y += current.vy
      
      for (let index = 0; index < subSteps; index++) {
         collisions()
      }    
   }

   //cool trail
   // c.fillStyle = "rgba(255, 255, 255, 0.2)";
   // c.fillRect(0, 0, canvas.width, canvas.height);

   let choice = document.getElementById("choice").value
   if(choice=="border"){
      //draw circle
      c.beginPath()
      c.arc(innerWidth/2, innerHeight/2, colliderRadius, 0, Math.PI*2, false)
      c.stroke()
   }

   //Loop through list and draw each ball
   for (let index = 0; index < balls.length; index++) {
      balls[index].draw()
   }
   window.requestAnimationFrame(update)
}

update()