interface ServerConfig {
  projectUrl?: string
  apiKey: string
  projectId?: string
  authDomain?: string
  storageBucket?: string
}

export function generateAuthCode(serverType: "supabase" | "firebase", config: ServerConfig): string {
  if (serverType === "supabase") {
    return `
// Supabase Authentication Setup
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${config.projectUrl}'
const supabaseKey = '${config.apiKey}'
const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication Functions
export const auth = {
  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    if (error) throw error
    return data
  },

  // Sign in existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database Functions
export const db = {
  // Insert data
  async insert(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    if (error) throw error
    return result
  },

  // Select data
  async select(table, filters = {}) {
    let query = supabase.from(table).select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Update data
  async update(table, id, data) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
    if (error) throw error
    return result
  },

  // Delete data
  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

// Real-time subscriptions
export const realtime = {
  subscribe(table, callback) {
    return supabase
      .channel('public:' + table)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe()
  }
}
`
  } else {
    return `
// Firebase Authentication Setup
import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Authentication Functions
export const authentication = {
  // Sign up new user
  async signUp(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
  },

  // Sign in existing user
  async signIn(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
  },

  // Sign out current user
  async signOut() {
    return await signOut(auth)
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback)
  }
}

// Database Functions
export const database = {
  // Add document
  async add(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  },

  // Get documents
  async get(collectionName, filters = {}) {
    let q = collection(db, collectionName)
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      q = query(q, where(key, '==', value))
    })
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Update document
  async update(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    })
  },

  // Delete document
  async delete(collectionName, docId) {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  },

  // Real-time listener
  onSnapshot(collectionName, callback, filters = {}) {
    let q = collection(db, collectionName)
    
    Object.entries(filters).forEach(([key, value]) => {
      q = query(q, where(key, '==', value))
    })
    
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(docs)
    })
  }
}
`
  }
}

export function generateAuthHTML(serverType: "supabase" | "firebase"): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Authentication</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .auth-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .auth-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .auth-header h1 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .auth-header p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
            margin-bottom: 1rem;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .toggle-link {
            text-align: center;
            color: #667eea;
            cursor: pointer;
            text-decoration: underline;
        }
        
        .error-message {
            background: #fee;
            color: #c33;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .success-message {
            background: #efe;
            color: #363;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .user-info {
            text-align: center;
            padding: 2rem;
        }
        
        .user-info h2 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .user-email {
            color: #666;
            margin-bottom: 2rem;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <!-- Login/Register Form -->
        <div id="authForm">
            <div class="auth-header">
                <h1>Welcome to the Game</h1>
                <p>Sign in to save your progress and compete with others</p>
            </div>
            
            <div id="errorMessage" class="error-message hidden"></div>
            <div id="successMessage" class="success-message hidden"></div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                
                <button type="submit" class="btn" id="submitBtn">Sign In</button>
            </form>
            
            <div class="toggle-link" id="toggleMode">
                Don't have an account? Sign up
            </div>
        </div>
        
        <!-- User Dashboard -->
        <div id="userDashboard" class="hidden">
            <div class="user-info">
                <h2>Welcome back!</h2>
                <div class="user-email" id="userEmail"></div>
                <button class="btn" id="signOutBtn">Sign Out</button>
                <button class="btn" onclick="startGame()" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                    Start Game
                </button>
            </div>
        </div>
    </div>

    <script type="module">
        // Import auth functions (this would be replaced with actual imports)
        // For demo purposes, we'll simulate the auth functions
        
        let isSignUp = false;
        let currentUser = null;
        
        // DOM elements
        const authForm = document.getElementById('authForm');
        const userDashboard = document.getElementById('userDashboard');
        const loginForm = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const toggleMode = document.getElementById('toggleMode');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const userEmail = document.getElementById('userEmail');
        const signOutBtn = document.getElementById('signOutBtn');
        
        // Toggle between sign in and sign up
        toggleMode.addEventListener('click', () => {
            isSignUp = !isSignUp;
            submitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
            toggleMode.textContent = isSignUp ? 
                'Already have an account? Sign in' : 
                "Don't have an account? Sign up";
        });
        
        // Handle form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            hideMessages();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';
            
            try {
                if (isSignUp) {
                    // Simulate sign up
                    await simulateAuth('signUp', email, password);
                    showSuccess('Account created successfully! Please check your email to verify.');
                } else {
                    // Simulate sign in
                    const user = await simulateAuth('signIn', email, password);
                    currentUser = user;
                    showUserDashboard(user);
                }
            } catch (error) {
                showError(error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
            }
        });
        
        // Handle sign out
        signOutBtn.addEventListener('click', async () => {
            try {
                await simulateAuth('signOut');
                currentUser = null;
                showAuthForm();
                showSuccess('Signed out successfully');
            } catch (error) {
                showError(error.message);
            }
        });
        
        // Simulate authentication (replace with actual ${serverType} auth)
        async function simulateAuth(action, email, password) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (action === 'signUp') {
                // Simulate successful sign up
                return { email, id: 'user_' + Date.now() };
            } else if (action === 'signIn') {
                // Simulate successful sign in
                if (email && password) {
                    return { email, id: 'user_' + Date.now() };
                } else {
                    throw new Error('Invalid email or password');
                }
            } else if (action === 'signOut') {
                // Simulate successful sign out
                return true;
            }
        }
        
        // UI helper functions
        function showAuthForm() {
            authForm.classList.remove('hidden');
            userDashboard.classList.add('hidden');
        }
        
        function showUserDashboard(user) {
            authForm.classList.add('hidden');
            userDashboard.classList.remove('hidden');
            userEmail.textContent = user.email;
        }
        
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
        
        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.classList.remove('hidden');
        }
        
        function hideMessages() {
            errorMessage.classList.add('hidden');
            successMessage.classList.add('hidden');
        }
        
        // Game integration
        window.startGame = function() {
            // This function would integrate with your game
            alert('Starting game for ' + currentUser.email + '!\\n\\nGame integration would happen here.');
            
            // Example: redirect to game or initialize game state
            // window.location.href = '/game';
            // or
            // initializeGameWithUser(currentUser);
        }
        
        // Check for existing session on page load
        window.addEventListener('load', () => {
            // In a real app, check for existing auth session
            // const user = auth.getCurrentUser();
            // if (user) {
            //     currentUser = user;
            //     showUserDashboard(user);
            // }
        });
    </script>
</body>
</html>
`
}
