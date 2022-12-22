import pygame
from Player import Player
from Orb import Orb
from Camera import Camera
from AI import AI
from FontRenderer import FontRenderer
import random

START_W = 50
START_H = 50

PLAYER_START_X = 0
PLAYER_START_Y = 0
PLAYER_TEXTURE = "textures/body_red.png"

MAX_ORB_SIZE = 40

FPS = 60
NUM_ORBS = 400
NUM_AI = 20

class MainGame:
    def __init__(self):
        pygame.init()

        self.winDims = (1000,700)
        self.window = pygame.display.set_mode(self.winDims)
        self.winColor = (75,75,75)
        self.quit = False
        self.clock = pygame.time.Clock()

        self.camera = Camera(PLAYER_START_X,PLAYER_START_Y,(START_W,START_H),self.winDims)

        self.textures = ["textures/blue_orb.png", "textures/green_orb.png", "textures/purple_orb.png",
                         "textures/red_orb.png", "textures/yellow_orb.png", "textures/orange_orb.png"]

        self.player = Player(PLAYER_START_X,PLAYER_START_Y,START_W,START_H,random.choice(self.textures),self.winDims)
        self.orbs = []
        self.snakes = []
        self.fontRenderer = FontRenderer()

    def init(self):

        for i in range(NUM_ORBS):
            randX = random.randint(-self.winDims[0] * 3,self.winDims[0] * 3)
            randY = random.randint(-self.winDims[1] * 3,self.winDims[1] * 3)
            randR = random.randint(10,MAX_ORB_SIZE)

            randTexture = random.choice(self.textures)

            newOrb = Orb(randX,randY,randR, randTexture)
            self.orbs.append(newOrb)

        self.snakes.append(self.player)

        for i in range(NUM_AI):
            randX = random.randint(-self.winDims[0] * 3,self.winDims[0] * 3)
            randY = random.randint(-self.winDims[1] * 3,self.winDims[1] * 3)

            randTexture = random.choice(self.textures)

            newAI = AI(randX,randY,START_W,START_H,randTexture)
            self.snakes.append(newAI)

        self.play()

    def play(self):
        while self.quit == False:
            self.update()
            self.render()

    def update(self):
        self.clock.tick(FPS)

        # window events processed
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.quit = True

        # orb update
        for orb in self.orbs:
            if orb.update(self.snakes):
                self.orbs.remove(orb)

        # snakes update
        for snake in self.snakes:
            if snake.update(self.orbs, self.snakes) == True:
                startX = snake.rect.x
                startY = snake.rect.y
                size = START_W

                randTexture = random.choice(self.textures)

                newOrb = Orb(startX, startY, size, randTexture)
                self.orbs.append(newOrb)

                for segment in snake.segments:
                    startX = segment.rect.x
                    startY = segment.rect.y
                    size = START_W

                    randTexture = random.choice(self.textures)

                    newOrb = Orb(startX, startY, size, randTexture)
                    self.orbs.append(newOrb)

                snake.segments.clear()
                self.snakes.remove(snake)

        # camera update
        self.camera.update(self.player.rect.x,self.player.rect.y)


    def render(self):
        self.window.fill(self.winColor)

        for orb in self.orbs:
            orb.draw(self.window, self.camera)

        for snake in self.snakes:
            snake.draw(self.window,self.camera)

        self.fontRenderer.renderFont(self.window,self.player.score)

        pygame.display.update()