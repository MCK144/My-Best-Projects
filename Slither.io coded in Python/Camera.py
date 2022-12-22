
class Camera:
    def __init__(self, x, y,playerDims, winDims):
        self.x = x
        self.y = y
        self.playerDims = playerDims
        self.winDims = winDims

    def update(self,playerX,playerY):
        self.x = playerX
        self.y = playerY

    def translate(self, x, y):
        return (x - self.x + self.winDims[0] / 2 - self.playerDims[0] / 2,
                y - self.y + self.winDims[1] / 2 - self.playerDims[1] / 2)