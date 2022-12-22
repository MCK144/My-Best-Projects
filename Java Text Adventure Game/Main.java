import java.util.Scanner;

class Main {
	
  public static void main(String[] args) {		
		Scanner input = new Scanner(System.in);

		System.out.print("What is your name: ");

		String name = input.nextLine();

		String[] names = {"Bob", "Carol", "Larry", "Benjamin", "Matthew",
												"Julia", "Clark", "Zoe", "Kenneth", "Jim",
												"Nathan", "Amanda", "Jake", "Mark", "Ally",
											"Stephen", "Megan", "Lori", "Jonathan","Tristan"};

		String[] pronouns = {"t","t","t","t"};
		System.out.print("Is this a boy (1) or girl (2) name: ");
		int a = input.nextInt();
		if (a == 1){
			pronouns[0] = "he";
			pronouns[1] = "him";
			pronouns[2] = "his";
			pronouns[3]= "himself";
		} 
		else{
			pronouns[0] = "she";
			pronouns[1] = "her";
			pronouns[2] = "her";
			pronouns[3] = "herself";
		}
		
		boolean playGame = true;

		while(playGame == true){
			//************************************* GAME START *************************************
			System.out.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
			
			boolean goodGuy = true;
			boolean armor = false;
			boolean dead = false;
	
			System.out.println("\n\n\n****************************************");
			System.out.println("       The Adventures of " + name);
			System.out.println("****************************************");
			
			System.out.println("There once was a knight named " + name + ". ");
			System.out.println(name + " was tasked with defending the royal family from any foe no matter the danger.");
			System.out.println("Interestingly, " + name + " became a knight long ago after losing " + pronouns[2] + " memory." );
	
			
			System.out.println("Recently the kingdom has experienced far more monster attacks, leading the king to fear this");
			System.out.println("means the return of the Dark Lord who almost ended the kingdom years ago.");
			System.out.println("Until more answers can be disclosed, eliminate the monsters nearby.");
	
			System.out.println("Enter 1 or 2: ");
			System.out.println("\t\t1. Talk to the king\n\t\t2. Exit the castle\n\t\t3. Defy orders and skip the journey");
	
			int choice = input.nextInt();
	
			if (choice == 1){
				System.out.println("'The kingdom has been in a lot more danger,' said the king.");
				System.out.println("'I fear the Dark Lord is returning. But what can we do except stop the monsters?'");
				System.out.println("'Go and kill the monsters in the forest to make the kingdom a safer place.'");
				
				System.out.println("\t\t1. Talk to the King\n\t\t2. Exit the castle");
				choice = input.nextInt();
	
				if (choice == 1){
					System.out.println("'Do you have more to say?' asked the king.");
					System.out.println("'Be on your way. Also, before I forget, take this armor with you.'");
					System.out.println("The king gave " + name + " chainmail armor. Though heavier, it could fit right under");
					System.out.println("the rest of " + pronouns[2] + " armor");
					armor = true;
				}
	
				choice = 2;
			}
			//************ACT I
			if (choice == 2){
				System.out.println("Finally being outside the castle walls, "+ name + " made a decision");
				System.out.println("on where to go first");
	
				System.out.println("\t\t1. Go to the forest\n\t\t2. Enter the cave");
	
				choice = input.nextInt();
	
				//Forest
				if (choice == 1){
					System.out.println("Bored of the castle, " + name + " went to the forest");
					System.out.println("Finding some goblins, " + name + " made quick work of them");
					System.out.println("There was also a man in the forest who looked suspicious.");
	
					System.out.println("\t\t1. Kill him");
					System.out.println("\t\t2. Talk to him");
	
					choice = input.nextInt();
					
					if (choice==1){
						goodGuy = false;
						System.out.println("Being suspicious of the man, " + name + " pulled out his sword and ended him");
						System.out.println("The man's dying words were 'you look just like the Dar....'");
						System.out.println("With nothing else to do, " + name + " returned to the castle");
					}
					else if (choice == 2){
						System.out.println("'The Dark lord is bound to return soon!' yelled the stranger. '");
						System.out.println("'These monsters are proof! They only come when he is near.'");
						System.out.println("With that, the stranger walked away. " + name + " had nothing else to do and");
						System.out.println("returned to the castle");
					}
				} 
				//Cave
				else{
					System.out.println("The cave was incredibly dark, but there were lots of noises coming from within");
					System.out.println("Knowing a long fight with monsters in the dark could be dangerous, " + name);
					System.out.println("Made note of the dynamite " + pronouns[0] + " had.");
	
					System.out.println("\t\t1. Blow up the cave");
					System.out.println("\t\t2. Investigate");
	
					choice = input.nextInt();
	
					if (choice == 1){
						System.out.println("Fearing a long fight, " + name + " lit " + pronouns[2] + " dynamite");
						System.out.println("The cave blew up. No more sounds came from within");
						goodGuy = false;
					}
					else{
						System.out.println("Venturing deeper in the cave, " + name + " did in fact find a large goblin and started to fight it");
							System.out.println("This foe, however, was very powerful and stabbed " + name);
						if (!armor){
							System.out.println(name + " died");
							dead = true;
						}
						else{
							System.out.print("Luckily, the armor that " + pronouns[0]);
							System.out.println(" got from the king saved " + pronouns[2] +  " life");
							System.out.println("Getting back up, " + name + " rushed the goblin and killed it");
	
							System.out.println("\n\nVoices came from the deeper part of the cave. There were people trapped by the goblin");
							System.out.println("They came out to thank the knight for freeing them");
							System.out.println("As they saw " + name +" , however, their faces turned from joy to fear");
							System.out.println("Everyone ran out of the cave as if they just saw a monster");
							System.out.println(name + " was confused but returned to the castle");
							
						}
	
						
					}
	
					
				}
			}
	
			//************ACT II
			if (dead == false){
				System.out.println("\n\n" + name + " returned to the castle and approached the king, reporting of the monsters");
				System.out.println(pronouns[0] + " had killed");
	
				System.out.println("\n'Have you completed your quest?' asked the king.'");
				input.nextLine();
				String answer = input.nextLine();
				
				if (goodGuy == false){
					System.out.println("The king's face quickly turned");
					System.out.println("'Murderer!' he yelled. 'You have killed innocents'");
					System.out.println("The king ordered his soldiers to attack. " + name + " struck down many");
					System.out.println("but died in the end");
				} else{
					System.out.println("'It seems that the Dark Lord is among us' said the king");
					System.out.println("'While you were away, I found a prophecy that stated that the Dark Lord would hide'");
					System.out.println("'among the citizens of this fine kingdom. I have rounded them up here. Do you know who'");
					System.out.println("'the Dark Lord is?'");
	
					answer = input.nextLine();
					if (answer.equals("no")|| answer.equals("No")){
						System.out.println("\n'Unfortunately, we are out of time to investigate' said the King");
					}
					System.out.println("'To save the kingdom, we must find the Dark Lord and destroy him before he can gain too much power'");
					System.out.println("Here is a list of all the citizens who are here");
	
					for (int i = 0; i < 20; i++){
						System.out.println("\t\t" + (i+1) + " " + names[i]);
					}
	
					System.out.println("Who is the Dark Lord?");
					answer = input.nextLine();
	
					if (answer.equals(name)){
						System.out.println(name + " admitted to being the Dark Lord. On " + pronouns[2] + " journey, " + name);
						System.out.println("Discovered that the Dark Lord was " + pronouns[3]);
						System.out.println(name + " lost " + pronouns[2] + " memory after it was taken by ancient heros trying to stop " + pronouns[2] + " evil plan");
	
	
						System.out.println("\t\t1. Save the kingdom\n\t\t2. Kill the king");
						choice = input.nextInt();
						if (choice == 1){
							System.out.println("To keep the kingdom safe, " + name + " jumped off the castle wall to stop the Dark Lord from ever rising again. The kingdom was saved");
						} else{
							System.out.println("Once " + name + " rediscovered " + pronouns[2] + " identity, " + pronouns[0] + " decided ");
							System.out.println(pronouns[0] + " would not be defeated again. " + name + " killed the king and conquored the kingdom");
						}
					} 
					else{
						System.out.println(answer + " was promptly executed but was not the Dark Lord.  The guilt of killing");
						System.out.println(" an innocent person haunted " + name + " for the rest of " + pronouns[2] + " life");
					}
					
				}
			}

			System.out.println("*************************************************************");
			System.out.println("                        The End ");
			System.out.println("*************************************************************");

			System.out.println("Would you like to play again (Y or N, you may need to type it twice): ");
			String playerChoice = input.nextLine();
			input.nextLine();


			if (playerChoice.equals("N")){
				playGame = false;
			}
		} // while loop	
  }// public static void main

} // class Main



/*import java.util.Scanner;

class Main{
	public static void main(String []args){
		
		//**********************EXAMPLE: finish first		
		Scanner input = new Scanner(System.in);

		System.out.print("Enter 1,2,or 3: ");
		int age = input.nextInt();

		if (age == 1){
			System.out.println("you entered a 1");
		}
		else if (age == 2){
			System.out.println("you entered a 2");
		}
		else if (age == 3){
			System.out.println("you entered a 3");
		}
		else{
			System.out.println("You did not follow directions >:(");
		}

		//***************Challenge: finish for grades C,D,F
		System.out.print("Enter your grade for your final test: ");
		int grade = input.nextInt();

		if (grade >= 90){
			System.out.println("You got an A! Good job");
		}
		else if (grade >= 80){
			System.out.println("You got a B. Nice");
		}
		
		

	}
	
}*/

/*import java.util.Scanner;

class Main{
	public static void main(String []args){
		int num1,num2;

		char operator;

		Scanner input = new Scanner(System.in);

		System.out.print("Enter an operator: ");
		
		operator = input.next().charAt(0);

		System.out.print("Enter a number: ");
		num1 = input.nextInt();

		System.out.print("Enter another number: ");
		num2 = input.nextInt();

		int result = 0;
		
		if (operator == '+'){
			result = num1+num2;
		} else if (operator == '-'){
			result = num1 - num2;
		}
		else if (operator == '/'){
			result = num1 / num2;
		}
		else if (operator == '*'){
			result = num1 * num2;
		}
		else{
			System.out.println("Operator not valid");
		}
		
		System.out.println(num1 + " " + operator + " " + num2 + " = " + result);
	}
	
}*/

// lesson 1
/*
class Main{
	public static void main(String[] args){
		System.out.println("Hello World");
		System.out.print("Hello");

		int age = 19;
		float pi = 3.1415f;
		char middleInitial = 'C';
		String name = "Matt";
		bool minor = false;
	}
}

// lesson 2

import java.util.Scanner;

class Main{
	public static void main(String[] args){
		Scanner input = new Scanner(System.in);


		int a = input.nextInt();

		System.out.println(a);
	}
}*/

// lesson 6
/*
import java.util.Scanner;

class Main{
	public static void main(String[] args){
		Scanner input = new Scanner(System.in);
		
		String equation;
		double val1 = 0;
		double val2 = 0;
		char operator;
		double result;

		
		System.out.println("************ Java Calculator ************\n");
		// get first value
		System.out.print("Enter a value: ");
		val1 = input.nextDouble();
		System.out.println();
		// get operator
		System.out.print("Enter an operator: ");
		operator = input.nextLine();
		System.out.println();
		// get second value
		System.out.print("Enter a value: ");
		val2 = input.nextDouble();
		System.out.println("\n");

		if (operator == '-'){
			result = val1 + val2;
		} 
		else if (operator == '-'){
			result = val1 - val2;
		} 
		else{
			result = 99.0;
		}

		System.out.println(val1 + " "+  operator +  " " + val2 + " = " + result);
				
	}
}*/

// lesson 7-8
/*

class Main{
		public static void main(String[] args){
			int myArray[] = {1,2,3};
		}
}*/
