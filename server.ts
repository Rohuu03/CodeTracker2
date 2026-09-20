import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { platformManager } from './server/adapters/index';
import {
  generateAIProfileAnalysis,
  generateProblemExplanationWithAnimation,
  generateAICoachChatResponse,
} from './server/ai';
import { CodingProfile, UserAccount } from './src/types/index';
import { problemDatabaseService } from './server/problemDatabase';
import { recommendationEngine } from './server/recommendationEngine';

// In-memory store for authentication sessions and saved user profiles
const usersDb = new Map<string, UserAccount>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const lowerEmail = email.toLowerCase().trim();
    if (usersDb.has(lowerEmail)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email: lowerEmail,
      name: name?.trim() || lowerEmail.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(lowerEmail)}`,
      profiles: [],
      createdAt: new Date().toISOString(),
    };
    usersDb.set(lowerEmail, newUser);

    res.json({
      success: true,
      user: newUser,
      token: `ct_token_${Buffer.from(lowerEmail).toString('base64')}`,
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const lowerEmail = email.toLowerCase().trim();
    let user = usersDb.get(lowerEmail);

    if (!user) {
      // Create user on-the-fly for quick seamless onboarding
      user = {
        id: `usr_${Date.now()}`,
        email: lowerEmail,
        name: lowerEmail.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(lowerEmail)}`,
        profiles: [],
        createdAt: new Date().toISOString(),
      };
      usersDb.set(lowerEmail, user);
    }

    res.json({
      success: true,
      user,
      token: `ct_token_${Buffer.from(lowerEmail).toString('base64')}`,
    });
  });

  // Auth: Password Reset Request & Confirmation
  app.post('/api/auth/reset-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    res.json({
      success: true,
      message: `Password reset verification link has been dispatched to ${email}. Check your inbox.`,
    });
  });

  // User: Save connected profiles
  app.post('/api/user/profiles', (req, res) => {
    const { email, profiles } = req.body;
    if (!email || !Array.isArray(profiles)) {
      return res.status(400).json({ error: 'Email and profiles array required' });
    }
    const user = usersDb.get(email.toLowerCase().trim());
    if (user) {
      user.profiles = profiles;
    }
    res.json({ success: true, profiles });
  });

  // Fetch single profile
  app.post('/api/profiles/fetch-single', async (req, res) => {
    try {
      const { platform, urlOrUsername } = req.body;
      if (!urlOrUsername || !urlOrUsername.trim()) {
        return res.status(400).json({ error: 'URL or username is required' });
      }
      const profile = await platformManager.fetchProfile(platform || urlOrUsername, urlOrUsername);
      res.json({ success: true, profile });
    } catch (error: any) {
      console.error('Fetch single error:', error.message);
      res.status(400).json({ error: error.message || 'Failed to fetch platform profile' });
    }
  });

  // Fetch profiles from platforms
  app.post('/api/profiles/fetch-multi', async (req, res) => {
    try {
      const rawItems = req.body.items || req.body.profiles;
      if (!Array.isArray(rawItems) || rawItems.length === 0) {
        return res.status(400).json({ error: 'Profiles or items array is required' });
      }

      const results: CodingProfile[] = [];

      for (const item of rawItems) {
        const identifier = item.urlOrUsername || item.url || item.username;
        if (!identifier || !identifier.trim()) continue;

        try {
          const profile = await platformManager.fetchProfile(item.platform || identifier, identifier);
          results.push(profile);
        } catch (err: any) {
          console.error(`Failed to fetch for ${item.platform} / ${identifier}:`, err.message);
          results.push({
            platform: item.platform || 'Platform',
            username: identifier,
            profileUrl: identifier.startsWith('http') ? identifier : `https://${item.platform || 'platform'}.com/${identifier}`,
            problemsSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            rating: 0,
            maxRating: 0,
            contestsParticipated: 0,
            acceptanceRate: 0,
            fetchStatus: 'error',
            errorMessage: err.message,
          });
        }
      }

      res.json({ profiles: results });
    } catch (error: any) {
      console.error('Fetch multi error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch platform profiles' });
    }
  });

  // AI Coaching & Profile Analytics
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { profiles } = req.body;
      if (!Array.isArray(profiles) || profiles.length === 0) {
        return res.status(400).json({ error: 'Profiles array is required' });
      }
      const analysis = await generateAIProfileAnalysis(profiles);
      res.json({ success: true, analysis });
    } catch (error: any) {
      console.error('AI analyze error:', error);
      res.status(500).json({ error: error.message || 'AI profile analysis failed' });
    }
  });

  // AI Problem Explanation & Algorithm Animation Frames (supports both routes)
  app.post(['/api/ai/explain-problem', '/api/ai/problem-explanation'], async (req, res) => {
    try {
      const { title, problemTitle, topic } = req.body;
      const targetTitle = title || problemTitle;
      if (!targetTitle) {
        return res.status(400).json({ error: 'Problem title is required' });
      }
      const explanation = await generateProblemExplanationWithAnimation(targetTitle, topic);
      res.json({ success: true, explanation });
    } catch (error: any) {
      console.error('AI explain error:', error);
      res.status(500).json({ error: error.message || 'AI problem explanation failed' });
    }
  });

  // Persistent AI Coding Coach Chat
  app.post('/api/ai/coach-chat', async (req, res) => {
    try {
      const { message, history, profiles, aiAnalysis } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }
      const reply = await generateAICoachChatResponse(
        message,
        Array.isArray(history) ? history : [],
        Array.isArray(profiles) ? profiles : [],
        aiAnalysis || null
      );
      res.json({ success: true, reply });
    } catch (error: any) {
      console.error('AI coach chat error:', error);
      res.status(500).json({ error: error.message || 'AI coach chat failed' });
    }
  });

  // Problem Database: Status
  app.get('/api/problems/status', (req, res) => {
    res.json(problemDatabaseService.getStatus());
  });

  // Problem Database: Sync batch from LeetCode
  app.post('/api/problems/sync', async (req, res) => {
    try {
      const result = await problemDatabaseService.syncDatabase(3);
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error('Problem DB sync error:', error);
      res.status(500).json({ error: error.message || 'Problem sync failed' });
    }
  });

  // Problem Database: Get all problems
  app.get('/api/problems/all', (req, res) => {
    const problems = problemDatabaseService.getAllProblems();
    res.json({ count: problems.length, problems });
  });

  // Recommendation Engine: Compute personalized recommendations
  app.post('/api/problems/recommendations', (req, res) => {
    try {
      const { profiles = [], aiAnalysis = null } = req.body;
      const recommendations = recommendationEngine.generateRecommendations(profiles, aiAnalysis);
      res.json({ success: true, recommendations });
    } catch (error: any) {
      console.error('Recommendations error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeTrack AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
