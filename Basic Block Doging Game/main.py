import pygame
import random
import time

pygame.init()

#window data
WIN_DIMS = (700,500)
window = pygame.display.set_mode(WIN_DIMS)
pygame.display.set_caption("Block Game")
bgcolor = (160,160,160)
play = True

clock = pygame.time.Clock()
FPS = 60

#player data
playerColor = (255,0,0)
playerSize = 50
playerSpeed = 10
startX = 20
player = pygame.Rect(20,WIN_DIMS[1] // 2 - playerSize // 2,playerSize,playerSize)

#obstacle data
obstacleColor = (0,255,0)
obstacleSize = 80
randY = random.randint(0,WIN_DIMS[1]-obstacleSize)
obstacle = pygame.Rect(WIN_DIMS[0],randY,obstacleSize,obstacleSize)
obstacleSpeed = 15

def resetObstacle():
    obstacle.x = WIN_DIMS[0]
    obstacle.y = random.randint(0,WIN_DIMS[1]-obstacleSize)

def update():
    global play

    clock.tick(FPS)

    obstacle.x -= obstacleSpeed

    if obstacle.x <= -obstacleSize:
       resetObstacle()

    for event in pygame.event.get():
        #if event.type == pygame.KEYDOWN:
        #    if event.key == pygame.K_w:
        #        player.y -= playerSpeed
        #    elif event.key == pygame.K_s:
        #        player.y += playerSpeed
        if event.type == pygame.QUIT:
            play = False

    keys = pygame.key.get_pressed()

    if keys[pygame.K_w]:
        player.y -= playerSpeed
    if keys[pygame.K_s]:
        player.y += playerSpeed



    if player.colliderect(obstacle):
        render((100,0,0))
        time.sleep(1)
        resetObstacle()
        player.y = WIN_DIMS[1]//2 + player.h // 2

def render(backgroundColor):
    window.fill(backgroundColor)
    pygame.draw.rect(window, playerColor, player)
    pygame.draw.rect(window,obstacleColor,obstacle)
    pygame.display.update()

while play:
    update()
    render(bgcolor)























