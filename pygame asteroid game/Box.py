import pygame

class Box:
    def __init__(self,x,y,w,h,color):
        self.hitbox = pygame.Rect(x,y,w,h)
        self.color = color

    def render(self,window):
        pygame.draw.rect(window,self.color,self.hitbox)