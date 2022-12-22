#pragma once
#include <string>
#include <vector>
#include "Player.h"
#include "Enemy.h"
#include "Item.h"
#include "Bullet.h"
using namespace std;

class Level
{
public:
	//init
	Level();
	void load(string fileName);
	void initBulletPosition(int x, int y, int direction, char bulletChar);
	void deleteLevel();

	//movements
	void movePlayer();
	void processPlayerMove(int playerX, int playerY, int targetX, int targetY);
	void updateEnemies();
	void moveEnemy(int enemyIndex);
	void processEnemyMove(Enemy *enemy, int enemyX, int enemyY, int targetX, int targetY);
	void moveBullets();
	void processBulletMove(int bulletIndex, int targetX, int targetY);
	
	//other
	void battle(int targetX, int targetY);
	void shootEnemy(int bulletIndex, int targetX, int targetY);
	void battleInfo();
	void process();
	
	//general game functions
	void print();
	char getTile(int x, int y);
	void setTile(int x, int y, char tile);
	Enemy *getSoldier(int x, int y);

	void isDone(bool &done);
	
	
private:
	vector<string> _levelData;
	vector<Enemy *> _enemies;
	vector<Bullet *> _bullets;
	vector<vector<Enemy *> > _soldierGrid;
	Player _player;
	bool _done;
	int _level;
};

