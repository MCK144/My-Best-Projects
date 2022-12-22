import pygame
import random
import math

class Soldier:
    def __init__(self,x,y,w,h,color,team,health,attack):
        self.hitbox = pygame.Rect(x,y,w,h)
        self.color = color

        self.speed = 0.1
        self.velocity = [0, 0]

        self.xDist = 0
        self.yDist = 0

        self.team = team
        self.health = health
        self.maxAttack = attack

    def update(self,soldiers):
        target = self.calculateDirection(soldiers)
        if target != False and self.hitbox.colliderect(target.hitbox) == True:
            self.fightBattle(target)

        if self.health <= 0:
            return True


        self.xDist += self.velocity[0]
        self.yDist += self.velocity[1]
        if math.fabs(self.xDist) >= 1:
            self.hitbox.x += self.xDist
            self.xDist = 0
        if math.fabs(self.yDist) >= 1:
            self.hitbox.y += self.yDist
            self.yDist = 0

        return False

    def fightBattle(self,enemy):
        while True:
            attack = random.randint(0,self.maxAttack)
            enemyAttack = random.randint(0,enemy.maxAttack)

            self.health -= enemyAttack
            enemy.health -= attack

            if self.health <= 0 or enemy.health <= 0:
                return


    def calculateDirection(self,soldiers):
        target = soldiers[0]
        closestDistance = 20000
        distVec = [0, 0]

        for soldier in soldiers:
            if soldier.team == self.team:
                continue

            distVec[0] = soldier.hitbox.x - self.hitbox.x
            distVec[1] = soldier.hitbox.y - self.hitbox.y

            distance = (distVec[0] ** 2 + distVec[1] ** 2) ** (1 / 2)

            if distance < closestDistance:
                target = soldier
                closestDistance = distance

        if closestDistance == 0 or target == self: # I modified this line, it used to be 'if closestDistance == 0 or target == self or closestDistance < 10:'
            self.velocity = [0,0]
            return False

        distVec[0] = target.hitbox.x - self.hitbox.x
        distVec[1] = target.hitbox.y - self.hitbox.y

        distVec[0] /= closestDistance
        distVec[1] /= closestDistance
        distVec[0] *= self.speed
        distVec[1] *= self.speed
        print(distVec[0])

        self.velocity = distVec
        return target

    def render(self,window):
        window.fill(self.color,self.hitbox)
