interface DocContent {
  title: string
  description: string
  content: string
}

const docsContent: Record<string, DocContent> = {
  "getting-started": {
    title: "Getting Started with Zerlo",
    description: "Learn how to use Zerlo AI to build games, websites, and TypeScript code in seconds.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Welcome to Zerlo, the revolutionary AI-powered platform that enables you to create games, websites, and TypeScript applications in seconds. This guide will help you get started with the platform.</p>
      
      <h2 id="what-is-zerlo">What is Zerlo?</h2>
      <p>Zerlo is an advanced AI assistant that understands your development needs and can generate complete applications, games, and code snippets based on your descriptions.</p>
      
      <h3 id="key-features">Key Features</h3>
      <ul>
        <li><strong>Game Development:</strong> Create 2D and 3D games with AI assistance</li>
        <li><strong>Web Development:</strong> Build responsive websites and web applications</li>
        <li><strong>TypeScript Generation:</strong> Generate clean, type-safe TypeScript code</li>
        <li><strong>Real-time Collaboration:</strong> Work with your team in real-time</li>
        <li><strong>Instant Deployment:</strong> Deploy your projects with one click</li>
      </ul>
      
      <h2 id="quick-start">Quick Start</h2>
      <p>To get started with Zerlo, follow these simple steps:</p>
      <ol>
        <li>Visit <a href="https://zerlo.com" target="_blank" rel="noopener noreferrer">zerlo.com</a></li>
        <li>Choose your project type (Game, Website, or TypeScript)</li>
        <li>Describe what you want to build in natural language</li>
        <li>Let Zerlo's AI generate your project instantly</li>
        <li>Customize and deploy your creation</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/dashboard.png" alt="Zerlo Platform Overview" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
      </div>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
        <p><strong>💡 Pro Tip:</strong> The more detailed your description, the better Zerlo can understand and create exactly what you need.</p>
      </div>
      
      <h2 id="example-projects">Example Projects</h2>
      <p>Here are some examples of what you can build with Zerlo:</p>
      
      <h3 id="games">Games</h3>
      <ul>
        <li>2D platformer with custom characters and levels</li>
        <li>Puzzle games with unique mechanics</li>
        <li>Multiplayer arcade games</li>
        <li>RPG adventures with storylines</li>
      </ul>
      
      <h3 id="websites">Websites</h3>
      <ul>
        <li>Professional business websites</li>
        <li>E-commerce stores with payment integration</li>
        <li>Portfolio sites for creatives</li>
        <li>Blog platforms with CMS functionality</li>
      </ul>
      
      <h3 id="applications">Applications</h3>
      <ul>
        <li>Task management tools</li>
        <li>Data visualization dashboards</li>
        <li>Social media platforms</li>
        <li>API services and microservices</li>
      </ul>
    `,
  },
  "authentication/login": {
    title: "Login Process",
    description: "Step-by-step guide to accessing your Zerlo account and projects.",
    content: `
      <h2 id="login-overview">Login Overview</h2>
      <p>Accessing Zerlo is simple and straightforward. Our platform supports multiple authentication methods to ensure you can start building immediately.</p>
      
      <h2 id="accessing-zerlo">Accessing Zerlo</h2>
      <p>You can access Zerlo through multiple methods:</p>
      <ul>
        <li>Direct web access at <a href="https://zerlo.com" target="_blank" rel="noopener noreferrer">zerlo.com</a></li>
        <li>Email and password authentication</li>
        <li>Google OAuth integration</li>
        <li>GitHub OAuth integration</li>
        <li>Guest mode for quick testing</li>
      </ul>
      
      <h2 id="step-by-step">Step-by-Step Login Process</h2>
      
      <h3 id="web-access">Direct Web Access</h3>
      <ol>
        <li>Navigate to <a href="https://zerlo.com" target="_blank" rel="noopener noreferrer">zerlo.com</a></li>
        <li>Click "Get Started" or "Sign In"</li>
        <li>Choose your preferred authentication method</li>
        <li>Complete the authentication process</li>
        <li>Start building your projects immediately</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/login.png" alt="Zerlo Login Interface" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Clean and intuitive login interface</p>
      </div>
      
      <h3 id="email-login">Email and Password Login</h3>
      <ol>
        <li>Enter your registered email address</li>
        <li>Provide your secure password</li>
        <li>Click "Sign In" to access your dashboard</li>
        <li>Access all your saved projects and templates</li>
      </ol>
      
      <h3 id="oauth-login">Social Authentication (Google/GitHub)</h3>
      <ol>
        <li>Click "Continue with Google" or "Continue with GitHub"</li>
        <li>Authorize Zerlo to access your basic profile information</li>
        <li>You'll be automatically redirected to your dashboard</li>
        <li>Start creating projects immediately</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/socialLink.png" alt="Social Login Options" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Multiple authentication options for convenience</p>
      </div>
      
      <h2 id="guest-mode">Guest Mode</h2>
      <p>Want to try Zerlo without creating an account? Use our guest mode:</p>
      <ul>
        <li>Click "Try as Guest" on the homepage</li>
        <li>Access limited features to test the platform</li>
        <li>Create sample projects to see Zerlo in action</li>
        <li>Upgrade to a full account when ready</li>
      </ul>
      
      <h2 id="troubleshooting">Troubleshooting Login Issues</h2>
      <p>If you encounter any issues while logging in:</p>
      <ul>
        <li><strong>Forgot Password:</strong> Use the "Reset Password" link</li>
        <li><strong>Account Issues:</strong> Contact our support team</li>
        <li><strong>Browser Problems:</strong> Clear cache and cookies</li>
        <li><strong>OAuth Issues:</strong> Try a different browser or disable ad blockers</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>⚠️ Note:</strong> For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge.</p>
      </div>
    `,
  },
  "authentication/signup": {
    title: "Sign Up Process",
    description: "Create your Zerlo account and start building amazing projects in seconds.",
    content: `
      <h2 id="signup-overview">Sign Up Overview</h2>
      <p>Creating a Zerlo account is quick and easy. Join thousands of developers, designers, and creators who are building the future with AI-powered development tools.</p>
      
      <h2 id="why-create-account">Why Create an Account?</h2>
      <p>With a Zerlo account, you get access to:</p>
      <ul>
        <li><strong>Unlimited Projects:</strong> Create as many projects as you need</li>
        <li><strong>Project History:</strong> Access all your previous creations</li>
        <li><strong>Advanced Features:</strong> Unlock premium AI capabilities</li>
        <li><strong>Collaboration Tools:</strong> Share and collaborate with team members</li>
        <li><strong>Priority Support:</strong> Get help when you need it</li>
        <li><strong>Custom Deployments:</strong> Deploy to your own domains</li>
      </ul>
      
      <h2 id="registration-methods">Registration Methods</h2>
      <p>Choose the method that works best for you:</p>
      <ul>
        <li>Email and password registration</li>
        <li>Google account integration</li>
        <li>GitHub account integration</li>
        <li>Professional team accounts</li>
      </ul>
      
      <h2 id="email-signup">Email Registration Process</h2>
      <ol>
        <li>Visit <a href="https://zerlo.com/signup" target="_blank" rel="noopener noreferrer">zerlo.com/signup</a></li>
        <li>Enter your full name</li>
        <li>Provide a valid email address</li>
        <li>Create a strong, secure password</li>
        <li>Select your primary use case (Games, Websites, or Code)</li>
        <li>Agree to our Terms of Service and Privacy Policy</li>
        <li>Click "Create Account"</li>
        <li>Verify your email address</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/signup.png" alt="Zerlo Sign Up Form" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Simple and secure registration process</p>
      </div>
      
      <h2 id="social-signup">Social Media Registration</h2>
      <p>For the fastest setup, use your existing accounts:</p>
      
      <h3 id="google-signup">Google Account</h3>
      <ol>
        <li>Click "Continue with Google"</li>
        <li>Select your Google account</li>
        <li>Authorize Zerlo to access basic profile information</li>
        <li>Complete any additional required information</li>
        <li>Start building immediately</li>
      </ol>
      
      <h3 id="github-signup">GitHub Account</h3>
      <ol>
        <li>Click "Continue with GitHub"</li>
        <li>Authorize the Zerlo application</li>
        <li>Import your development preferences</li>
        <li>Access advanced code generation features</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/socialLink.png" alt="Social Registration Options" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Quick registration with your existing accounts</p>
      </div>
      
      <h2 id="email-verification">Email Verification</h2>
      <p>After registering with email, you'll need to verify your address:</p>
      <ol>
        <li>Check your email inbox for a verification message from Zerlo</li>
        <li>Click the "Verify Email" button in the message</li>
        <li>You'll be redirected to your new dashboard</li>
        <li>Your account is now fully activated and ready to use</li>
      </ol>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>✅ Success:</strong> Once verified, you'll have full access to all Zerlo features and can start creating projects immediately.</p>
      </div>
      
      <h2 id="account-setup">Complete Your Profile</h2>
      <p>After creating your account, enhance your experience by:</p>
      <ul>
        <li>Adding a profile picture</li>
        <li>Setting your development preferences</li>
        <li>Choosing your favorite project types</li>
        <li>Connecting with team members</li>
        <li>Exploring available templates</li>
      </ul>
      
      <h2 id="first-project">Create Your First Project</h2>
      <p>Ready to start building? Here's what to do next:</p>
      <ol>
        <li>Click "New Project" from your dashboard</li>
        <li>Choose between Game, Website, or TypeScript project</li>
        <li>Describe your vision in natural language</li>
        <li>Watch as Zerlo's AI brings your idea to life</li>
        <li>Customize, test, and deploy your creation</li>
      </ol>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
        <p><strong>🚀 Pro Tip:</strong> Start with a simple project to get familiar with Zerlo's capabilities, then gradually explore more advanced features.</p>
      </div>
    `,
  },
  "game-development/quick-start": {
    title: "Game Development Quick Start",
    description: "Build your first game with Zerlo AI in minutes, no coding experience required.",
    content: `
      <h2 id="game-dev-intro">Introduction to Game Development with Zerlo</h2>
      <p>Zerlo revolutionizes game development by making it accessible to everyone. Whether you're a complete beginner or an experienced developer, our AI understands game mechanics, graphics, and user interactions to create engaging games from simple descriptions.</p>
      
      <h2 id="supported-game-types">Supported Game Types</h2>
      <p>Zerlo can create a wide variety of game genres:</p>
      <ul>
        <li><strong>2D Platformers:</strong> Classic side-scrolling adventures with jumping mechanics</li>
        <li><strong>Puzzle Games:</strong> Logic-based challenges and brain teasers</li>
        <li><strong>Arcade Games:</strong> Fast-paced action games with high scores</li>
        <li><strong>RPG Elements:</strong> Character progression and story-driven experiences</li>
        <li><strong>Strategy Games:</strong> Turn-based and real-time strategic gameplay</li>
        <li><strong>Casual Games:</strong> Simple, addictive gameplay for all ages</li>
        <li><strong>Multiplayer Games:</strong> Real-time multiplayer experiences</li>
      </ul>
      
      <h2 id="creating-first-game">Creating Your First Game</h2>
      <p>Follow these simple steps to create your first game:</p>
      
      <h3 id="step-1">Step 1: Choose Your Game Type</h3>
      <ol>
        <li>Log into your Zerlo dashboard</li>
        <li>Click "New Project" and select "Game"</li>
        <li>Browse our game templates or start from scratch</li>
        <li>Select the genre that matches your vision</li>
      </ol>
      
      <h3 id="step-2">Step 2: Describe Your Vision</h3>
      <p>Tell Zerlo what kind of game you want to create. Be as detailed as possible:</p>
      <ul>
        <li>Game genre and style</li>
        <li>Main character or player mechanics</li>
        <li>Objectives and win conditions</li>
        <li>Visual style preferences</li>
        <li>Target difficulty level</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/gamechat.png" alt="Game Development Interface" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Zerlo's intuitive game development interface</p>
      </div>
      
      <h3 id="step-3">Step 3: AI Generation</h3>
      <p>Watch as Zerlo's AI creates your game:</p>
      <ul>
        <li>Game mechanics are automatically implemented</li>
        <li>Graphics and animations are generated</li>
        <li>Sound effects and music are added</li>
        <li>User interface elements are created</li>
        <li>Game logic and rules are programmed</li>
      </ul>
      
      <h3 id="step-4">Step 4: Customize and Test</h3>
      <p>Fine-tune your game to perfection:</p>
      <ul>
        <li>Adjust gameplay mechanics</li>
        <li>Modify graphics and animations</li>
        <li>Change colors and visual themes</li>
        <li>Add or remove game elements</li>
        <li>Test gameplay and balance</li>
      </ul>
      
      <h3 id="step-5">Step 5: Publish and Share</h3>
      <p>Share your creation with the world:</p>
      <ul>
        <li>Deploy to web platforms</li>
        <li>Generate mobile app versions</li>
        <li>Share with friends and family</li>
        <li>Submit to game portals</li>
        <li>Monetize your creation</li>
      </ul>
      
      <h2 id="example-prompts">Example Game Prompts</h2>
      <p>Here are some example prompts to inspire your first game:</p>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Create a 2D platformer where a robot collects energy crystals while avoiding laser obstacles and jumping over gaps"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Build a puzzle game where players match colored gems in groups of three or more to clear the board and score points"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Design a space shooter where the player controls a spaceship defending Earth from waves of alien invaders"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Create a simple RPG where a hero explores dungeons, fights monsters, and collects treasure to level up"</strong></p>
      </div>
      
      <h2 id="game-mechanics">Common Game Mechanics</h2>
      <p>Zerlo automatically implements these common game mechanics:</p>
      
      <h3 id="player-controls">Player Controls</h3>
      <ul>
        <li>Keyboard and mouse input handling</li>
        <li>Touch controls for mobile devices</li>
        <li>Gamepad support</li>
        <li>Customizable control schemes</li>
      </ul>
      
      <h3 id="physics-collision">Physics and Collision</h3>
      <ul>
        <li>Realistic physics simulation</li>
        <li>Collision detection between objects</li>
        <li>Gravity and movement mechanics</li>
        <li>Boundary and wall interactions</li>
      </ul>
      
      <h3 id="game-systems">Game Systems</h3>
      <ul>
        <li>Scoring and point systems</li>
        <li>Health and lives management</li>
        <li>Power-ups and collectibles</li>
        <li>Level progression and unlocks</li>
        <li>Save and load functionality</li>
      </ul>
      
      <h3 id="ai-enemies">AI and Enemies</h3>
      <ul>
        <li>Enemy movement patterns</li>
        <li>AI behavior and decision making</li>
        <li>Difficulty scaling</li>
        <li>Boss battle mechanics</li>
      </ul>
      
      <h2 id="advanced-features">Advanced Features</h2>
      <p>As you become more comfortable with Zerlo, explore these advanced features:</p>
      <ul>
        <li><strong>Custom Assets:</strong> Upload your own graphics and sounds</li>
        <li><strong>Scripting:</strong> Add custom game logic with visual scripting</li>
        <li><strong>Multiplayer:</strong> Create online multiplayer experiences</li>
        <li><strong>Analytics:</strong> Track player behavior and game performance</li>
        <li><strong>Monetization:</strong> Add ads, in-app purchases, or premium features</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/advanced.png" alt="Advanced Game Features" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Advanced customization options for experienced developers</p>
      </div>
    `,
  },
  "game-development/advanced": {
    title: "Advanced Game Development",
    description: "Master advanced game development techniques and create complex, engaging games.",
    content: `
      <h2 id="advanced-overview">Advanced Game Development Overview</h2>
      <p>Take your game development skills to the next level with Zerlo's advanced features. Create complex, professional-quality games with sophisticated mechanics, stunning visuals, and engaging gameplay.</p>
      
      <h2 id="complex-game-systems">Complex Game Systems</h2>
      
      <h3 id="state-management">Advanced State Management</h3>
      <p>Manage complex game states and transitions:</p>
      <ul>
        <li><strong>Game State Machines:</strong> Menu, gameplay, pause, game over states</li>
        <li><strong>Level Management:</strong> Dynamic level loading and transitions</li>
        <li><strong>Save Systems:</strong> Complex save data with multiple slots</li>
        <li><strong>Settings Management:</strong> User preferences and configurations</li>
      </ul>
      
      <h3 id="advanced-ai">Advanced AI Systems</h3>
      <p>Create intelligent and challenging opponents:</p>
      <ul>
        <li><strong>Behavior Trees:</strong> Complex AI decision making</li>
        <li><strong>Pathfinding:</strong> A* algorithm for navigation</li>
        <li><strong>Machine Learning:</strong> AI that adapts to player behavior</li>
        <li><strong>Swarm Intelligence:</strong> Coordinated group behaviors</li>
      </ul>
      
      <h2 id="advanced-graphics">Advanced Graphics and Visual Effects</h2>
      
      <h3 id="particle-systems">Particle Systems</h3>
      <p>Create stunning visual effects:</p>
      <ul>
        <li>Fire, smoke, and explosion effects</li>
        <li>Weather systems (rain, snow, fog)</li>
        <li>Magic spells and power-up effects</li>
        <li>Environmental particles</li>
      </ul>
      
      <h3 id="lighting-shaders">Lighting and Shaders</h3>
      <p>Advanced visual rendering techniques:</p>
      <ul>
        <li>Dynamic lighting systems</li>
        <li>Shadow casting and soft shadows</li>
        <li>Custom shader effects</li>
        <li>Post-processing effects</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/advanced.png" alt="Advanced Graphics Effects" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Stunning visual effects and advanced graphics</p>
      </div>
      
      <h2 id="multiplayer-networking">Multiplayer and Networking</h2>
      
      <h3 id="real-time-multiplayer">Real-time Multiplayer</h3>
      <p>Create engaging multiplayer experiences:</p>
      <ul>
        <li><strong>Client-Server Architecture:</strong> Authoritative server design</li>
        <li><strong>Lag Compensation:</strong> Smooth gameplay despite network latency</li>
        <li><strong>Prediction Systems:</strong> Client-side prediction for responsiveness</li>
        <li><strong>Synchronization:</strong> Keep all players in sync</li>
      </ul>
      
      <h3 id="matchmaking">Matchmaking Systems</h3>
      <p>Connect players effectively:</p>
      <ul>
        <li>Skill-based matchmaking</li>
        <li>Lobby and room systems</li>
        <li>Friend and party systems</li>
        <li>Tournament and ranking systems</li>
      </ul>
      
      <h2 id="performance-optimization">Performance Optimization</h2>
      
      <h3 id="rendering-optimization">Rendering Optimization</h3>
      <p>Ensure smooth performance across devices:</p>
      <ul>
        <li><strong>Object Pooling:</strong> Reuse game objects efficiently</li>
        <li><strong>Level of Detail (LOD):</strong> Reduce complexity at distance</li>
        <li><strong>Culling Systems:</strong> Don't render what's not visible</li>
        <li><strong>Texture Optimization:</strong> Compress and optimize graphics</li>
      </ul>
      
      <h3 id="memory-management">Memory Management</h3>
      <p>Optimize memory usage:</p>
      <ul>
        <li>Asset streaming and loading</li>
        <li>Garbage collection optimization</li>
        <li>Memory profiling and debugging</li>
        <li>Platform-specific optimizations</li>
      </ul>
      
      <h2 id="audio-systems">Advanced Audio Systems</h2>
      
      <h3 id="dynamic-audio">Dynamic Audio</h3>
      <p>Create immersive soundscapes:</p>
      <ul>
        <li><strong>Adaptive Music:</strong> Music that responds to gameplay</li>
        <li><strong>3D Spatial Audio:</strong> Positional sound effects</li>
        <li><strong>Audio Mixing:</strong> Dynamic volume and effect control</li>
        <li><strong>Voice Acting:</strong> Character dialogue and narration</li>
      </ul>
      
      <h2 id="monetization-strategies">Monetization Strategies</h2>
      
      <h3 id="revenue-models">Revenue Models</h3>
      <p>Monetize your games effectively:</p>
      <ul>
        <li><strong>Premium Games:</strong> One-time purchase model</li>
        <li><strong>Free-to-Play:</strong> In-app purchases and microtransactions</li>
        <li><strong>Subscription:</strong> Recurring revenue models</li>
        <li><strong>Advertising:</strong> Banner, interstitial, and rewarded ads</li>
      </ul>
      
      <h3 id="analytics-tracking">Analytics and Tracking</h3>
      <p>Understand your players:</p>
      <ul>
        <li>Player behavior analytics</li>
        <li>Retention and engagement metrics</li>
        <li>Revenue tracking and optimization</li>
        <li>A/B testing for game features</li>
      </ul>
      
      <h2 id="platform-deployment">Multi-Platform Deployment</h2>
      
      <h3 id="platform-optimization">Platform-Specific Optimization</h3>
      <p>Optimize for different platforms:</p>
      <ul>
        <li><strong>Mobile (iOS/Android):</strong> Touch controls and performance</li>
        <li><strong>Web Browsers:</strong> WebGL and progressive loading</li>
        <li><strong>Desktop (PC/Mac):</strong> High-resolution graphics and controls</li>
        <li><strong>Consoles:</strong> Platform-specific features and requirements</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/chatComponentcode.png" alt="Multi-Platform Deployment" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Deploy your games across multiple platforms</p>
      </div>
      
      <h2 id="advanced-prompts">Advanced Game Prompts</h2>
      <p>Examples of complex game descriptions for advanced projects:</p>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>"Create a real-time strategy game where players build bases, manage resources, and command armies in epic battles with fog of war and unit formations"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>"Build a multiplayer battle royale game with 100 players, shrinking play area, weapon crafting, and team-based gameplay"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>"Design an open-world RPG with dynamic weather, day/night cycles, NPC relationships, and branching storylines"</strong></p>
      </div>
      
      <h2 id="best-practices">Best Practices</h2>
      <p>Follow these guidelines for professional game development:</p>
      <ul>
        <li><strong>Iterative Development:</strong> Build, test, and refine continuously</li>
        <li><strong>Player Testing:</strong> Get feedback early and often</li>
        <li><strong>Performance First:</strong> Optimize for your target platform</li>
        <li><strong>Accessibility:</strong> Make games playable for everyone</li>
        <li><strong>Documentation:</strong> Keep detailed records of your design decisions</li>
      </ul>
    `,
  },
  "web-development/basics": {
    title: "Web Development Basics",
    description: "Learn how to create stunning, responsive websites with Zerlo AI.",
    content: `
      <h2 id="web-dev-overview">Web Development with Zerlo</h2>
      <p>Zerlo revolutionizes web development by understanding your requirements and generating complete, responsive websites with modern design principles, best practices, and cutting-edge technologies.</p>
      
      <h2 id="website-types">Types of Websites You Can Build</h2>
      <p>Zerlo can create virtually any type of website:</p>
      
      <h3 id="business-websites">Business Websites</h3>
      <ul>
        <li><strong>Corporate Sites:</strong> Professional company presence</li>
        <li><strong>Landing Pages:</strong> Convert visitors into customers</li>
        <li><strong>Service Pages:</strong> Showcase your offerings</li>
        <li><strong>About Pages:</strong> Tell your company story</li>
      </ul>
      
      <h3 id="ecommerce-sites">E-commerce Sites</h3>
      <ul>
        <li><strong>Online Stores:</strong> Sell products with shopping carts</li>
        <li><strong>Marketplace Platforms:</strong> Multi-vendor solutions</li>
        <li><strong>Subscription Services:</strong> Recurring payment models</li>
        <li><strong>Digital Downloads:</strong> Sell digital products</li>
      </ul>
      
      <h3 id="creative-portfolios">Creative Portfolios</h3>
      <ul>
        <li><strong>Designer Portfolios:</strong> Showcase creative work</li>
        <li><strong>Photography Sites:</strong> Display photo galleries</li>
        <li><strong>Artist Websites:</strong> Promote artistic creations</li>
        <li><strong>Developer Portfolios:</strong> Highlight coding projects</li>
      </ul>
      
      <h3 id="content-platforms">Content Platforms</h3>
      <ul>
        <li><strong>Blogs:</strong> Share thoughts and expertise</li>
        <li><strong>News Sites:</strong> Publish articles and updates</li>
        <li><strong>Documentation:</strong> Technical guides and manuals</li>
        <li><strong>Educational Sites:</strong> Online learning platforms</li>
      </ul>
      
      <h2 id="web-creation-process">Website Creation Process</h2>
      
      <h3 id="step-1-planning">Step 1: Define Your Purpose</h3>
      <p>Start by clearly describing your website's goals:</p>
      <ul>
        <li>What is the main purpose of your website?</li>
        <li>Who is your target audience?</li>
        <li>What actions do you want visitors to take?</li>
        <li>What content will you include?</li>
      </ul>
      
      <h3 id="step-2-design">Step 2: Choose Your Style</h3>
      <p>Select design preferences that match your brand:</p>
      <ul>
        <li>Color scheme and branding</li>
        <li>Typography and fonts</li>
        <li>Layout and structure preferences</li>
        <li>Visual style (modern, classic, minimalist, etc.)</li>
      </ul>
      
      <h3 id="step-3-content">Step 3: Provide Content</h3>
      <p>Supply the content for your website:</p>
      <ul>
        <li>Text content and copy</li>
        <li>Images and media files</li>
        <li>Logo and branding assets</li>
        <li>Contact information</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/gamechat.png" alt="Website Builder Interface" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Zerlo's intuitive website builder interface</p>
      </div>
      
      <h3 id="step-4-generation">Step 4: AI Generation</h3>
      <p>Watch as Zerlo creates your website:</p>
      <ul>
        <li>Responsive layout generation</li>
        <li>Modern CSS styling</li>
        <li>Interactive JavaScript features</li>
        <li>SEO optimization</li>
        <li>Performance optimization</li>
      </ul>
      
      <h3 id="step-5-customization">Step 5: Customization</h3>
      <p>Fine-tune your website to perfection:</p>
      <ul>
        <li>Adjust colors and fonts</li>
        <li>Modify layout and spacing</li>
        <li>Add or remove sections</li>
        <li>Customize interactive elements</li>
        <li>Optimize for mobile devices</li>
      </ul>
      
      <h3 id="step-6-deployment">Step 6: Launch Your Website</h3>
      <p>Deploy your website to the world:</p>
      <ul>
        <li>One-click deployment to Zerlo hosting</li>
        <li>Custom domain connection</li>
        <li>SSL certificate installation</li>
        <li>CDN setup for fast loading</li>
        <li>Analytics integration</li>
      </ul>
      
      <h2 id="design-principles">Built-in Design Principles</h2>
      <p>Every website created with Zerlo follows modern design principles:</p>
      
      <h3 id="responsive-design">Responsive Design</h3>
      <ul>
        <li>Mobile-first approach</li>
        <li>Flexible grid systems</li>
        <li>Adaptive images and media</li>
        <li>Touch-friendly interfaces</li>
      </ul>
      
      <h3 id="performance">Performance Optimization</h3>
      <ul>
        <li>Fast loading times</li>
        <li>Optimized images and assets</li>
        <li>Efficient code structure</li>
        <li>Caching strategies</li>
      </ul>
      
      <h3 id="seo-friendly">SEO Friendly</h3>
      <ul>
        <li>Semantic HTML structure</li>
        <li>Meta tags and descriptions</li>
        <li>Schema markup</li>
        <li>Sitemap generation</li>
      </ul>
      
      <h3 id="accessibility">Accessibility</h3>
      <ul>
        <li>WCAG compliance</li>
        <li>Screen reader compatibility</li>
        <li>Keyboard navigation</li>
        <li>Color contrast optimization</li>
      </ul>
      
      <h2 id="modern-features">Modern Web Features</h2>
      <p>Zerlo automatically includes modern web features:</p>
      
      <h3 id="interactive-elements">Interactive Elements</h3>
      <ul>
        <li>Smooth animations and transitions</li>
        <li>Interactive forms with validation</li>
        <li>Image galleries and sliders</li>
        <li>Modal windows and popups</li>
      </ul>
      
      <h3 id="integration-capabilities">Integration Capabilities</h3>
      <ul>
        <li>Social media integration</li>
        <li>Email marketing tools</li>
        <li>Analytics and tracking</li>
        <li>Payment processing</li>
        <li>CMS integration</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/features.png" alt="Modern Web Features" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Modern, interactive web features</p>
      </div>
      
      <h2 id="example-websites">Example Website Prompts</h2>
      <p>Here are some example prompts to inspire your website creation:</p>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Create a modern portfolio website for a graphic designer with a dark theme, animated elements, and a gallery showcasing design work"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Build an e-commerce store for handmade jewelry with product galleries, shopping cart, customer reviews, and secure checkout"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Design a restaurant website with menu display, online reservations, location information, and customer testimonials"</strong></p>
      </div>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>"Create a corporate website for a tech startup with hero section, services overview, team profiles, and contact form"</strong></p>
      </div>
      
      <h2 id="customization-options">Customization Options</h2>
      <p>After AI generation, you can customize every aspect:</p>
      
      <h3 id="visual-customization">Visual Customization</h3>
      <ul>
        <li>Colors, fonts, and typography</li>
        <li>Layout and spacing adjustments</li>
        <li>Image placement and sizing</li>
        <li>Background patterns and textures</li>
      </ul>
      
      <h3 id="content-management">Content Management</h3>
      <ul>
        <li>Text editing and formatting</li>
        <li>Image and media management</li>
        <li>Page structure modifications</li>
        <li>SEO content optimization</li>
      </ul>
      
      <h3 id="functionality-enhancement">Functionality Enhancement</h3>
      <ul>
        <li>Form creation and validation</li>
        <li>E-commerce features</li>
        <li>Social media integration</li>
        <li>Third-party service connections</li>
      </ul>
      
      <h2 id="best-practices">Web Development Best Practices</h2>
      <p>Zerlo automatically implements these best practices:</p>
      <ul>
        <li><strong>Clean Code:</strong> Well-structured, maintainable code</li>
        <li><strong>Security:</strong> Protection against common vulnerabilities</li>
        <li><strong>Performance:</strong> Optimized for speed and efficiency</li>
        <li><strong>Standards Compliance:</strong> Following web standards and guidelines</li>
        <li><strong>Cross-Browser Compatibility:</strong> Works across all modern browsers</li>
      </ul>
    `,
  },
  "web-development/deployment": {
    title: "Website Deployment",
    description: "Deploy your Zerlo-created websites to production with ease.",
    content: `
      <h2 id="deployment-overview">Deployment Overview</h2>
      <p>Zerlo makes website deployment simple and straightforward. Whether you're launching a personal blog or a complex e-commerce site, our deployment tools ensure your website goes live quickly and reliably.</p>
      
      <h2 id="deployment-options">Deployment Options</h2>
      
      <h3 id="zerlo-hosting">Zerlo Hosting (Recommended)</h3>
      <p>The easiest way to deploy your website:</p>
      <ul>
        <li><strong>One-Click Deployment:</strong> Deploy instantly from your dashboard</li>
        <li><strong>Global CDN:</strong> Fast loading times worldwide</li>
        <li><strong>SSL Certificates:</strong> Automatic HTTPS encryption</li>
        <li><strong>Custom Domains:</strong> Use your own domain name</li>
        <li><strong>Automatic Backups:</strong> Your site is always protected</li>
        <li><strong>99.9% Uptime:</strong> Reliable hosting infrastructure</li>
      </ul>
      
      <h3 id="third-party-hosting">Third-Party Hosting</h3>
      <p>Deploy to your preferred hosting provider:</p>
      <ul>
        <li><strong>Vercel:</strong> Optimized for modern web frameworks</li>
        <li><strong>Netlify:</strong> JAMstack-focused hosting</li>
        <li><strong>AWS:</strong> Enterprise-grade cloud hosting</li>
        <li><strong>Google Cloud:</strong> Scalable cloud infrastructure</li>
        <li><strong>Traditional Hosting:</strong> cPanel and FTP support</li>
      </ul>
      
      <h2 id="deployment-process">Deployment Process</h2>
      
      <h3 id="pre-deployment">Pre-Deployment Checklist</h3>
      <p>Before deploying, ensure your website is ready:</p>
      <ul>
        <li>✅ Content is complete and proofread</li>
        <li>✅ Images are optimized and compressed</li>
        <li>✅ Contact forms are tested</li>
        <li>✅ Links are working correctly</li>
        <li>✅ Mobile responsiveness is verified</li>
        <li>✅ SEO meta tags are configured</li>
      </ul>
      
      <h3 id="zerlo-deployment">Deploying with Zerlo Hosting</h3>
      <ol>
        <li><strong>Review Your Site:</strong> Use the preview feature to check everything</li>
        <li><strong>Choose Domain:</strong> Select a free subdomain or connect your custom domain</li>
        <li><strong>Configure Settings:</strong> Set up redirects, error pages, and security options</li>
        <li><strong>Deploy:</strong> Click the "Deploy" button</li>
        <li><strong>Go Live:</strong> Your site is live in seconds!</li>
      </ol>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/deployment-dashboard.png" alt="Deployment Dashboard" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Simple deployment dashboard with one-click publishing</p>
      </div>
      
      <h3 id="custom-domain">Custom Domain Setup</h3>
      <p>Connect your own domain name:</p>
      <ol>
        <li><strong>Purchase Domain:</strong> Buy from any domain registrar</li>
        <li><strong>Add to Zerlo:</strong> Enter your domain in the deployment settings</li>
        <li><strong>Update DNS:</strong> Point your domain to Zerlo's servers</li>
        <li><strong>SSL Setup:</strong> Automatic SSL certificate provisioning</li>
        <li><strong>Verification:</strong> Confirm your domain is working correctly</li>
      </ol>
      
      <h2 id="performance-optimization">Performance Optimization</h2>
      
      <h3 id="automatic-optimizations">Automatic Optimizations</h3>
      <p>Zerlo automatically optimizes your website for performance:</p>
      <ul>
        <li><strong>Image Compression:</strong> Automatic image optimization</li>
        <li><strong>Code Minification:</strong> Compressed CSS and JavaScript</li>
        <li><strong>Caching:</strong> Browser and server-side caching</li>
        <li><strong>CDN Distribution:</strong> Global content delivery network</li>
        <li><strong>Lazy Loading:</strong> Images load as needed</li>
      </ul>
      
      <h3 id="performance-monitoring">Performance Monitoring</h3>
      <p>Monitor your website's performance:</p>
      <ul>
        <li>Page load speed analytics</li>
        <li>Core Web Vitals tracking</li>
        <li>Uptime monitoring</li>
        <li>Error tracking and alerts</li>
        <li>Performance recommendations</li>
      </ul>
      
      <h2 id="security-features">Security Features</h2>
      
      <h3 id="built-in-security">Built-in Security</h3>
      <p>Your website is protected by default:</p>
      <ul>
        <li><strong>SSL/TLS Encryption:</strong> All traffic is encrypted</li>
        <li><strong>DDoS Protection:</strong> Protection against attacks</li>
        <li><strong>Firewall:</strong> Web application firewall</li>
        <li><strong>Security Headers:</strong> Proper security headers configured</li>
        <li><strong>Regular Updates:</strong> Automatic security patches</li>
      </ul>
      
      <h2 id="maintenance-updates">Maintenance and Updates</h2>
      
      <h3 id="content-updates">Content Updates</h3>
      <p>Keep your website fresh and current:</p>
      <ul>
        <li><strong>Live Editing:</strong> Make changes directly on your live site</li>
        <li><strong>Staging Environment:</strong> Test changes before going live</li>
        <li><strong>Version Control:</strong> Track and revert changes</li>
        <li><strong>Scheduled Updates:</strong> Automate content updates</li>
      </ul>
      
      <h3 id="backup-recovery">Backup and Recovery</h3>
      <p>Your website data is always safe:</p>
      <ul>
        <li>Daily automatic backups</li>
        <li>One-click restore functionality</li>
        <li>Multiple backup locations</li>
        <li>Export capabilities</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/Website-m.png" alt="Website Management Dashboard" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Comprehensive website management and monitoring tools</p>
      </div>
      
      <h2 id="analytics-tracking">Analytics and Tracking</h2>
      
      <h3 id="built-in-analytics">Built-in Analytics</h3>
      <p>Understand your website visitors:</p>
      <ul>
        <li>Visitor traffic and demographics</li>
        <li>Page views and popular content</li>
        <li>User behavior and flow</li>
        <li>Conversion tracking</li>
        <li>Mobile vs desktop usage</li>
      </ul>
      
      <h3 id="third-party-integration">Third-Party Integration</h3>
      <p>Connect with popular analytics tools:</p>
      <ul>
        <li>Google Analytics integration</li>
        <li>Facebook Pixel setup</li>
        <li>Hotjar heatmaps</li>
        <li>Custom tracking codes</li>
      </ul>
      
      <h2 id="troubleshooting">Deployment Troubleshooting</h2>
      
      <h3 id="common-issues">Common Issues and Solutions</h3>
      
      <h4 id="domain-not-working">Domain Not Working</h4>
      <p><strong>Problem:</strong> Custom domain shows an error</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Check DNS propagation (can take up to 48 hours)</li>
        <li>Verify DNS records are correct</li>
        <li>Clear browser cache</li>
        <li>Contact support if issues persist</li>
      </ul>
      
      <h4 id="slow-loading">Slow Loading Times</h4>
      <p><strong>Problem:</strong> Website loads slowly</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Optimize large images</li>
        <li>Enable caching features</li>
        <li>Check third-party integrations</li>
        <li>Use performance monitoring tools</li>
      </ul>
      
      <h4 id="ssl-issues">SSL Certificate Issues</h4>
      <p><strong>Problem:</strong> SSL certificate not working</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Wait for automatic provisioning (up to 24 hours)</li>
        <li>Check domain verification</li>
        <li>Force SSL renewal in settings</li>
        <li>Contact support for manual intervention</li>
      </ul>
      
      <h2 id="scaling-growth">Scaling for Growth</h2>
      
      <h3 id="traffic-scaling">Handling Increased Traffic</h3>
      <p>As your website grows, Zerlo scales with you:</p>
      <ul>
        <li><strong>Auto-scaling:</strong> Automatic resource allocation</li>
        <li><strong>Load Balancing:</strong> Distribute traffic efficiently</li>
        <li><strong>CDN Expansion:</strong> More edge locations as needed</li>
        <li><strong>Performance Monitoring:</strong> Proactive optimization</li>
      </ul>
      
      <h3 id="feature-expansion">Feature Expansion</h3>
      <p>Add new features as your needs grow:</p>
      <ul>
        <li>E-commerce capabilities</li>
        <li>User authentication systems</li>
        <li>Database integration</li>
        <li>API endpoints</li>
        <li>Advanced forms and workflows</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>🚀 Success:</strong> Your website is now live and accessible to the world! Monitor its performance and make updates as needed to keep it fresh and engaging.</p>
      </div>
    `,
  },
  "typescript/fundamentals": {
    title: "TypeScript Fundamentals",
    description: "Master TypeScript development with AI assistance from Zerlo.",
    content: `
      <h2 id="typescript-intro">TypeScript with Zerlo</h2>
      <p>Zerlo excels at generating clean, type-safe TypeScript code that follows best practices and modern patterns. Whether you're building APIs, libraries, or applications, Zerlo understands TypeScript's nuances and can help you create robust, maintainable code.</p>
      
      <h2 id="what-zerlo-generates">What Zerlo Can Generate</h2>
      <p>Zerlo can create a wide variety of TypeScript code:</p>
      
      <h3 id="backend-development">Backend Development</h3>
      <ul>
        <li><strong>API Endpoints:</strong> RESTful and GraphQL APIs with proper typing</li>
        <li><strong>Database Models:</strong> Type-safe database schemas and queries</li>
        <li><strong>Middleware:</strong> Authentication, validation, and error handling</li>
        <li><strong>Services:</strong> Business logic and data processing</li>
      </ul>
      
      <h3 id="frontend-development">Frontend Development</h3>
      <ul>
        <li><strong>React Components:</strong> Type-safe UI components with props</li>
        <li><strong>State Management:</strong> Redux, Zustand, or custom state solutions</li>
        <li><strong>Hooks:</strong> Custom React hooks with proper typing</li>
        <li><strong>Utilities:</strong> Helper functions and type utilities</li>
      </ul>
      
      <h3 id="libraries-tools">Libraries and Tools</h3>
      <ul>
        <li><strong>NPM Packages:</strong> Publishable TypeScript libraries</li>
        <li><strong>CLI Tools:</strong> Command-line applications</li>
        <li><strong>Build Scripts:</strong> Automation and deployment tools</li>
        <li><strong>Testing Utilities:</strong> Type-safe test helpers</li>
      </ul>
      
      <h2 id="code-quality">Code Quality Standards</h2>
      <p>All TypeScript code generated by Zerlo follows these high standards:</p>
      
      <h3 id="type-safety">Type Safety</h3>
      <ul>
        <li><strong>Strict Mode:</strong> All strict TypeScript options enabled</li>
        <li><strong>No Any Types:</strong> Proper typing without escape hatches</li>
        <li><strong>Generic Constraints:</strong> Proper use of generics and constraints</li>
        <li><strong>Union Types:</strong> Discriminated unions for complex data</li>
      </ul>
      
      <h3 id="code-organization">Code Organization</h3>
      <ul>
        <li><strong>Modular Structure:</strong> Well-organized file and folder structure</li>
        <li><strong>Barrel Exports:</strong> Clean import/export patterns</li>
        <li><strong>Separation of Concerns:</strong> Clear separation of logic</li>
        <li><strong>Consistent Naming:</strong> Following TypeScript conventions</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/chatComponentcode.png" alt="TypeScript Development Environment" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Advanced TypeScript development with intelligent code completion</p>
      </div>
      
      <h2 id="example-generations">Example Code Generations</h2>
      
      <h3 id="api-example">API Endpoint Example</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Create a TypeScript API endpoint for user authentication with JWT tokens, input validation, and error handling"</p>
        <p><strong>Generated:</strong> Complete Express.js endpoint with TypeScript interfaces, middleware, and proper error responses</p>
      </div>
      
      <h3 id="component-example">React Component Example</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Generate a TypeScript React component for a data table with sorting, filtering, and pagination"</p>
        <p><strong>Generated:</strong> Fully typed component with props interface, state management, and event handlers</p>
      </div>
      
      <h3 id="utility-example">Utility Function Example</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Create TypeScript utility functions for date manipulation, validation, and formatting"</p>
        <p><strong>Generated:</strong> Type-safe utility functions with proper overloads and documentation</p>
      </div>
      
      <h2 id="advanced-features">Advanced TypeScript Features</h2>
      
      <h3 id="type-system">Advanced Type System</h3>
      <p>Zerlo leverages TypeScript's powerful type system:</p>
      <ul>
        <li><strong>Mapped Types:</strong> Transform existing types</li>
        <li><strong>Conditional Types:</strong> Types that depend on conditions</li>
        <li><strong>Template Literal Types:</strong> String manipulation at type level</li>
        <li><strong>Recursive Types:</strong> Self-referencing type definitions</li>
      </ul>
      
      <h3 id="decorators">Decorators and Metadata</h3>
      <p>Modern TypeScript patterns:</p>
      <ul>
        <li><strong>Class Decorators:</strong> Enhance class functionality</li>
        <li><strong>Method Decorators:</strong> Add behavior to methods</li>
        <li><strong>Property Decorators:</strong> Validate and transform properties</li>
        <li><strong>Reflect Metadata:</strong> Runtime type information</li>
      </ul>
      
      <h2 id="integration-patterns">Common Integration Patterns</h2>
      <p>Zerlo understands and implements popular TypeScript patterns:</p>
      
      <h3 id="design-patterns">Design Patterns</h3>
      <ul>
        <li><strong>Dependency Injection:</strong> Inversion of control containers</li>
        <li><strong>Factory Pattern:</strong> Object creation with proper typing</li>
        <li><strong>Observer Pattern:</strong> Event-driven architectures</li>
        <li><strong>Strategy Pattern:</strong> Interchangeable algorithms</li>
        <li><strong>Builder Pattern:</strong> Complex object construction</li>
      </ul>
      
      <h3 id="architectural-patterns">Architectural Patterns</h3>
      <ul>
        <li><strong>Clean Architecture:</strong> Layered application structure</li>
        <li><strong>CQRS:</strong> Command Query Responsibility Segregation</li>
        <li><strong>Event Sourcing:</strong> Event-driven data persistence</li>
        <li><strong>Microservices:</strong> Distributed system architecture</li>
      </ul>
      
      <h2 id="testing-support">Testing Support</h2>
      <p>Zerlo generates comprehensive tests for your TypeScript code:</p>
      
      <h3 id="testing-frameworks">Testing Frameworks</h3>
      <ul>
        <li><strong>Jest:</strong> Unit and integration tests</li>
        <li><strong>Vitest:</strong> Fast unit testing</li>
        <li><strong>Playwright:</strong> End-to-end testing</li>
        <li><strong>Cypress:</strong> Browser testing</li>
      </ul>
      
      <h3 id="testing-patterns">Testing Patterns</h3>
      <ul>
        <li><strong>Mock Implementations:</strong> Type-safe mocks</li>
        <li><strong>Test Utilities:</strong> Reusable testing helpers</li>
        <li><strong>Fixture Data:</strong> Type-safe test data</li>
        <li><strong>Coverage Reports:</strong> Comprehensive test coverage</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/advanced.png" alt="TypeScript Testing Suite" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Comprehensive testing setup with type safety</p>
      </div>
      
      <h2 id="performance-optimization">Performance Optimization</h2>
      
      <h3 id="build-optimization">Build Optimization</h3>
      <p>Zerlo generates optimized TypeScript builds:</p>
      <ul>
        <li><strong>Tree Shaking:</strong> Remove unused code</li>
        <li><strong>Code Splitting:</strong> Lazy loading and chunks</li>
        <li><strong>Bundle Analysis:</strong> Optimize bundle size</li>
        <li><strong>Compilation Speed:</strong> Fast incremental builds</li>
      </ul>
      
      <h3 id="runtime-optimization">Runtime Optimization</h3>
      <p>Performance-focused code generation:</p>
      <ul>
        <li><strong>Memory Management:</strong> Efficient object creation</li>
        <li><strong>Algorithm Optimization:</strong> Optimal data structures</li>
        <li><strong>Async Patterns:</strong> Non-blocking operations</li>
        <li><strong>Caching Strategies:</strong> Intelligent data caching</li>
      </ul>
      
      <h2 id="deployment-packaging">Deployment and Packaging</h2>
      
      <h3 id="build-tools">Build Tools</h3>
      <p>Modern build toolchain setup:</p>
      <ul>
        <li><strong>Vite:</strong> Fast development and building</li>
        <li><strong>Webpack:</strong> Advanced bundling configuration</li>
        <li><strong>Rollup:</strong> Library packaging</li>
        <li><strong>esbuild:</strong> Ultra-fast compilation</li>
      </ul>
      
      <h3 id="package-publishing">Package Publishing</h3>
      <p>NPM package creation and publishing:</p>
      <ul>
        <li><strong>Package.json:</strong> Proper configuration</li>
        <li><strong>Type Declarations:</strong> .d.ts file generation</li>
        <li><strong>Documentation:</strong> README and API docs</li>
        <li><strong>Versioning:</strong> Semantic versioning</li>
      </ul>
      
      <h2 id="best-practices">TypeScript Best Practices</h2>
      <p>Zerlo automatically implements these best practices:</p>
      
      <h3 id="code-style">Code Style</h3>
      <ul>
        <li><strong>ESLint Configuration:</strong> Consistent code style</li>
        <li><strong>Prettier Integration:</strong> Automatic code formatting</li>
        <li><strong>Import Organization:</strong> Clean import statements</li>
        <li><strong>Naming Conventions:</strong> Consistent naming patterns</li>
      </ul>
      
      <h3 id="error-handling">Error Handling</h3>
      <ul>
        <li><strong>Result Types:</strong> Functional error handling</li>
        <li><strong>Custom Errors:</strong> Typed error classes</li>
        <li><strong>Validation:</strong> Input validation with types</li>
        <li><strong>Logging:</strong> Structured logging with types</li>
      </ul>
      
      <h2 id="learning-resources">Learning and Documentation</h2>
      <p>Zerlo generates code with comprehensive documentation:</p>
      <ul>
        <li><strong>JSDoc Comments:</strong> Detailed function documentation</li>
        <li><strong>Type Annotations:</strong> Clear type information</li>
        <li><strong>Usage Examples:</strong> Code examples and demos</li>
        <li><strong>API Documentation:</strong> Generated API docs</li>
        <li><strong>Migration Guides:</strong> Upgrade and migration help</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>🎯 Pro Tip:</strong> Start with simple TypeScript projects and gradually explore more advanced features. Zerlo's AI will adapt to your skill level and help you learn best practices along the way.</p>
      </div>
    `,
  },
  "typescript/advanced-features": {
    title: "Advanced TypeScript Features",
    description: "Explore advanced TypeScript concepts and patterns with Zerlo's AI assistance.",
    content: `
      <h2 id="advanced-overview">Advanced TypeScript Overview</h2>
      <p>Take your TypeScript skills to the next level with Zerlo's advanced code generation capabilities. Master complex type systems, design patterns, and architectural concepts that power modern applications.</p>
      
      <h2 id="advanced-type-system">Advanced Type System</h2>
      
      <h3 id="mapped-types">Mapped Types</h3>
      <p>Transform existing types to create new ones:</p>
      <ul>
        <li><strong>Partial and Required:</strong> Make properties optional or required</li>
        <li><strong>Pick and Omit:</strong> Select or exclude specific properties</li>
        <li><strong>Record Types:</strong> Create objects with specific key-value patterns</li>
        <li><strong>Custom Mapped Types:</strong> Create your own type transformations</li>
      </ul>
      
      <h3 id="conditional-types">Conditional Types</h3>
      <p>Types that change based on conditions:</p>
      <ul>
        <li><strong>Type Guards:</strong> Runtime type checking</li>
        <li><strong>Distributive Types:</strong> Types that distribute over unions</li>
        <li><strong>Infer Keyword:</strong> Extract types from other types</li>
        <li><strong>Recursive Conditionals:</strong> Complex type logic</li>
      </ul>
      
      <h3 id="template-literals">Template Literal Types</h3>
      <p>String manipulation at the type level:</p>
      <ul>
        <li><strong>String Patterns:</strong> Enforce string formats</li>
        <li><strong>Path Building:</strong> Type-safe URL and path construction</li>
        <li><strong>CSS-in-JS:</strong> Type-safe styling</li>
        <li><strong>API Endpoints:</strong> Type-safe route definitions</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=400&width=700" alt="Advanced TypeScript Types" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Complex type system visualization and relationships</p>
      </div>
      
      <h2 id="metaprogramming">Metaprogramming</h2>
      
      <h3 id="decorators">Decorators</h3>
      <p>Add metadata and behavior to classes and methods:</p>
      <ul>
        <li><strong>Class Decorators:</strong> Enhance class functionality</li>
        <li><strong>Method Decorators:</strong> Add cross-cutting concerns</li>
        <li><strong>Property Decorators:</strong> Validation and transformation</li>
        <li><strong>Parameter Decorators:</strong> Dependency injection</li>
      </ul>
      
      <h3 id="reflection">Reflection and Metadata</h3>
      <p>Runtime type information and manipulation:</p>
      <ul>
        <li><strong>Reflect Metadata:</strong> Store and retrieve metadata</li>
        <li><strong>Type Guards:</strong> Runtime type checking</li>
        <li><strong>Serialization:</strong> Type-safe data transformation</li>
        <li><strong>Validation:</strong> Runtime schema validation</li>
      </ul>
      
      <h2 id="architectural-patterns">Architectural Patterns</h2>
      
      <h3 id="dependency-injection">Dependency Injection</h3>
      <p>Inversion of control for better testability:</p>
      <ul>
        <li><strong>IoC Containers:</strong> Automatic dependency resolution</li>
        <li><strong>Service Locator:</strong> Service discovery patterns</li>
        <li><strong>Factory Injection:</strong> Dynamic object creation</li>
        <li><strong>Scoped Services:</strong> Lifecycle management</li>
      </ul>
      
      <h3 id="clean-architecture">Clean Architecture</h3>
      <p>Layered application structure:</p>
      <ul>
        <li><strong>Domain Layer:</strong> Business logic and entities</li>
        <li><strong>Application Layer:</strong> Use cases and services</li>
        <li><strong>Infrastructure Layer:</strong> External dependencies</li>
        <li><strong>Presentation Layer:</strong> User interface and controllers</li>
      </ul>
      
      <h3 id="cqrs-pattern">CQRS Pattern</h3>
      <p>Command Query Responsibility Segregation:</p>
      <ul>
        <li><strong>Command Handlers:</strong> Write operations</li>
        <li><strong>Query Handlers:</strong> Read operations</li>
        <li><strong>Event Sourcing:</strong> Event-driven data persistence</li>
        <li><strong>Read Models:</strong> Optimized query projections</li>
      </ul>
      
      <h2 id="advanced-generics">Advanced Generics</h2>
      
      <h3 id="generic-constraints">Generic Constraints</h3>
      <p>Limit generic types with constraints:</p>
      <ul>
        <li><strong>Extends Constraints:</strong> Type inheritance requirements</li>
        <li><strong>Keyof Constraints:</strong> Property key restrictions</li>
        <li><strong>Conditional Constraints:</strong> Dynamic type requirements</li>
        <li><strong>Multiple Constraints:</strong> Complex type relationships</li>
      </ul>
      
      <h3 id="higher-order-types">Higher-Order Types</h3>
      <p>Types that operate on other types:</p>
      <ul>
        <li><strong>Type Constructors:</strong> Functions that create types</li>
        <li><strong>Kind System:</strong> Types of types</li>
        <li><strong>Functor Patterns:</strong> Mappable type containers</li>
        <li><strong>Monad Patterns:</strong> Chainable computations</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=350&width=650" alt="Generic Type System" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Advanced generic type relationships and constraints</p>
      </div>
      
      <h2 id="performance-patterns">Performance Patterns</h2>
      
      <h3 id="lazy-evaluation">Lazy Evaluation</h3>
      <p>Defer computation until needed:</p>
      <ul>
        <li><strong>Lazy Properties:</strong> Computed properties on demand</li>
        <li><strong>Memoization:</strong> Cache expensive computations</li>
        <li><strong>Proxy Objects:</strong> Intercept property access</li>
        <li><strong>Virtual Properties:</strong> Dynamic property generation</li>
      </ul>
      
      <h3 id="memory-optimization">Memory Optimization</h3>
      <p>Efficient memory usage patterns:</p>
      <ul>
        <li><strong>Object Pooling:</strong> Reuse expensive objects</li>
        <li><strong>Weak References:</strong> Prevent memory leaks</li>
        <li><strong>Flyweight Pattern:</strong> Share common data</li>
        <li><strong>Copy-on-Write:</strong> Efficient data copying</li>
      </ul>
      
      <h2 id="async-patterns">Advanced Async Patterns</h2>
      
      <h3 id="async-iterators">Async Iterators</h3>
      <p>Handle streaming data efficiently:</p>
      <ul>
        <li><strong>Async Generators:</strong> Produce values over time</li>
        <li><strong>Stream Processing:</strong> Handle large datasets</li>
        <li><strong>Backpressure:</strong> Control data flow</li>
        <li><strong>Error Handling:</strong> Robust error propagation</li>
      </ul>
      
      <h3 id="concurrency-patterns">Concurrency Patterns</h3>
      <p>Manage concurrent operations:</p>
      <ul>
        <li><strong>Worker Threads:</strong> CPU-intensive tasks</li>
        <li><strong>Actor Model:</strong> Message-passing concurrency</li>
        <li><strong>Channel Patterns:</strong> Communication between tasks</li>
        <li><strong>Semaphores:</strong> Resource access control</li>
      </ul>
      
      <h2 id="type-level-programming">Type-Level Programming</h2>
      
      <h3 id="type-functions">Type Functions</h3>
      <p>Compute types at compile time:</p>
      <ul>
        <li><strong>Arithmetic Types:</strong> Mathematical operations on types</li>
        <li><strong>String Manipulation:</strong> Parse and transform strings</li>
        <li><strong>List Operations:</strong> Array and tuple manipulation</li>
        <li><strong>Tree Traversal:</strong> Navigate complex type structures</li>
      </ul>
      
      <h3 id="parser-combinators">Parser Combinators</h3>
      <p>Build parsers at the type level:</p>
      <ul>
        <li><strong>Grammar Definition:</strong> Define parsing rules</li>
        <li><strong>Token Recognition:</strong> Identify language elements</li>
        <li><strong>AST Generation:</strong> Build abstract syntax trees</li>
        <li><strong>Error Recovery:</strong> Handle parsing errors</li>
      </ul>
      
      <h2 id="advanced-testing">Advanced Testing Patterns</h2>
      
      <h3 id="property-testing">Property-Based Testing</h3>
      <p>Test with generated data:</p>
      <ul>
        <li><strong>Generators:</strong> Create test data automatically</li>
        <li><strong>Invariants:</strong> Properties that should always hold</li>
        <li><strong>Shrinking:</strong> Find minimal failing cases</li>
        <li><strong>Stateful Testing:</strong> Test complex state machines</li>
      </ul>
      
      <h3 id="mutation-testing">Mutation Testing</h3>
      <p>Test the quality of your tests:</p>
      <ul>
        <li><strong>Code Mutations:</strong> Introduce deliberate bugs</li>
        <li><strong>Test Effectiveness:</strong> Measure test quality</li>
        <li><strong>Coverage Analysis:</strong> Find untested code paths</li>
        <li><strong>Quality Metrics:</strong> Quantify test suite health</li>
      </ul>
      
      <h2 id="compiler-integration">Compiler Integration</h2>
      
      <h3 id="custom-transformers">Custom Transformers</h3>
      <p>Extend the TypeScript compiler:</p>
      <ul>
        <li><strong>AST Manipulation:</strong> Transform code during compilation</li>
        <li><strong>Code Generation:</strong> Generate boilerplate automatically</li>
        <li><strong>Optimization:</strong> Apply custom optimizations</li>
        <li><strong>Validation:</strong> Add custom compile-time checks</li>
      </ul>
      
      <h3 id="language-services">Language Services</h3>
      <p>Enhance development experience:</p>
      <ul>
        <li><strong>Custom Completions:</strong> Domain-specific autocomplete</li>
        <li><strong>Error Messages:</strong> Improved error reporting</li>
        <li><strong>Refactoring:</strong> Automated code transformations</li>
        <li><strong>Navigation:</strong> Enhanced code navigation</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=400&width=700" alt="TypeScript Compiler Integration" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Advanced compiler integration and tooling</p>
      </div>
      
      <h2 id="real-world-examples">Real-World Examples</h2>
      
      <h3 id="orm-example">Type-Safe ORM</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Create a type-safe ORM with query builder, migrations, and relationship mapping"</p>
        <p><strong>Generated:</strong> Complete ORM with compile-time query validation and type inference</p>
      </div>
      
      <h3 id="state-machine">State Machine</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Build a type-safe state machine with transitions, guards, and actions"</p>
        <p><strong>Generated:</strong> Finite state machine with compile-time state validation</p>
      </div>
      
      <h3 id="api-client">API Client Generator</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p><strong>Prompt:</strong> "Generate a type-safe API client from OpenAPI specification with caching and error handling"</p>
        <p><strong>Generated:</strong> Complete API client with TypeScript types derived from schema</p>
      </div>
      
      <h2 id="future-features">Cutting-Edge Features</h2>
      
      <h3 id="experimental-features">Experimental TypeScript Features</h3>
      <p>Stay ahead with the latest TypeScript developments:</p>
      <ul>
        <li><strong>Pattern Matching:</strong> Structural pattern matching</li>
        <li><strong>Nominal Types:</strong> Brand types for better type safety</li>
        <li><strong>Effect Systems:</strong> Track side effects in types</li>
        <li><strong>Linear Types:</strong> Resource management in types</li>
      </ul>
      
      <h3 id="integration-future">Future Integrations</h3>
      <p>Upcoming integrations and features:</p>
      <ul>
        <li><strong>WebAssembly:</strong> Compile TypeScript to WASM</li>
        <li><strong>Edge Computing:</strong> Deploy to edge environments</li>
        <li><strong>AI Integration:</strong> AI-powered code analysis</li>
        <li><strong>Quantum Computing:</strong> Quantum algorithm development</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>🚀 Master Level:</strong> You're now ready to tackle the most complex TypeScript challenges. Zerlo's AI will help you implement these advanced patterns with confidence and precision.</p>
      </div>
    `,
  },
  "api-reference": {
    title: "API Reference",
    description: "Complete reference for Zerlo API endpoints, SDKs, and integration guides.",
    content: `
      <h2 id="api-overview">API Overview</h2>
      <p>The Zerlo API provides programmatic access to all platform features, allowing you to integrate Zerlo's AI capabilities into your own applications, workflows, and development tools.</p>
      
      <h2 id="getting-started-api">Getting Started</h2>
      
      <h3 id="authentication">Authentication</h3>
      <p>All API requests require authentication using API keys. Generate your API key from your Zerlo dashboard:</p>
      
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <p>Authorization: Bearer YOUR_API_KEY</p>
      </div>
      
      <h3 id="base-url">Base URL</h3>
      <p>All API requests should be made to:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <p>https://api.zerlo.com/v1</p>
      </div>
      
      <h3 id="response-format">Response Format</h3>
      <p>All responses are returned in JSON format with the following structure:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}</pre>
      </div>
      
      <h2 id="core-endpoints">Core API Endpoints</h2>
      
      <h3 id="projects-api">Projects</h3>
      <p>Manage your Zerlo projects programmatically:</p>
      
      <h4 id="list-projects">List Projects</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>GET</strong> <code>/projects</code></p>
        <p>Retrieve a list of all your projects with pagination support.</p>
      </div>
      
      <h4 id="create-project">Create Project</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/projects</code></p>
        <p>Create a new project with specified type and configuration.</p>
      </div>
      
      <h4 id="get-project">Get Project</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
        <p><strong>GET</strong> <code>/projects/{id}</code></p>
        <p>Retrieve detailed information about a specific project.</p>
      </div>
      
      <h4 id="update-project">Update Project</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
        <p><strong>PUT</strong> <code>/projects/{id}</code></p>
        <p>Update project settings, content, or configuration.</p>
      </div>
      
      <h4 id="delete-project">Delete Project</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
        <p><strong>DELETE</strong> <code>/projects/{id}</code></p>
        <p>Permanently delete a project and all associated data.</p>
      </div>
      
      <h3 id="generation-api">AI Generation</h3>
      <p>Access Zerlo's AI generation capabilities:</p>
      
      <h4 id="generate-game">Generate Game</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/generate/game</code></p>
        <p>Generate a complete game from a text description.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>description</code> (string): Game description</li>
          <li><code>genre</code> (string): Game genre</li>
          <li><code>complexity</code> (string): Simple, Medium, Complex</li>
          <li><code>platform</code> (string): Web, Mobile, Desktop</li>
        </ul>
      </div>
      
      <h4 id="generate-website">Generate Website</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/generate/website</code></p>
        <p>Create a complete website from requirements.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>description</code> (string): Website description</li>
          <li><code>type</code> (string): Business, Portfolio, E-commerce, Blog</li>
          <li><code>style</code> (string): Modern, Classic, Minimalist</li>
          <li><code>pages</code> (array): List of required pages</li>
        </ul>
      </div>
      
      <h4 id="generate-code">Generate Code</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/generate/code</code></p>
        <p>Generate TypeScript code from specifications.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>description</code> (string): Code requirements</li>
          <li><code>language</code> (string): TypeScript, JavaScript</li>
          <li><code>framework</code> (string): React, Node.js, Express</li>
          <li><code>patterns</code> (array): Design patterns to use</li>
        </ul>
      </div>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=400&width=700" alt="API Integration Dashboard" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">API integration dashboard with real-time monitoring</p>
      </div>
      
      <h3 id="deployment-api">Deployment</h3>
      <p>Deploy and manage your projects:</p>
      
      <h4 id="deploy-project">Deploy Project</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/deploy</code></p>
        <p>Deploy a project to production.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>project_id</code> (string): Project identifier</li>
          <li><code>environment</code> (string): staging, production</li>
          <li><code>domain</code> (string): Custom domain (optional)</li>
          <li><code>config</code> (object): Deployment configuration</li>
        </ul>
      </div>
      
      <h4 id="list-deployments">List Deployments</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>GET</strong> <code>/deployments</code></p>
        <p>Get a list of all deployments with status information.</p>
      </div>
      
      <h4 id="deployment-status">Deployment Status</h4>
      <div style="margin: 1rem 0; padding: 1rem; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
        <p><strong>GET</strong> <code>/deployments/{id}</code></p>
        <p>Get detailed status of a specific deployment.</p>
      </div>
      
      <h2 id="sdks-libraries">SDKs and Libraries</h2>
      <p>Official SDKs are available for popular programming languages:</p>
      
      <h3 id="javascript-sdk">JavaScript/TypeScript SDK</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <p>npm install @zerlo/sdk</p>
      </div>
      
      <p>Basic usage example:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>import { ZerloClient } from '@zerlo/sdk';

const client = new ZerloClient({
  apiKey: 'your-api-key'
});

const project = await client.projects.create({
  name: 'My Game',
  type: 'game',
  description: 'A fun platformer game'
});</pre>
      </div>
      
      <h3 id="python-sdk">Python SDK</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <p>pip install zerlo-python</p>
      </div>
      
      <p>Basic usage example:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>from zerlo import ZerloClient

client = ZerloClient(api_key='your-api-key')

project = client.projects.create(
    name='My Website',
    type='website',
    description='A modern business website'
)</pre>
      </div>
      
      <h3 id="other-sdks">Other Languages</h3>
      <ul>
        <li><strong>Go:</strong> <code>go get github.com/zerlo/zerlo-go</code></li>
        <li><strong>PHP:</strong> <code>composer require zerlo/zerlo-php</code></li>
        <li><strong>Ruby:</strong> <code>gem install zerlo</code></li>
        <li><strong>Java:</strong> Maven and Gradle support available</li>
      </ul>
      
      <h2 id="rate-limits">Rate Limits</h2>
      <p>API requests are rate-limited based on your subscription plan:</p>
      
      <h3 id="rate-limit-tiers">Rate Limit Tiers</h3>
      <ul>
        <li><strong>Free Plan:</strong> 100 requests/hour, 1,000 requests/month</li>
        <li><strong>Pro Plan:</strong> 1,000 requests/hour, 50,000 requests/month</li>
        <li><strong>Business Plan:</strong> 5,000 requests/hour, 200,000 requests/month</li>
        <li><strong>Enterprise:</strong> Custom limits based on agreement</li>
      </ul>
      
      <h3 id="rate-limit-headers">Rate Limit Headers</h3>
      <p>All responses include rate limit information:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000</pre>
      </div>
      
      <h2 id="webhooks">Webhooks</h2>
      <p>Zerlo can send webhooks for various events to keep your applications in sync:</p>
      
      <h3 id="webhook-events">Available Events</h3>
      <ul>
        <li><strong>project.created:</strong> New project created</li>
        <li><strong>project.updated:</strong> Project modified</li>
        <li><strong>project.deleted:</strong> Project removed</li>
        <li><strong>generation.completed:</strong> AI generation finished</li>
        <li><strong>generation.failed:</strong> AI generation failed</li>
        <li><strong>deployment.started:</strong> Deployment initiated</li>
        <li><strong>deployment.completed:</strong> Deployment finished</li>
        <li><strong>deployment.failed:</strong> Deployment failed</li>
      </ul>
      
      <h3 id="webhook-setup">Webhook Setup</h3>
      <p>Configure webhooks in your dashboard or via API:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>POST</strong> <code>/webhooks</code></p>
        <p>Create a new webhook endpoint.</p>
        <p><strong>Parameters:</strong></p>
        <ul>
          <li><code>url</code> (string): Your webhook endpoint URL</li>
          <li><code>events</code> (array): Events to subscribe to</li>
          <li><code>secret</code> (string): Secret for signature verification</li>
        </ul>
      </div>
      
      <h2 id="error-handling">Error Handling</h2>
      
      <h3 id="error-codes">HTTP Status Codes</h3>
      <ul>
        <li><strong>200:</strong> Success</li>
        <li><strong>201:</strong> Created</li>
        <li><strong>400:</strong> Bad Request</li>
        <li><strong>401:</strong> Unauthorized</li>
        <li><strong>403:</strong> Forbidden</li>
        <li><strong>404:</strong> Not Found</li>
        <li><strong>429:</strong> Rate Limited</li>
        <li><strong>500:</strong> Internal Server Error</li>
      </ul>
      
      <h3 id="error-response">Error Response Format</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["description", "type"]
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}</pre>
      </div>
      
      <h2 id="examples">Code Examples</h2>
      
      <h3 id="create-game-example">Create a Game</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre>// JavaScript/TypeScript
const response = await fetch('https://api.zerlo.com/v1/generate/game', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'A 2D platformer with a robot collecting crystals',
    genre: 'platformer',
    complexity: 'medium',
    platform: 'web'
  })
});

const game = await response.json();</pre>
      </div>
      
      <h3 id="deploy-website-example">Deploy a Website</h3>
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-family: monospace;">
        <pre># Python
import requests

response = requests.post(
    'https://api.zerlo.com/v1/deploy',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'project_id': 'proj_123456',
        'environment': 'production',
        'domain': 'mywebsite.com'
    }
)

deployment = response.json()</pre>
      </div>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=350&width=650" alt="API Code Examples" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Interactive API documentation with live examples</p>
      </div>
      
      <h2 id="testing">Testing and Development</h2>
      
      <h3 id="sandbox-environment">Sandbox Environment</h3>
      <p>Test your integrations safely:</p>
      <ul>
        <li><strong>Sandbox URL:</strong> https://api-sandbox.zerlo.com/v1</li>
        <li><strong>Test API Keys:</strong> Available in your dashboard</li>
        <li><strong>Mock Responses:</strong> Predictable test data</li>
        <li><strong>No Charges:</strong> Free testing environment</li>
      </ul>
      
      <h3 id="postman-collection">Postman Collection</h3>
      <p>Import our Postman collection for easy API testing:</p>
      <div style="margin: 1rem 0; padding: 1rem; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>Download:</strong> <a href="#" target="_blank">Zerlo API Postman Collection</a></p>
      </div>
      
      <h2 id="support">Support and Resources</h2>
      
      <h3 id="documentation">Additional Documentation</h3>
      <ul>
        <li><strong>API Changelog:</strong> Track API updates and changes</li>
        <li><strong>Migration Guides:</strong> Upgrade between API versions</li>
        <li><strong>Best Practices:</strong> Optimization and usage tips</li>
        <li><strong>Community Forum:</strong> Connect with other developers</li>
      </ul>
      
      <h3 id="getting-help">Getting Help</h3>
      <ul>
        <li><strong>Developer Support:</strong> Technical assistance for API integration</li>
        <li><strong>Status Page:</strong> Real-time API status and uptime</li>
        <li><strong>GitHub Issues:</strong> Report bugs and request features</li>
        <li><strong>Discord Community:</strong> Chat with other developers</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>🔧 Ready to Build:</strong> You now have everything you need to integrate Zerlo's powerful AI capabilities into your applications. Start with our SDKs and explore the endless possibilities!</p>
      </div>
    `,
  },
  troubleshooting: {
    title: "Troubleshooting",
    description: "Common issues and solutions for using Zerlo effectively.",
    content: `
      <h2 id="common-issues">Common Issues</h2>
      <p>This comprehensive troubleshooting guide covers the most frequently encountered issues and their solutions when using Zerlo.</p>
      
      <h2 id="generation-issues">AI Generation Issues</h2>
      
      <h3 id="slow-generation">Slow Generation Times</h3>
      <p><strong>Problem:</strong> AI generation is taking longer than expected or timing out.</p>
      <p><strong>Possible Causes:</strong></p>
      <ul>
        <li>Complex project requirements</li>
        <li>High server load during peak hours</li>
        <li>Network connectivity issues</li>
        <li>Large project scope</li>
      </ul>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check your internet connection stability</li>
        <li>✅ Simplify your prompt if it's overly complex</li>
        <li>✅ Break large projects into smaller components</li>
        <li>✅ Try generating during off-peak hours (early morning/late evening)</li>
        <li>✅ Clear browser cache and cookies</li>
        <li>✅ Contact support if the issue persists beyond 10 minutes</li>
      </ul>
      
      <h3 id="generation-errors">Generation Errors</h3>
      <p><strong>Problem:</strong> AI generation fails with error messages or produces unexpected results.</p>
      <p><strong>Common Error Messages:</strong></p>
      <ul>
        <li>"Generation failed: Invalid prompt"</li>
        <li>"Resource limit exceeded"</li>
        <li>"Unable to process request"</li>
        <li>"Timeout error"</li>
      </ul>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Review your prompt for clarity and specificity</li>
        <li>✅ Check if you've reached your monthly usage limits</li>
        <li>✅ Ensure your account is in good standing</li>
        <li>✅ Try a different project type or simpler requirements</li>
        <li>✅ Remove any special characters or formatting from prompts</li>
        <li>✅ Verify your subscription plan supports the requested features</li>
      </ul>
      
      <h3 id="poor-quality-output">Poor Quality Output</h3>
      <p><strong>Problem:</strong> Generated content doesn't match expectations or lacks quality.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Provide more detailed and specific descriptions</li>
        <li>✅ Include examples or references in your prompt</li>
        <li>✅ Specify the target audience and use case</li>
        <li>✅ Use the regeneration feature to try different approaches</li>
        <li>✅ Break complex requests into multiple smaller generations</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=400&width=700" alt="Troubleshooting Dashboard" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Comprehensive troubleshooting dashboard with diagnostic tools</p>
      </div>
      
      <h2 id="account-issues">Account and Authentication Issues</h2>
      
      <h3 id="login-problems">Can't Log In</h3>
      <p><strong>Problem:</strong> Unable to access your Zerlo account.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Reset your password using the "Forgot Password" link</li>
        <li>✅ Clear your browser cache and cookies</li>
        <li>✅ Try logging in with a different browser or incognito mode</li>
        <li>✅ Check if your email address is verified</li>
        <li>✅ Ensure you're using the correct email address</li>
        <li>✅ Disable browser extensions that might interfere</li>
        <li>✅ Check if your account has been temporarily suspended</li>
      </ul>
      
      <h3 id="oauth-issues">OAuth Login Problems</h3>
      <p><strong>Problem:</strong> Issues with Google or GitHub login.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Ensure you're logged into your Google/GitHub account</li>
        <li>✅ Check if third-party cookies are enabled</li>
        <li>✅ Disable ad blockers temporarily</li>
        <li>✅ Try the OAuth flow in a private/incognito window</li>
        <li>✅ Revoke and re-authorize the Zerlo application</li>
      </ul>
      
      <h3 id="billing-issues">Billing and Subscription Problems</h3>
      <p><strong>Problem:</strong> Issues with subscription, payments, or billing.</p>
      <p><strong>Common Issues:</strong></p>
      <ul>
        <li>Payment method declined</li>
        <li>Subscription not upgrading</li>
        <li>Usage limits not updating</li>
        <li>Billing discrepancies</li>
      </ul>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Verify your payment method is valid and has sufficient funds</li>
        <li>✅ Check if your card has expired or been replaced</li>
        <li>✅ Review your billing history in account settings</li>
        <li>✅ Contact your bank if payments are being blocked</li>
        <li>✅ Update your billing information if it has changed</li>
        <li>✅ Contact our billing support team for assistance</li>
      </ul>
      
      <h2 id="performance-issues">Performance Issues</h2>
      
      <h3 id="slow-loading">Slow Loading Times</h3>
      <p><strong>Problem:</strong> The Zerlo interface loads slowly or becomes unresponsive.</p>
      <p><strong>Solutions:</strongProblem:</strong> The Zerlo interface loads slowly or becomes unresponsive.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check your internet connection speed and stability</li>
        <li>✅ Close unnecessary browser tabs and applications</li>
        <li>✅ Disable browser extensions temporarily</li>
        <li>✅ Clear your browser cache and cookies</li>
        <li>✅ Try using a different browser (Chrome, Firefox, Safari, Edge)</li>
        <li>✅ Restart your browser or computer</li>
        <li>✅ Check if your device meets minimum system requirements</li>
        <li>✅ Use a wired internet connection instead of Wi-Fi if possible</li>
      </ul>
      
      <h3 id="memory-issues">High Memory Usage</h3>
      <p><strong>Problem:</strong> Browser becomes slow or crashes due to high memory usage.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Close other browser tabs and applications</li>
        <li>✅ Restart your browser periodically</li>
        <li>✅ Use browser task manager to identify memory-heavy tabs</li>
        <li>✅ Increase your device's available RAM if possible</li>
        <li>✅ Work on smaller projects to reduce memory load</li>
      </ul>
      
      <h2 id="project-issues">Project and Deployment Issues</h2>
      
      <h3 id="deployment-failures">Deployment Failures</h3>
      <p><strong>Problem:</strong> Your project fails to deploy or goes offline unexpectedly.</p>
      <p><strong>Common Error Messages:</strong></p>
      <ul>
        <li>"Build failed: Missing dependencies"</li>
        <li>"Deployment timeout"</li>
        <li>"Domain configuration error"</li>
        <li>"SSL certificate issue"</li>
      </ul>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check the deployment logs for specific error messages</li>
        <li>✅ Ensure your project meets all deployment requirements</li>
        <li>✅ Verify your domain settings and DNS configuration</li>
        <li>✅ Check if your custom domain is properly connected</li>
        <li>✅ Wait for DNS propagation (can take up to 48 hours)</li>
        <li>✅ Try deploying to a different environment first</li>
        <li>✅ Contact support with deployment logs if issues persist</li>
      </ul>
      
      <h3 id="project-corruption">Project Data Issues</h3>
      <p><strong>Problem:</strong> Project data appears corrupted or missing.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check if you have backup versions available</li>
        <li>✅ Use the project history feature to restore previous versions</li>
        <li>✅ Verify you're logged into the correct account</li>
        <li>✅ Clear browser cache and reload the project</li>
        <li>✅ Contact support for data recovery assistance</li>
      </ul>
      
      <h2 id="browser-compatibility">Browser Compatibility Issues</h2>
      
      <h3 id="unsupported-features">Unsupported Browser Features</h3>
      <p><strong>Problem:</strong> Certain features don't work in your browser.</p>
      <p><strong>Supported Browsers:</strong></p>
      <ul>
        <li>✅ Chrome 90+ (Recommended)</li>
        <li>✅ Firefox 88+</li>
        <li>✅ Safari 14+</li>
        <li>✅ Edge 90+</li>
      </ul>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Update your browser to the latest version</li>
        <li>✅ Enable JavaScript and cookies</li>
        <li>✅ Allow pop-ups for zerlo.com</li>
        <li>✅ Disable strict privacy settings temporarily</li>
        <li>✅ Switch to a supported browser if needed</li>
      </ul>
      
      <div style="margin: 2rem 0; text-align: center;">
        <img src="/placeholder.svg?height=350&width=650" alt="Browser Compatibility Check" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">Browser compatibility checker and diagnostic tools</p>
      </div>
      
      <h2 id="api-issues">API and Integration Issues</h2>
      
      <h3 id="api-authentication">API Authentication Problems</h3>
      <p><strong>Problem:</strong> API requests failing with authentication errors.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Verify your API key is correct and active</li>
        <li>✅ Check if your API key has the required permissions</li>
        <li>✅ Ensure you're using the correct API endpoint</li>
        <li>✅ Verify the Authorization header format</li>
        <li>✅ Check if your API key has expired</li>
        <li>✅ Generate a new API key if necessary</li>
      </ul>
      
      <h3 id="rate-limiting">Rate Limiting Issues</h3>
      <p><strong>Problem:</strong> Receiving 429 "Too Many Requests" errors.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Implement exponential backoff in your requests</li>
        <li>✅ Check your current rate limit status</li>
        <li>✅ Upgrade your plan for higher rate limits</li>
        <li>✅ Optimize your API usage patterns</li>
        <li>✅ Cache responses when possible</li>
      </ul>
      
      <h2 id="mobile-issues">Mobile and Responsive Issues</h2>
      
      <h3 id="mobile-interface">Mobile Interface Problems</h3>
      <p><strong>Problem:</strong> Zerlo interface doesn't work properly on mobile devices.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Use the latest version of your mobile browser</li>
        <li>✅ Try rotating your device to landscape mode</li>
        <li>✅ Clear mobile browser cache and data</li>
        <li>✅ Ensure you have sufficient device storage</li>
        <li>✅ Use a desktop or tablet for complex projects</li>
        <li>✅ Check if mobile app is available for your platform</li>
      </ul>
      
      <h2 id="data-issues">Data and File Issues</h2>
      
      <h3 id="file-upload">File Upload Problems</h3>
      <p><strong>Problem:</strong> Unable to upload images, assets, or other files.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check file size limits (usually 10MB per file)</li>
        <li>✅ Verify file format is supported</li>
        <li>✅ Ensure stable internet connection during upload</li>
        <li>✅ Try uploading files one at a time</li>
        <li>✅ Compress large images before uploading</li>
        <li>✅ Clear browser cache and try again</li>
      </ul>
      
      <h3 id="export-import">Export/Import Issues</h3>
      <p><strong>Problem:</strong> Problems exporting or importing project data.</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>✅ Check if you have sufficient storage space</li>
        <li>✅ Verify export format compatibility</li>
        <li>✅ Ensure pop-ups are allowed for downloads</li>
        <li>✅ Try exporting smaller portions of your project</li>
        <li>✅ Use a different browser if export fails</li>
      </ul>
      
      <h2 id="getting-help">Getting Help</h2>
      
      <h3 id="self-help-resources">Self-Help Resources</h3>
      <p>Before contacting support, try these resources:</p>
      <ul>
        <li><strong>📚 Documentation:</strong> Search our comprehensive knowledge base</li>
        <li><strong>🎥 Video Tutorials:</strong> Watch step-by-step guides</li>
        <li><strong>💬 Community Forum:</strong> Ask questions and get help from other users</li>
        <li><strong>📊 Status Page:</strong> Check for known issues and outages</li>
        <li><strong>🔧 Diagnostic Tools:</strong> Use built-in troubleshooting tools</li>
      </ul>
      
      <h3 id="contacting-support">Contacting Support</h3>
      <p>When you need direct assistance:</p>
      
      <h4 id="support-channels">Support Channels</h4>
      <ul>
        <li><strong>📧 Email Support:</strong> support@zerlo.com (24-48 hour response)</li>
        <li><strong>💬 Live Chat:</strong> Available for Pro and Enterprise users</li>
        <li><strong>📞 Phone Support:</strong> Enterprise customers only</li>
        <li><strong>🎫 Support Tickets:</strong> Submit detailed technical issues</li>
      </ul>
      
      <h4 id="support-information">Information to Include</h4>
      <p>When contacting support, please provide:</p>
      <ul>
        <li>✅ Detailed description of the problem</li>
        <li>✅ Steps to reproduce the issue</li>
        <li>✅ Browser and operating system information</li>
        <li>✅ Screenshots or screen recordings</li>
        <li>✅ Error messages (exact text)</li>
        <li>✅ Your account email address</li>
        <li>✅ Project ID (if applicable)</li>
        <li>✅ Time when the issue occurred</li>
      </ul>
      
      <h2 id="preventive-measures">Preventive Measures</h2>
      
      <h3 id="best-practices">Best Practices</h3>
      <p>Follow these practices to avoid common issues:</p>
      <ul>
        <li>✅ Keep your browser updated to the latest version</li>
        <li>✅ Regularly clear browser cache and cookies</li>
        <li>✅ Save your work frequently</li>
        <li>✅ Use descriptive project names and organization</li>
        <li>✅ Monitor your usage limits and upgrade when needed</li>
        <li>✅ Keep backup copies of important projects</li>
        <li>✅ Test deployments in staging before production</li>
      </ul>
      
      <h3 id="system-requirements">System Requirements</h3>
      <p>Ensure your system meets these minimum requirements:</p>
      <ul>
        <li><strong>RAM:</strong> 4GB minimum, 8GB recommended</li>
        <li><strong>Internet:</strong> Stable broadband connection (10+ Mbps)</li>
        <li><strong>Browser:</strong> Latest version of supported browsers</li>
        <li><strong>JavaScript:</strong> Must be enabled</li>
        <li><strong>Cookies:</strong> Must be enabled</li>
        <li><strong>Pop-ups:</strong> Allow pop-ups for zerlo.com</li>
      </ul>
      
      <h2 id="emergency-procedures">Emergency Procedures</h2>
      
      <h3 id="service-outages">Service Outages</h3>
      <p>If Zerlo services are unavailable:</p>
      <ul>
        <li>✅ Check our status page for known issues</li>
        <li>✅ Follow @ZerloStatus on social media for updates</li>
        <li>✅ Wait for service restoration (usually within 1 hour)</li>
        <li>✅ Contact support only if outage persists beyond 2 hours</li>
      </ul>
      
      <h3 id="data-recovery">Data Recovery</h3>
      <p>If you've lost project data:</p>
      <ul>
        <li>✅ Check project history for previous versions</li>
        <li>✅ Look for local browser backups</li>
        <li>✅ Contact support immediately for data recovery</li>
        <li>✅ Provide as much detail as possible about the lost data</li>
      </ul>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <p><strong>🛠️ Remember:</strong> Most issues can be resolved quickly with the right approach. Don't hesitate to reach out for help when you need it – our support team is here to ensure you have the best possible experience with Zerlo!</p>
      </div>
      
      <div style="margin: 2rem 0; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p><strong>⚡ Quick Tip:</strong> Bookmark this troubleshooting guide and refer to it whenever you encounter issues. Many problems have simple solutions that can save you time and frustration.</p>
      </div>
    `,
  },
}

export function getDocContent(slug: string): DocContent | null {
  return docsContent[slug] || null
}
