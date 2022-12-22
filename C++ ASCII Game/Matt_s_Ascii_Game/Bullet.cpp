#include "Bullet.h"



Bullet::Bullet(int attack, int direction, char tile)
{
	_attack = attack;
	_direction = direction;
	_tile = tile;
	_newBullet = true;
}

void Bullet::setPosition(int x, int y) {
	_x = x;
	_y = y;
}

void Bullet::getPosition(int &x, int &y) {
	x = _x;
	y = _y;
}

bool Bullet::isNew() {
	if (_newBullet) { //if bullet is new, isNew() will return true but _newBullet is set to false
		_newBullet = false;
		return true;
	}
	return false;
}
