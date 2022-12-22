#pragma once
#include "Player.h"
#include <string>
#include <ctime>
#include <random>
using namespace std;

 class Enemy{
public:
	//init
	Enemy() {};
	void setPosition(int x, int y);
	
	//getters
	string getName() { return _name;};
	char getTile() { return _tile; };
	void getPosition(int &x, int &y);
	virtual int getDirection() { return NULL; };
	

	//game functions
	int attack();
	virtual char getMove(Player &player);
	int takeDamage(int attack);

protected:
	string _name;
	char _tile;
	int _health;
	int _attack;
	int _defence;
	
	int _x;
	int _y;
};
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------
// all types of enemies below

class Guard : public Enemy {
public:
	
	Guard(){
		_name = "Guard";
		_tile = 'G';
		_health = 5;
		_attack = 5;
		_defence = 5;
	}

	char getMove(Player &player);
};

class Sentry : public Enemy {
public:
	Sentry(){
		_name = "Sentry";
		_tile = 'S';
		_health = 10;
		_attack = 10;
		_defence = 10;
	}

	char getMove(Player &player);
};

class Archer : public Enemy {
public:
	Archer()
	{
		_name = "Archer";
		_tile = 'A';
		_health = 20;
		_attack = 10;
		_defence = 10;
		_direction = 90; //this is default direction
	}
	char getMove(Player &player);
	int getDirection() { return _direction; };
private:
	int _direction;
};

class Knight : public Enemy {
public:
	Knight(){
		_name = "Knight";
		_tile = 'K';
		_health = 50;
		_attack = 30;
		_defence = 30;
	}

	char getMove(Player &player);
};

class War_Lord : public Enemy {
public:
	War_Lord(){
		_name = "War Lord";
		_tile = 'W';
		_health = 100;
		_attack = 100;
		_defence = 100;
	}
	char getMove(Player &player);
};

class Dragon : public Enemy {
public:
	Dragon(){
		_name = "Dragon";
		_tile = 'D';
		_health = 500;
		_attack = 200;
		_defence = 100;
		_direction = 90;
	}
	char getMove(Player &player);
	int getDirection() { return _direction; };
private:
	int _direction;
};

class Boss :public Enemy {
public: 
		Boss() {
			_name = "Boss";
			_tile = 'X';
			_health = 1000;
			_attack = 1000;
			_defence = 100;
		}
		char getMove(Player &player);
};


