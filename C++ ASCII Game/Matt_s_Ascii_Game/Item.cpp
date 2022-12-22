#include "Item.h"



Item::Item(string name, char tile, int attack, int defence,int range, int value)
{
	_name = name;
	_tile = tile;
	_attack = attack;
	_defence = defence;
	_range = range;
	_value = value;
	_count = 0;
}

void Item::addOne() {
	_count++;
}

void Item::setPosition(int x, int y) {
	_x = x;
	_y = y;
}