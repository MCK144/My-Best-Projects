from Box import Box
import pygame

class Sprite(Box):
    def __init__(self,x,y,w,h,texturePath):
        super().__init__(x,y,w,h,(0,0,0))
        self.texture = pygame.image.load(texturePath)
        self.texture = pygame.transform.scale(self.texture,(w,h))

    def render(self,window):
        window.blit(self.texture,(self.hitbox.x,self.hitbox.y))