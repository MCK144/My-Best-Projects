#This is the completed code for my replica of the game Pong
#this project was coding using the Pygame graphics library

import pygame
import random
 
pygame.init()

SW = 650
SH = 500

window = pygame.display.set_mode((SW,SH))
pygame.display.set_caption("Pong")
bgColor = (100,100,100)
play = True

#create a font object
font = pygame.font.SysFont("Arial", 30)

clock = pygame.time.Clock()

PADDLE_WIDTH = 30
PADDLE_HEIGHT = 70

player = pygame.Rect(0,0,PADDLE_WIDTH,PADDLE_HEIGHT)
pColor = (0,0,255)
pSpeed = 5	
pWins = 0		

computer = pygame.Rect(SW-PADDLE_WIDTH,0,PADDLE_WIDTH,PADDLE_HEIGHT)
cColor = (255,0,0)
cSpeed = 5
cWins = 0

bPos = pygame.math.Vector2(SW / 2, SH / 2)
bColor = (255,0,255)
bSize = 20
bSpeed = 4
bDir = pygame.math.Vector2(0,0)
bounce = 0

def restart():
	global bDir
	global bSpeed

	bSpeed = 4
	
	bPos.x = SW / 2
	bPos.y = SH / 2
	
	player.x = 0
	player.y = SH / 2
	
	computer.x = SW - PADDLE_WIDTH
	computer.y = SH / 2

	#point to the right
	bDir.x = 1
	bDir.y = 0
	#generate a random angle
	randAngle = random.randint(-45,45)
	#rotate the direction vector
	bDir = bDir.rotate(randAngle)
	#generate a random number from 1-2
	randNum = random.randint(1,2)
	#randomly point towards the player or computer
	if randNum == 2:
		bDir.x *= -1

def moveBall():
	global bounce 
	
	bPos.x += bDir.x * bSpeed
	bPos.y += bDir.y * bSpeed

	#bouncing off the top and bottom of the screen
	if bPos.y - bSize <= 0:
		bPos.y = bSize
		bDir.y *= -1
		bounce += 1
	elif bPos.y + bSize >= SH:
		bPos.y = SH - bSize		
		bDir.y *= -1		
		bounce += 1

	ballHitbox = pygame.Rect(bPos.x,bPos.y,bSize,bSize)
	
	#bouncing off the paddles
	if player.colliderect(ballHitbox) or computer.colliderect(ballHitbox):
		bDir.x *= -1
		bounce += 1

def movePaddles():
	keys = pygame.key.get_pressed()

	if keys[pygame.K_w]:
		player.y -= pSpeed
	if keys[pygame.K_s]:
		player.y += pSpeed
		
	if computer.y < bPos.y:
		computer.y += cSpeed
	elif computer.y > bPos.y:
		computer.y -= cSpeed 

	if player.y < 0:
		player.y = 0
	elif player.y + player.h > SH:
		player.y = SH - player.h

	if computer.y < 0:
		computer.y = 0
	elif computer.y + computer.h > SH:
		computer.y = SH - computer.h


def update():
	global play
	global cWins
	global pWins
	global bounce
	global bSpeed

	if bounce >= 5:
		bounce = 0
		bSpeed += 2
	
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			play = False
	
	clock.tick(60)

	movePaddles()
	moveBall()

	if bPos.x + bSize < 0:
		cWins += 1
		return True
	elif bPos.x - bSize > SW:
		pWins += 1
		return True
	
	return False
	

def render():
	window.fill(bgColor)
	pygame.draw.rect(window,pColor,player)
	pygame.draw.rect(window,cColor,computer)
	pygame.draw.circle(window,bColor,bPos,bSize)

	score = str(pWins) + ":" + str(cWins) 	
	cyan = (0,255,255)											
	scorePosition = (SW / 2, SH / 2)			
	text = font.render(score,True,cyan)
	window.blit(text,scorePosition)
	
	pygame.display.update()


restart()
 
while play:
	
	if update() == True:
		restart()
		pygame.time.delay(1000)
		
	render()