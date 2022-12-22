import random

BLACK = (0,0,0)
WHITE = (255,255,255)
RED = (255,0,0)
GREEN = (0,255,0)
BLUE = (0,0,255)
CYAN = (0,255,255)
YELLOW = (255,255,0)
MAGENTA = (255,0,255)
GRAY = (100,100,100)

class ColorManager:
    def __init__(self):
        pass

    def getColor(self,colorName):
        colorName = colorName.lower()

        if colorName == "red":
            return RED
        elif colorName == "blue":
            return BLUE
        elif colorName == "green":
            return GREEN
        elif colorName == "cyan":
            return CYAN
        elif colorName == "yellow":
            return YELLOW
        elif colorName == "magenta":
            return MAGENTA
        elif colorName == "black":
            return BLACK
        elif colorName == "white":
            return WHITE
        else:
            randR = random.randint(0,255)
            randG = random.randint(0,255)
            randB = random.randint(0,255)
            return (randR,randG,randB)
