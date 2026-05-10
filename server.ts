
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Simplified "Database"
  const dbPath = path.join(process.cwd(), 'data.json');
  let data: any = {
    users: {}, // Keyed by username
    tasks: [
      { id: '1', title: 'AI Image Description', description: 'Describe the scene in the provided image to help train AI.', reward: 5, type: 'image' },
      { id: '2', title: 'Text Summarization', description: 'Summarize a short paragraph into one clear sentence.', reward: 3, type: 'text' },
      { id: '3', title: 'Math Puzzle', description: 'Solve a simple logical math sequence.', reward: 2, type: 'math' },
      { id: '4', title: 'Sentiment Analysis', description: 'Determine if the given review is positive or negative.', reward: 2, type: 'sentiment' },
      { id: '5', title: 'Basic Arithmetic', description: 'Solve a quick addition or subtraction problem.', reward: 1.5, type: 'math' },
      { id: '6', title: 'Multiplication Challenge', description: 'Fast multiplication to test your speed.', reward: 3, type: 'math' },
      { id: '7', title: 'Logic Captcha', description: 'Verify you are human by solving a logical question.', reward: 1, type: 'logic' },
      { id: '8', title: 'Pattern Recognition', description: 'Find the missing number in a simple pattern.', reward: 2.5, type: 'math' },
      { id: '9', title: 'Division Master', description: 'Divide two numbers accurately.', reward: 4, type: 'math' },
      { id: '10', title: 'Quick Subtraction', description: 'Subtract numbers fast.', reward: 1, type: 'math' },
      { id: '11', title: 'Mental Math', description: 'Solve the equation in your head.', reward: 5, type: 'math' },
      { id: '12', title: 'Logical Reasoning', description: 'Solve a situational logic problem.', reward: 3, type: 'logic' },
      { id: '13', title: 'English to Bangla', description: 'Translate a simple English sentence to Bangla.', reward: 4, type: 'translate' },
      { id: '14', title: 'Emoji Movie Quiz', description: 'Guess the movie name from emojis.', reward: 3, type: 'emoji' },
      { id: '15', title: 'Color Identification', description: 'Identify the color based on its description or code.', reward: 2, type: 'color' },
      { id: '16', title: 'Global Capitals', description: 'Name the capital city of the given country.', reward: 3.5, type: 'geography' },
      { id: '17', title: 'Riddle Solver', description: 'Solve the riddle to prove your wit.', reward: 5, type: 'riddle' },
      { id: '18', title: 'Spelling Bee', description: 'Find the correctly spelled word.', reward: 2, type: 'spelling' },
      { id: '19', title: 'Science Trivia', description: 'Answer a simple scientific question.', reward: 3, type: 'science' },
      { id: '20', title: 'Word Reverse', description: 'Type the reversed version of the given word.', reward: 1.5, type: 'word' },
      { id: '21', title: 'Sentence Scramble', description: 'Unscramble the words to make a correct sentence.', reward: 6, type: 'scramble' },
      { id: '22', title: 'Vowel Counter', description: 'Count the number of vowels in the given word.', reward: 2, type: 'vowel' },
      { id: '23', title: 'Heritage Trivia', description: 'Answer a question about Bengali heritage.', reward: 4, type: 'heritage' },
      { id: '24', title: 'Day Logic', description: 'Calculate the day based on the information.', reward: 3, type: 'chrono' },
      { id: '25', title: 'Small Binary', description: 'Convert a very small binary number to decimal.', reward: 5, type: 'binary' },
    ],
    withdrawals: []
  };

  // Load existing data if any
  if (fs.existsSync(dbPath)) {
    try {
      const savedData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      // Only merge users and withdrawals, keep our fresh tasks list
      data.users = savedData.users || {};
      data.withdrawals = savedData.withdrawals || [];
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }

  const saveData = () => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  };

  // Auth Middleware
  const getUserId = (req: express.Request) => req.headers['x-user-id'] as string;

  // Authentication Routes
  app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (data.users[username]) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    data.users[username] = {
      username,
      password: hashedPassword,
      balance: 0,
      completedTasks: [],
      withdrawals: [],
      isActive: false,
      joinedAt: new Date().toISOString()
    };
    saveData();
    res.json({ success: true });
  });

  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = data.users[username];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true, username: user.username });
  });

  // API Routes
  app.get('/api/user', (req, res) => {
    const userId = getUserId(req);
    const user = data.users[userId];
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Don't send password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post('/api/activate', (req, res) => {
    const userId = getUserId(req);
    const user = data.users[userId];
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (user.isActive) return res.status(400).json({ error: 'Account already active' });

    user.isActive = true;
    saveData();
    res.json({ success: true });
  });

  app.get('/api/tasks', (req, res) => {
    res.json(data.tasks);
  });

  app.post('/api/tasks/submit', (req, res) => {
    const userId = getUserId(req);
    const { taskId } = req.body;

    const user = data.users[userId];
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!user.isActive) return res.status(403).json({ error: 'Account activation required' });

    const task = data.tasks.find((t: any) => t.id === taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    user.balance += task.reward;
    user.completedTasks.push({ taskId, timestamp: new Date().toISOString(), reward: task.reward });

    saveData();
    res.json({ success: true, newBalance: user.balance });
  });

  app.post('/api/user/daily-bonus', (req, res) => {
    const userId = getUserId(req);
    const user = data.users[userId];
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.isActive) return res.status(403).json({ error: 'Account activation required' });

    const today = new Date().toDateString();
    if (user.lastBonusDate === today) {
      return res.status(400).json({ error: 'Bonus already claimed today' });
    }

    const bonusAmount = 5;
    user.balance += bonusAmount;
    user.lastBonusDate = today;
    user.completedTasks.push({ taskId: 'daily_bonus', timestamp: new Date().toISOString(), reward: bonusAmount });

    saveData();
    res.json({ success: true, newBalance: user.balance, bonusAmount });
  });

  app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Object.entries(data.users)
      .map(([id, user]: [string, any]) => ({
        userId: id,
        balance: user.balance,
        tasksDone: user.completedTasks?.length || 0
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    res.json(leaderboard);
  });

  app.post('/api/withdraw', (req, res) => {
    const userId = getUserId(req);
    const { amount, method, number } = req.body;

    if (!data.users[userId] || data.users[userId].balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (amount < 20) {
      return res.status(400).json({ error: 'Minimum withdrawal is 20 BDT' });
    }

    const withdrawal = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      amount,
      method,
      number,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    data.users[userId].balance -= amount;
    data.users[userId].withdrawals.push(withdrawal);
    data.withdrawals.push(withdrawal);

    saveData();
    res.json({ success: true, withdrawal });
  });

  app.post('/api/admin/withdraw/complete', (req, res) => {
    const { withdrawalId } = req.body;
    const withdrawal = data.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' });

    withdrawal.status = 'success';

    // Update in user's record too
    const user = data.users[withdrawal.userId];
    if (user) {
      const userWithdrawal = user.withdrawals.find(w => w.id === withdrawalId);
      if (userWithdrawal) userWithdrawal.status = 'success';
    }

    saveData();
    res.json({ success: true });
  });

  // Admin stats for the owner (Simulation of owner income)
  app.get('/api/admin/stats', (req, res) => {
    const totalUsers = Object.keys(data.users).length;
    const totalEarnings = Object.values(data.users).reduce((acc: number, u: any) => acc + (u.completedTasks?.length || 0) * 1.25, 0); // 1.25 BDT profit per task
    res.json({
      totalUsers,
      totalEarnings,
      pendingWithdrawals: data.withdrawals.filter(w => w.status === 'pending'),
      completedWithdrawals: data.withdrawals.filter(w => w.status === 'success')
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
}

startServer();
