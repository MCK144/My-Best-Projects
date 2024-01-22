from Box import Box
import random

MIN_SIZE = 3
MAX_SIZE = 6

SPEED = 6

class Star(Box):
    def __init__(self,x,y):
        size = random.randint(MIN_SIZE,MAX_SIZE)
        super().__init__(x,y,size,size,(255,255,255))
        self.speed = SPEED // size


    def update(self):
        self.hitbox.x -= self.speed
        if (self.hitbox.x < 0):
            return True
        return False