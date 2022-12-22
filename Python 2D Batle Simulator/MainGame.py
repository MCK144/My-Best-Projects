import pygame
import random
from Soldier import Soldier
from Colors import ColorManager

WIN_DIMS = (700,700)

RED_SOLDIERS = 200
GREEN_SOLDIERS = 200
YELLOW_SOLDIERS = 200

SOLDIER_SIZE = 10


class MainGame:
    def __init__(self, numArmies, armyData):
        self.window = pygame.display.set_mode(WIN_DIMS)
        pygame.display.set_caption("Battle Simulator")

        self.bgColor = (130,0,0)
        self.backgroundImage = pygame.image.load("EuropeMap.png")
        self.backgroundImage = pygame.transform.scale(self.backgroundImage,WIN_DIMS)

        self.quitGame = False

        self.soldiers = []

        colorManager = ColorManager()

        for i in range(numArmies):

            color = colorManager.getColor(armyData[i][3])

            for j in range(armyData[i][2]):
                randX = random.randint(0, WIN_DIMS[0])
                randY = random.randint(0, WIN_DIMS[1])
                newSoldier = Soldier(randX, randY, SOLDIER_SIZE, SOLDIER_SIZE,color, i,armyData[i][0], armyData[i][1])
                self.soldiers.append(newSoldier)

    def play(self):
        while self.quitGame == False:
            self.update()
            self.render()


    def update(self):

        for soldier in self.soldiers:
            if soldier.update(self.soldiers) == True:
                self.soldiers.remove(soldier)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.quitGame = True


    def render(self):
        self.window.fill(self.bgColor)
        self.window.blit(self.backgroundImage,(0,0))

        for soldier in self.soldiers:
            soldier.render(self.window)

        pygame.display.update()

