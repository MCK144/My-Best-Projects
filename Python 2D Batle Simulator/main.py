from MainGame import MainGame


print("***********************************************")
print("                   Battle Simulator            ")
print("***********************************************")
print()

numArmies = int(input("Enter the amount of armies to fight: "))

armyData = []

for i in range(numArmies):
    print("Enter the stats for army #"+str(i+1))

    stats = [0,0,0,""]
    stats[0] = int(input("\thealth: "))
    stats[1] = int(input("\tattack: "))
    stats[2] = int(input("\tsoldiers: "))
    stats[3] = input("\tcolor: ")
    armyData.append(stats)

game = MainGame(numArmies,armyData)

game.play()