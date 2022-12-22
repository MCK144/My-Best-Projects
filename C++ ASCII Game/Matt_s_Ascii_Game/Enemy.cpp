#include "Enemy.h"
#include "Player.h"
#include <string>
#include <random>
using namespace std;


void Enemy::setPosition(int x, int y) {
	_x = x;
	_y = y;
}

void Enemy::getPosition(int &x, int &y) {
	x = _x;
	y = _y;
}

int Enemy::attack() {
	static mt19937 generator(time(NULL)); //must be static or else
	uniform_int_distribution<int> attackRoll(0, _attack);
	return attackRoll(generator);
}

int Enemy::takeDamage(int attack) {
	attack -= _defence;
	if (attack > 0) {
		_health -= attack;
		if (_health <= 0) {
			return 1;
		}
	}
	return 0;
}

//default enemy ai
char Enemy::getMove(Player &player) {
	static mt19937 generator(time(NULL)); //must be static or else
	uniform_int_distribution<int> move(0, 4);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;

	
	if (distance <= 10) {
		if (abx > aby) { 
			if (dx < 0) {
				return 'd';
			}
			else {
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				return 's';
			}
			else {
				return 'w';
			}
		}
	}

		switch (move(generator)) {
		case 0:
			return 'w';
		case 1:
			return 's';
		case 2:
			return 'a';
		case 3:
			return 'd';
		default:
			return '.';
		}
} 


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//----------------ALL OTHER ENEMY AI MOVES HERE-----------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

char Guard::getMove(Player &player) {
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); //must be static or else
	uniform_int_distribution<int> move(0, 4);

	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);

	int dx = _x - playerX; 
	int dy = _y - playerY; 
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;
	
	if (distance <= 7) {
		if (abx > aby) { 
			if (dx < 0) {
				return 'd';
			}
			else {
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				return 's';
			}
			else {
				return 'w';
			}
		}
	}
	return '.';
	//guard remains still until player is nearby
}

char Sentry::getMove(Player &player) {
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); //must be static or else
	uniform_int_distribution<int> move(0, 4);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;


	if (distance <= 10) {
		if (abx > aby) {
			if (dx < 0) {
				return 'd';
			}
			else {
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				return 's';
			}
			else {
				return 'w';
			}
		}
	}

	switch (move(generator)) {
	case 0:
		return 'w';
	case 1:
		return 's';
	case 2:
		return 'a';
	case 3:
		return 'd';
	default:
		return '.';
	}
	//sentry will move randomly until player is 10 spaces away
}

char Archer::getMove(Player &player){
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); //must be static or else
	uniform_int_distribution<int> move(0, 3);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;

	//set correct direction for archer to fire
	if (distance <= 30) { 
		if (abx > aby) {
			if (dx < 0) {
				_direction = 90;
				return '.';
			}
			else {
				_direction = -90;
				return '.';
			}
		}
		else {
			if (dy < 0) {
				_direction = 180;
				return '.';
			}
			else {
				_direction = 0;
				return '.';
			}
		}
	}

	switch (move(generator)) {
	case 0:
		return 'w';
	case 1:
		return 's';
	case 2:
		return 'a';
	case 3:
		return 'd';

	}
	//arhcer moves randomly unless player is near; if player is near, archer fires

}

char Knight::getMove(Player &player) {
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); //must be static or else
	uniform_int_distribution<int> move(0, 1);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;


	if (distance <= 20) {
		if (abx > aby) {
			if (dx < 0) {
				bool failedMove = move(generator);
				if (failedMove) {
					return '.';
				}
				return 'd';
			}
			else {
				bool failedMove = move(generator);
				if (failedMove) {
					return '.';
				}
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				bool failedMove = move(generator);
				if (failedMove) {
					return '.';
				}
				return 's';
			}
			else {
				bool failedMove = move(generator);
				if (failedMove) {
					return '.';
				}
				return 'w';
			}
		}
	}
	//knight has a larger range than other enemies
	//but it has a 50%/50% chance of not being able to move at all even if player is close
}

char War_Lord::getMove(Player &player) {
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); //must be static or else
	uniform_int_distribution<int> move(0, 4);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;


	if (distance <= 10) {
		if (abx > aby) {
			if (dx < 0) {
				return 'd';
			}
			else {
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				return 's';
			}
			else {
				return 'w';
			}
		}
	}

	switch (move(generator)) {
	case 0:
		return 'w';
	case 1:
		return 's';
	case 2:
		return 'a';
	case 3:
		return 'd';
	default:
		return '.';
	}
}

char Dragon::getMove(Player &player) {
	random_device::result_type seed = random_device()();
	static mt19937 generator(seed); 
	uniform_int_distribution<int> move(0, 3);
	uniform_int_distribution<int> willFire(0, 1);

	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;

	bool fire = willFire(generator);

	if (distance <= 30) {
		if (abx > aby) {
			if (dx < 0) {
				if (fire) {
					_direction = 90;
					return '.';
				}
				return 'd';
			}
			else {
				if (fire) {
					_direction = -90;
					return '.';
				}
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				if (fire) {
					_direction = 180;
					return '.';
				}
				return 's';
			}
			else {
				if (fire) {
					_direction = 0;
					return '.';
				}

				return 'w';
			}
		}
	}

	switch (move(generator)) {
	case 0:
		return 'w';
	case 1:
		return 's';
	case 2:
		return 'a';
	case 3:
		return 'd';
	}
	//dragon will move randomly; if player is close, dragon will either follow or fire
}

char Boss::getMove(Player &player) {
	static mt19937 generator(time(NULL)); //must be static or else
	uniform_int_distribution<int> move(0, 4);
	int playerX;
	int playerY;
	player.getPosition(playerX, playerY);
	int dx = _x - playerX; // x distance from player
	int dy = _y - playerY; // y distance from player
	int abx = abs(dx);
	int aby = abs(dy);
	int distance = abx + aby;


	if (distance <= 30) {
		if (abx > aby) {
			if (dx < 0) {
				return 'd';
			}
			else {
				return 'a';
			}
		}
		else {
			if (dy < 0) {
				return 's';
			}
			else {
				return 'w';
			}
		}
	}

	switch (move(generator)) {
	case 0:
		return 'w';
	case 1:
		return 's';
	case 2:
		return 'a';
	case 3:
		return 'd';
	default:
		return '.';
	}
	//boss moves randomly, leaving wall pieces behind
	//boss has range of thirty
}
