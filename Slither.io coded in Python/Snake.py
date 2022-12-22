import pygame
from Object import Object
from Segment import Segment


MAX_CHECK_DISTANCE = 500

class Snake(Object):
    def __init__(self,x,y,w,h,filePath):
        super().__init__(x,y,w,h,filePath)
        self.speed = 7
        self.prevScore = 0
        self.score = 0
        self.segments = []
        self.direction = []


    def update(self, snakes):
        self.rect.x += self.direction[0] * self.speed
        self.rect.y += self.direction[1] * self.speed

        self.addSegment()
        self.updateSegments()

        for snake in snakes:
            direction = [snake.rect.x - self.rect.x, snake.rect.y - self.rect.y]

            distance = (direction[0]**2 + direction[1]**2) ** (1/2)

            if distance > MAX_CHECK_DISTANCE or distance == 0:
                continue

            for segment in snake.segments:
                if self.rect.colliderect(segment.rect):
                    return True

        return False



    def draw(self, window, camera):
        window.blit(self.texture, camera.translate(self.rect.x, self.rect.y))

        for segment in self.segments:
            window.blit(segment.texture, camera.translate(segment.rect.x, segment.rect.y))

    def addSegment(self):
        if self.score - self.prevScore >= 20:
            self.prevScore = self.score

            startX = self.direction[0] * -1 * self.rect.w / 2
            startY = self.direction[1] * -1 * self.rect.h / 2
            if len(self.segments) == 0:
                startX += self.rect.x
                startY += self.rect.y
            else:
                startX += self.segments[-1].rect.x
                startY += self.segments[-1].rect.y

            newSegment = Segment(startX, startY, self.rect.w, self.rect.h, self.texturePath, self.speed)
            self.segments.append(newSegment)

    def updateSegments(self):
        for i in range(len(self.segments)):
            if i == 0:
                self.segments[i].update((self.rect.x,self.rect.y))
            else:
                self.segments[i].update((self.segments[i-1].rect.x, self.segments[i-1].rect.y))