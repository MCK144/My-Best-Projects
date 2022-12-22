from Snake import Snake

class AI(Snake):
    def __init__(self,x,y,w,h,filePath):
        super().__init__(x,y,w,h,filePath)
        self.speed = 5

    def update(self,orbs,snakes):
        self.calculateDirection(orbs)
        return super().update(snakes)

    def calculateDirection(self, orbs):
        if len(orbs) == 0:
            return

        closestOrb = orbs[0]
        closestDistance = 90000000

        for orb in orbs:
            direction = [orb.rect.x - self.rect.x, orb.rect.y - self.rect.y]
            distance = (direction[0] ** 2 + direction[1] ** 2) ** (1/2)

            if distance < closestDistance:
                closestOrb = orb
                closestDistance = distance

        direction = [closestOrb.rect.x - self.rect.x,closestOrb.rect.y - self.rect.y]
        l = (direction[0] ** 2 + direction[1] ** 2) ** (1/2)

        if l == 0:
            return

        direction[0] /= l
        direction[1] /= l

        self.direction = direction