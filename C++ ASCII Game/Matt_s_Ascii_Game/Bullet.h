#pragma once
class Bullet
{
public:
	//init
	Bullet(int attack, int direction, char tile);
	void setPosition(int x, int y);

	//getters
	void getPosition(int &x, int &y);
	int getAttack() { return _attack; };
	int getDirection() { return _direction; };
	char getTile() { return _tile; };
	bool isNew();
private:
	int _x;
	int _y;
	int _direction;
	int _attack;
	char _tile;
	bool _newBullet;
};

