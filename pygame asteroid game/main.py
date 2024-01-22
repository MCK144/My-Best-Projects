from MainGame import MainGame
import random
import time

operators = ["x","+","-","/"]

def generateQuestion(difficulty):
    a = random.randint(1,difficulty)
    b = random.randint(1,difficulty)
    op = random.choice(operators)
    question = str(a) + " "+ op + " " + str(b)
    answer = 0
    if op == "x":
        answer = str(a * b)
    elif op == "+":
        answer = str(a + b)
    elif op == "-":
        answer = str(a - b)
    else:
        answer = str(a // b) + " r" + str(a%b)

    return [question,answer]



difficulty = 20
startHealth = 100

game = MainGame(startHealth)
game.play()

while True:
    time.sleep(1)
    data = generateQuestion(difficulty)
    answer = input(data[0] + ": ")
    if answer == data[1]:
        difficulty += 5
        startHealth += 5
        game = MainGame(startHealth)
        game.play()


