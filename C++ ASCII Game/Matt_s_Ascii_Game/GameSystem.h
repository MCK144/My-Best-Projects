#pragma once
#include <string>
#include "Level.h"
using namespace std;

class GameSystem
{
public:
	GameSystem();
	void setUp(string levelName);
	void playGame();
	void victory();
private:
	Level _level;
	int _levelNum;
	bool _levelDone;

};

