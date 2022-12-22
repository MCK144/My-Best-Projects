#include "GameSystem.h"
#include <string>
#include <iostream>
#include <conio.h>
#include "Level.h"
using namespace std;


GameSystem::GameSystem()
{
	//this is the entire game structure
	setUp("level0.txt");
	setUp("level1.txt");
	setUp("level2.txt");
	setUp("level3.txt");
	setUp("level4.txt");
	setUp("level5.txt");
	setUp("level6.txt");
	setUp("level7.txt");
	setUp("level8.txt");
	setUp("level9.txt");
	setUp("level10.txt");
	victory();
}

void GameSystem::setUp(string levelName) {
	_level.load(levelName);
	_level.process();
	playGame();
}

void GameSystem::playGame() {
	_levelDone = false;
	
	while (_levelDone==false) {
		_level.print();
		_level.movePlayer();
		_level.updateEnemies();
		_level.moveBullets();
		_level.isDone(_levelDone);
	}
	_level.deleteLevel();

}
void GameSystem::victory() {
	cout << string(100, '\n');
	printf("You beat the game!\n");
	_getch();

}