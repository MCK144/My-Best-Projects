#pragma once
#include <string>
using namespace std;

class Item
{
public:
	Item(string name, char tile, int attack, int defence, int range, int value);
	
	//Getters
	string getName() { return _name; };
	int getAttack() { return _attack; };
	int getDefence() { return _defence; };
	int getRange() { return _range; };
	int getTile() { return _tile; };
	int getCount() { return _count; };

	//other
	void addOne();
	void setPosition(int x, int y);

private:
	
	string _name; 
	char _tile;
	int _attack;
	int _defence;
	int _range;
	int _value;
	int _count;
	
	int _x;
	int _y;
};

