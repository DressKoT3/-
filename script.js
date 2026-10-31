import java.util.Random;
import java.util.Scanner;

class Person {
    private int x, y, live, sizeBoard;
    private final String image = "🤠 "; 
    public Person(int sizeBoard) {
        this.sizeBoard = sizeBoard;
        this.x = 1; 
        this.y = sizeBoard; 
        this.live = 3; 
    }
    public int getX() { return x; }
    public int getY() { return y; }
    public int getLive() { return live; }
    public String getImage() { return image; }
    public void downLive() {
        this.live--;
        System.out.println("❌ Вы ответили неверно! Потеряна 1 жизнь.");
    }
    public void move(int newX, int newY) {
        this.x = newX;
        this.y = newY;
    }
    public boolean isMoveCorrect(int newX, int newY) {
        if (newX < 1 || newX > sizeBoard || newY < 1 || newY > sizeBoard) return false;
        int deltaX = Math.abs(this.x - newX);
        int deltaY = Math.abs(this.y - newY);
        return (deltaX == 1 && deltaY == 0) || (deltaX == 0 && deltaY == 1);
    }
}

class Monster {
    protected int x, y;
    protected String image = "👾 "; 
    protected Random random = new Random();
    public Monster(int sizeBoard) {
        this.x = 1 + random.nextInt(sizeBoard);
        this.y = 1 + random.nextInt(sizeBoard);
    }
    public int getX() { return x; }
    public int getY() { return y; }
    public String getImage() { return image; }
    public boolean conflictPerson(int personX, int personY) {
        return this.x == personX && this.y == personY;
    }
    public boolean taskMonster(int difficult) {
        Scanner sc = new Scanner(System.in);
        int a = random.nextInt(10 * difficult) + 1;
        int b = random.nextInt(10 * difficult) + 1;
        System.out.println("\n⚔️ Вас атакует обычный монстр! Решите пример:");
        System.out.print(a + " + " + b + " = ");
        if (sc.hasNextInt() && sc.nextInt() == (a + b)) {
            System.out.println("🎉 Правильно! Монстр побежден.");
            return true;
        }
        return false;
    }
}

class BigMonster extends Monster {
    public BigMonster(int sizeBoard) {
        super(sizeBoard);
        this.image = "👹 "; 
    }
    @Override
    public boolean taskMonster(int difficult) {
        Scanner sc = new Scanner(System.in);
        int a = random.nextInt(5 * difficult) + 2;
        int b = random.nextInt(5 * difficult) + 2;
        System.out.println("\n💀 ВНИМАНИЕ! Вас атакует БОЛЬШОЙ монстр! Решите пример на умножение:");
        System.out.print(a + " * " + b + " = ");
        if (sc.hasNextInt() && sc.nextInt() == (a * b)) {
            System.out.println("🔥 Невероятно! Большой монстр повержен!");
            return true;
        }
        return false;
    }
}

class EmojiMonster extends Monster {
    private final String[][] emojiPairs = {
        {"😀", "😁"}, {"🍏", "🍎"}, {"🐱", "🐶"}, {"🚗", "🚙"}, 
        {"⭐", "🌟"}, {"🍩", "🍪"}, {"🦊", "🐱"}, {"🐼", "🐨"}
    };
    public EmojiMonster(int sizeBoard) {
        super(sizeBoard);
        this.image = "🤡 "; 
    }
    @Override
    public boolean taskMonster(int difficult) {
        Scanner sc = new Scanner(System.in);
        int length = 3 + (difficult * 2); 
        String[] pair = emojiPairs[random.nextInt(emojiPairs.length)];
        int targetPosition = 1 + random.nextInt(length);
        System.out.println("\n✨ На вас напал Эмодзи-монстр! Найдите отличающийся символ и введите его номер:");
        for (int i = 1; i <= length; i++) {
            System.out.print((i == targetPosition ? pair[1] : pair[0]) + " ");
        }
        System.out.println("\nПорядковый номер (с 1): ");
        if (sc.hasNextInt() && sc.nextInt() == targetPosition) {
            System.out.println("🎯 Правильно! Эмодзи-монстр исчез.");
            return true;
        }
        System.out.println("❌ Мимо! Отличающийся эмодзи был на позиции № " + targetPosition);
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        String castle = "🏰 "; 
        int sizeBoard = 5;
        int step = 0;
        Person person = new Person(sizeBoard);
        Random random = new Random();
        int castleX = 1 + random.nextInt(sizeBoard), castleY = 1;
        String[][] board = new String[sizeBoard][sizeBoard];
        for (int y = 1; y <= sizeBoard; y++) {
            for (int x = 1; x <= sizeBoard; x++) board[y - 1][x - 1] = "   "; 
        }
        int countMonster = sizeBoard * sizeBoard - sizeBoard - 1;
        Monster[] monsters = new Monster[countMonster];
        int count = 0;
        while (count < countMonster) {
            Monster m = random.nextInt(3) == 0 ? new Monster(sizeBoard) : (random.nextBoolean() ? new BigMonster(sizeBoard) : new EmojiMonster(sizeBoard));
            if ((m.getX() == 1 && m.getY() == sizeBoard) || (m.getX() == castleX && m.getY() == castleY)) continue;
            if (board[m.getY() - 1][m.getX() - 1].equals("   ")) {
                board[m.getY() - 1][m.getX() - 1] = m.getImage();
                monsters[count++] = m;
            }
        }
        board[castleY - 1][castleX - 1] = castle;
        System.out.println("Привет! Ты готов начать играть в игру? (Напиши: ДА или НЕТ)");
        Scanner scanner = new Scanner(System.in);
        String answer = scanner.nextLine().trim().toUpperCase(); 
        System.out.println("Ваш ответ:\t" + answer);
        
        switch (answer) {
            case "ДА": 
                System.out.println("Выбери сложность игры (от 1 до 5):");
                int difficultGame = scanner.nextInt();
                System.out.println("Выбранная сложность:\t" + difficultGame);
                while (true) {
                    board[person.getY() - 1][person.getX() - 1] = person.getImage();
                    outputBoard(board, person.getLive());
                    System.out.println("Введите ход (новый X и Y через пробел).\nКоординаты: x: " + person.getX() + ", y: " + person.getY());
                    int x = scanner.nextInt(), y = scanner.nextInt();
                    if (person.isMoveCorrect(x, y)) {
                        if (board[y - 1][x - 1].equals("   ")) {
                            board[person.getY() - 1][person.getX() - 1] = "   "; 
                            person.move(x, y);
                            step++;
                        } else if (board[y - 1][x - 1].equals(castle)) {
                            System.out.println("🏆 Вы победили! Игра завершена!");
                            break;
                        } else {
                            for (Monster monster : monsters) {
                                if (monster != null && monster.conflictPerson(x, y)) { 
                                    if (monster.taskMonster(difficultGame)) {
                                        board[person.getY() - 1][person.getX() - 1] = "   "; 
                                        person.move(x, y);
                                        step++;
                                    } else {
                                        person.downLive();
                                    }
                                    break;
                                }
                            }
                        }
                    } else {
                        System.out.println("❌ Некорректный ход!");
                    }
                    if (person.getLive() <= 0) break;
                }
                if (person.getLive() <= 0) System.out.println("\n💀 Закончились жизни. Игра окончена!");
                break;
            case "НЕТ": 
                System.out.println("Жаль, приходи ещё!");
                break;
            default:
                System.out.println("Данные введены некорректно.");
                break;
        }
    }

    static void outputBoard(String[][] board, int live) {
        String wall = "+ —— + —— + —— + —— + —— +";
        for (String[] row : board) {
            System.out.println(wall);
            for (String col : row) System.out.print("| " + col);
            System.out.println(" |");
        }
        System.out.println(wall + "\nКоличество жизней:\t" + live + "\n");
    }
}
