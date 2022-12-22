#include "Level.h"
#include "Player.h"
#include <string>
#include <vector>
#include <fstream>
#include <conio.h>
using namespace std;

//--------------------------------------loading
Level::Level()
{
}

void Level::process() {

	for (int i = 0; i < _levelData.size(); i++) {
		for (int j = 0; j < _levelData[i].size(); j++) {
			char tile = _levelData[i][j];
			switch (tile) {
			case '@': //player
				_player.setPosition(j, i);
				break;
			case 'G': //enemies
				_enemies.push_back(new Guard());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'S':
				_enemies.push_back(new Sentry());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'A':
				_enemies.push_back(new Archer());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'K':
				_enemies.push_back(new Knight());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'W':
				_enemies.push_back(new War_Lord());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'D':
				_enemies.push_back(new Dragon());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
				break;
			case 'X':
				_enemies.push_back(new Boss());
				_enemies.back()->setPosition(j, i);
				_soldierGrid[i][j] = _enemies.back();
			default:
				break;
			}
		}
	}
}


void Level::initBulletPosition(int x, int y, int direction, char bulletChar) {
	char tile;
	switch (direction) {
	case 90:
		tile = getTile(x + 1, y);
		if (tile == '.' || tile == 'x') {
			_bullets.push_back(new Bullet(1000000, direction, bulletChar));
			_bullets.back()->setPosition(x + 1, y);
			setTile(x + 1, y, bulletChar);

		}
		break;
	case -90:
		tile = getTile(x - 1, y);
		if (tile == '.' || tile == 'x') {
			_bullets.push_back(new Bullet(1000000, direction, bulletChar));
			_bullets.back()->setPosition(x - 1, y);
			setTile(x - 1, y, bulletChar);

		}
		break;
	case 0:
		tile = getTile(x, y - 1);
		if (tile == '.' || tile == 'x') {
			_bullets.push_back(new Bullet(1000000, direction, bulletChar));
			_bullets.back()->setPosition(x, y - 1);
			setTile(x, y - 1, bulletChar);
		}
		break;
	case 180:
		tile = getTile(x, y + 1);
		if (tile == '.' || tile == 'x') {
			_bullets.push_back(new Bullet(1000000, direction, bulletChar));
			_bullets.back()->setPosition(x, y + 1);
			setTile(x, y + 1, bulletChar);

		}
		break;
	}
}

void Level::load(string fileName) {
	ifstream file;
	file.open(fileName); //error checking
	if (file.fail()) {
		perror(fileName.c_str());
		exit(1);
	}

	string line;
	while (getline(file, line)) {
		_levelData.push_back(line);
		_soldierGrid.push_back(vector<Enemy *>());
		_soldierGrid.back().resize(line.size(), nullptr);
	}
	_done = false;
	file.close();

}

void Level::deleteLevel() {

	int j = _levelData.size();//delete map
	for (int i = 0; i < j; i++) {
		_levelData.pop_back();
	}

	int x = _enemies.size(); //delete any surviving enemies
	if (x != 0) {
		for (int j = 0; j < x; j++) {
			_enemies.pop_back();
		}
		_enemies.clear();
	}

	int r = _bullets.size();//delete any lingering bullets
	if (r != 0) {
		for (int k = 0; k < r; k++) {
			_bullets.pop_back();
		}
		_bullets.clear();
	}
	for (int l = 0; l < _soldierGrid.size(); l++) {
		_soldierGrid.pop_back();
	}
	_soldierGrid.clear();
	//clear() is necessary!!!
}
//--------------------------------movements stuff
//player
void Level::movePlayer() {
	int playerX, playerY;
	_player.getPosition(playerX, playerY);
	int ammo = _player.getAmmo();
	int arrow = _player.getRange();
	int direction = _player.getDirection();

	char input = _getwch();
	switch (input) {
	case 'w':
		_player.setDirection(0);
		processPlayerMove(playerX, playerY, playerX, playerY - 1);
		break;
	case 'a':
		_player.setDirection(-90);
		processPlayerMove(playerX, playerY, playerX - 1, playerY);
		break;
	case 's':
		_player.setDirection(180);
		processPlayerMove(playerX, playerY, playerX, playerY + 1);
		break;
	case 'd':
		_player.setDirection(90);
		processPlayerMove(playerX, playerY, playerX + 1, playerY);
		break;
	case ' ':
		if (ammo != 0 && arrow == 1) {
			initBulletPosition(playerX, playerY, direction, 'o');
			_player.removeAmmo();

		}
		break;

	}
}

void Level::processPlayerMove(int playerX, int playerY, int targetX, int targetY) {
	char tile = getTile(targetX, targetY);
	switch (tile) {
	case '.':
	case 'x':
		setTile(playerX, playerY, tile);
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		break;
	case '#':
	case 'o':
		break;
	case '0':
		if (_player.takeDamage(1000)) { //player is shot
			printf("You were shot!\n");
			_getch();
			exit(1);
		}
		break;
	case '=':
		_done = true;
		break;
	case '$': //minor items- coin
		_player.addMoney();
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		break;
	case '+': //med kit
		_player.addHealth();
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		break;
	case '|': //arrow
		_player.addAmmo();
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		break;
	case '/':// standard items
		_player.addItem(Item("Sword", '/', 30, 0, 0, 25)); // name, tile, attack, defence, range, value 
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		
		break;
	case '{':
		_player.addItem(Item("Bow", '{', 0, 0, 1, 50));
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		for (int i = 0; i < 10000; i++) {
			_player.addAmmo();
		}

		break;
	case '*':
		_player.addItem(Item("Shield", '*', 0, 30, 0, 25));
		setTile(playerX, playerY, '.');
		setTile(targetX, targetY, '@');
		_player.setPosition(targetX, targetY);
		break;
	default:
		battle(targetX, targetY);
		break;
	}
}
//enemies
void Level::updateEnemies() {

	for (int i = 0; i < _enemies.size(); i++) {
		moveEnemy(i);
	}
}

void Level::moveEnemy(int enemyIndex) {
	int enemyX,enemyY;
	Enemy *enemy = _enemies[enemyIndex];

	enemy->getPosition(enemyX, enemyY);
	char move = enemy->getMove(_player);

	switch (move) {
	case 'w':
		processEnemyMove(enemy, enemyX, enemyY, enemyX, enemyY - 1);
		break;
	case 's':
		processEnemyMove(enemy, enemyX, enemyY, enemyX, enemyY + 1);
		break;
	case 'a':
		processEnemyMove(enemy, enemyX, enemyY, enemyX - 1, enemyY);
		break;
	case 'd':
		processEnemyMove(enemy, enemyX, enemyY, enemyX + 1, enemyY);
		break;
	case '.':
		int direction = enemy->getDirection();
		if (direction != NULL) { //enemies without direction will return NULL
			initBulletPosition(enemyX, enemyY,direction, '0');
		}
		return;

	}
}

void Level::processEnemyMove(Enemy *enemy, int enemyX, int enemyY, int targetX, int targetY) {
	char tile = getTile(targetX, targetY);
	char enemyTile = enemy->getTile();

	switch (tile) {
	case '.':
		setTile(targetX, targetY, enemyTile);
		setTile(enemyX, enemyY, '.');
		enemy->setPosition(targetX, targetY);
		_soldierGrid[enemyY][enemyX] = nullptr;
		_soldierGrid[targetY][targetX] = enemy;
		break;
	case 'x':
		setTile(targetX, targetY, enemyTile);
		setTile(enemyX, enemyY, 'x');
		enemy->setPosition(targetX, targetY);
		_soldierGrid[enemyY][enemyX] = nullptr;
		_soldierGrid[targetY][targetX] = enemy;
		break;
	case '@':
		battle(enemyX, enemyY);
		break;
	default:
		break;
	}
}
//bullets
void Level::moveBullets() {
	int bulletX;
	int bulletY;
	int direction;
	for (int i = 0; i < _bullets.size(); i++) {
		if (_bullets[i]->isNew() == false) { //if bullet is not new (been in game for more than one turn)
			_bullets[i]->getPosition(bulletX, bulletY);
			direction = _bullets[i]->getDirection();

			switch (direction) {
			case 90:
				processBulletMove(i, bulletX + 1, bulletY);
				break;
			case -90:
				processBulletMove(i, bulletX - 1, bulletY);
				break;
			case 0:
				processBulletMove(i, bulletX, bulletY - 1);
				break;
			case 180:
				processBulletMove(i, bulletX, bulletY + 1);
				break;
			}
		}
	}


}

void Level::processBulletMove(int bulletIndex, int targetX, int targetY) {
	int result;
	int bulletX;
	int bulletY;
	int bulletTile = _bullets[bulletIndex]->getTile();
	_bullets[bulletIndex]->getPosition(bulletX, bulletY);

	char tile = getTile(targetX, targetY);
	if (bulletTile == 'o') {
		switch (tile) {//player bullet ai
		case '.':
		case 'x':
		case 'o':
			setTile(targetX, targetY, bulletTile); //bullet moves
			setTile(bulletX, bulletY, '.');
			_bullets[bulletIndex]->setPosition(targetX, targetY);
			break;
		case '0':
			for (int i = 0; i < _bullets.size(); i++) { //delete enemy bullet
				if (bulletX == targetX && bulletY == targetY) {
					_bullets[i] = _bullets.back();
					_bullets.pop_back();

				}
			}
			setTile(targetX, targetY, bulletTile);
			setTile(bulletX, bulletY, '.');
			_bullets[bulletIndex]->setPosition(targetX, targetY);
			break;
		case '#':
		case '$':
		case '/':
		case '=':
		case '+':
		case '@':
			setTile(bulletX, bulletY, '.'); //bullet dies
			_bullets[bulletIndex] = _bullets.back();
			_bullets.pop_back();
			break;
		default:
			shootEnemy(bulletIndex, targetX, targetY);
			break;
		}
	}
	else { //enemy bullet ai
		switch (tile) {
		case '.':
		case 'x':
		case '0':
		case ' ':
			setTile(targetX, targetY, bulletTile); //bullet moves
			setTile(bulletX, bulletY, '.');
			_bullets[bulletIndex]->setPosition(targetX, targetY);
			break;
		case '#':
		case '$':
		case '/':
		case '=':
		case '+':
		case 'o':
			setTile(bulletX, bulletY, '.'); //bullet dies
			_bullets[bulletIndex] = _bullets.back();
			_bullets.pop_back();
			break;
		case '@':
			result = _player.takeDamage(1000);
			if (result == 1) {
				setTile(bulletX, bulletY, '.');
				setTile(targetX, targetY, 'x');
				print();
				printf("You were shot!\n");
				_getch();
				exit(0);
			}
			break;
		default:
			shootEnemy(bulletIndex, targetX, targetY);
			break;
		}
	}

}

void Level::shootEnemy(int bulletIndex, int targetX, int targetY) {
	int enemyX;
	int enemyY;
	int bulletX;
	int bulletY;

	Bullet *bullet = _bullets[bulletIndex];
	Enemy *targetEnemy = getSoldier(targetX, targetY);
	targetEnemy->getPosition(enemyX, enemyY);

	int attack = bullet->getAttack();
	bullet->getPosition(bulletX, bulletY);

	int result = targetEnemy->takeDamage(attack);

	if (result != 0) { //enemy died from shot
		for (int i = 0; i < _enemies.size(); i++) {
			if (targetEnemy == _enemies[i]) {
				delete _enemies[i];
				_enemies[i] = _enemies.back();//delete enemy
				_enemies.pop_back();
				setTile(enemyX, enemyY, 'x');
				setTile(bulletX, bulletY, '.');
				_soldierGrid[enemyY][enemyX] = nullptr;

				delete _bullets[bulletIndex];//delete bullet
				_bullets[bulletIndex] = _bullets.back();
				_bullets.pop_back();
				_player.addKill();
				return;
			}
		}
	}
	else { //enemy survied shot
		setTile(bulletX, bulletY, '.'); //delete bullet
		delete _bullets[bulletIndex];
		_bullets[bulletIndex] = _bullets.back();
		_bullets.pop_back();
		return;
	}
}

//----------------------------------------------Game loops stuff
void Level::battleInfo() {
	char blank = ' ';
	string clearScreen(100, '\n');
	printf("%s", clearScreen.c_str());
	int attack = _player.getAttack();
	int defence = _player.getDefence();
	int health = _player.getHealth();
	int x = _player.getX();
	int y = _player.getY();
	int kills = _player.getKillCount();
	int money = _player.getMoney();
	int ammo = _player.getAmmo();

	printf("%5chealth: %d\n", blank,health);
	printf("%5cattack: %d\n", blank,attack);
	printf("%5cdefence: %d\n",blank, defence);
	printf("%5carrows: %d\n", blank, ammo);
	printf("%5cx: %d\n",blank, x);
	printf("%5cy: %d\n",blank, y);
	printf("%5ckills: %d\n",blank, kills);
	printf("%5cmoney: %d\n", blank, money);
	printf("%5cenemies remaining: %d\n\n", blank, _enemies.size());
	
}

void Level::print() {
	battleInfo();
	_player.printInventory();
	char blank = ' ';
	for (int i = 0; i < _levelData.size(); i++) {
		printf("%5c%s\n",blank, _levelData[i].c_str());
	}
}

Enemy* Level::getSoldier(int x, int y) {
	return _soldierGrid[y][x];
}

void Level::setTile(int x, int y, char tile) {
	_levelData[y][x] = tile;
}

char Level::getTile(int x, int y) {
	return _levelData[y][x];
}

void Level::battle(int targetX, int targetY){
	int enemyX;
	int enemyY;
	int playerX;
	int playerY;

	int enemyAttack;
	int result;

	Enemy *targetEnemy = getSoldier(targetX, targetY);
	result = targetEnemy->takeDamage(_player.attack()); //player attacks
	if (result != 0) { //enemy died
		setTile(targetX, targetY, 'x');
		_soldierGrid[targetY][targetX] = nullptr;
		for (int i = 0; i < _enemies.size(); i++) {
			if (targetEnemy == _enemies[i]) {
				delete _enemies[i];
				_enemies[i] = _enemies.back();
				_enemies.pop_back();
				i--;
				_player.addKill();
				return;
			}
		}
	}
	else { //enemy lived
		enemyAttack = targetEnemy->attack(); //enemy attacks
		result = _player.takeDamage(enemyAttack);
		if (result == 1) {// player died
			_player.getPosition(playerX, playerY);
			setTile(playerX, playerY, 'x');
			string clearscreen(100, '\n');
			printf("%s", clearscreen.c_str());
			print();
			printf("You were killed by a %s!\n", targetEnemy->getName().c_str());
			_getch();
			exit(0);
		}
	}
}

void Level::isDone(bool &done) {
	done = _done;
}