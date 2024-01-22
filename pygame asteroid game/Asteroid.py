from Sprite import Sprite

class Asteroid(Sprite):
    def __init__(self,x,y,w,h,texturePath):
        super().__init__(x,y,w,h,texturePath)
        self.speed = 4

    def update(self):
        self.hitbox.x -= self.speed
        if self.hitbox.x - self.hitbox.w <= 0:
            return True
        return False