import pygame
import random

from Player import Player
from Star import Star
from Asteroid import Asteroid
from Box import Box

FPS = 60

SHIP_WIDTH = 50
SHIP_HEIGHT = 50

NUM_STARS = 50
MIN_ASTEROID_SIZE = 20
MAX_ASTEROID_SIZE = 75
ASTEROID_SPAWN_RATE = int(0.5 * FPS)

class MainGame:
    def __init__(self,startHealth):
        pygame.init()

        self.WIN_DIMS = (600,600)
        self.bgcolor = (10,10,10)
        self.window = pygame.display.set_mode(self.WIN_DIMS)
        pygame.display.set_caption("Learning Game")

        self.quit = False
        self.clock = pygame.time.Clock()

        #game data
        self.player = Player(startHealth,SHIP_WIDTH * 3,self.WIN_DIMS[1]/ 2 - SHIP_HEIGHT / 2,SHIP_WIDTH,SHIP_HEIGHT,"player.png")
        self.stars = []
        for i in range(NUM_STARS):
            self.addStar(True)
        self.asteroids = []
        self.spawnTimer = ASTEROID_SPAWN_RATE

        padding = 20
        self.healthBarBackground = Box(padding,self.WIN_DIMS[1]-padding * 2,self.player.health * 2,15,(100,100,100))
        self.healthBar = Box(padding,self.WIN_DIMS[1]-padding * 2,self.player.health * 2,15,(0,255,0))


    def addStar(self,notAtEdge):
        x = self.WIN_DIMS[0]
        if notAtEdge:
            x = random.randint(0,self.WIN_DIMS[0])
        y = random.randint(0,self.WIN_DIMS[1])

        star = Star(x,y)
        self.stars.append(star)

    def addAsteroid(self):
        size = random.randint(MIN_ASTEROID_SIZE,MAX_ASTEROID_SIZE)
        x = self.WIN_DIMS[0]
        y = random.randint(0,self.WIN_DIMS[1] - size //2)
        asteroid = Asteroid(x,y,size,size,"asteroid.png")
        self.asteroids.append(asteroid)

    def update(self):
        self.spawnTimer -= 1
        if self.spawnTimer <= 0:
            self.spawnTimer = ASTEROID_SPAWN_RATE
            self.addAsteroid()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.quit = True

        for i in range(len(self.asteroids)):
            asteroid = self.asteroids[i]
            asteroid.update()
            #if asteroid.update():
            #   self.asteroids.pop(i)
            #    i -= 1

        for i in range(len(self.stars)):
            star = self.stars[i]

            if star.update():
                self.stars.pop(i)
                self.addStar(False)
                i-=1
        self.healthBar.hitbox.w = self.player.health * 2
        self.player.update(self.asteroids)
        self.clock.tick(FPS)


    def render(self):
        self.window.fill(self.bgcolor)

        for star in self.stars:
            star.render(self.window)
        for a in self.asteroids:
            a.render(self.window)
        self.player.render(self.window)
        self.healthBarBackground.render(self.window)
        self.healthBar.render(self.window)
        pygame.display.update()

    def play(self):
        while self.quit == False:
            self.update()
            self.render()