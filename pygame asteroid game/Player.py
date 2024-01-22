import pygame
from Sprite import Sprite

DAMAGE_COOLDOWN = 0.5 * 60 #2 seconds * 60 FPS

ASTEROID_DAMAGE = 5

class Player(Sprite):
    def __init__(self,health, x,y,w,h,texturePath):
        super().__init__(x,y,w,h,texturePath)
        self.health = health
        self.speed = 10
        self.invulnerable = False
        self.damageTimer = 0


    def update(self,asteroids):
        if self.health <= 0:
            return

        self.damageTimer -= 1
        if self.damageTimer <= 0:
            self.damageTimer = 0
            self.invulnerable = False

        keys = pygame.key.get_pressed()

        if keys[pygame.K_w]:
            self.hitbox.y -= self.speed
        if keys[pygame.K_s]:
            self.hitbox.y += self.speed

        #check collision with asteroids
        for a in asteroids:
            if self.hitbox.colliderect(a.hitbox):
                if self.invulnerable == False:
                    self.invulnerable = True
                    self.damageTimer = DAMAGE_COOLDOWN
                    #the size of the asteroid affects the damage it deals
                    self.health -= ASTEROID_DAMAGE + a.hitbox.w // 4