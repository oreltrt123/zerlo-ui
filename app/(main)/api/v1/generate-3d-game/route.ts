import { createServerClient } from '@/supabase/server'; // ✅ updated import
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Missing or invalid Authorization header');
    return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });
  }

  const plainKey = authHeader.split(' ')[1];
  const supabase = await createServerClient(); // ✅ use server client

  // Validate API key
  const { data: keys, error } = await supabase.from('api_keys').select('user_id, key_hash, revoked_at');
  if (error) {
    console.error('Key fetch error:', error);
    return NextResponse.json({ error: 'Internal server error', code: 500 }, { status: 500 });
  }

  let validUserId: string | null = null;
  for (const key of keys || []) {
    if (key.revoked_at) continue;
    const [storedHash, salt] = key.key_hash.split('.');
    const hash = crypto.scryptSync(plainKey, salt, 64).toString('hex');
    if (hash === storedHash) {
      validUserId = key.user_id;
      break;
    }
  }

  if (!validUserId) {
    console.error('Invalid API key provided');
    return NextResponse.json({ error: 'Invalid API key', code: 401 }, { status: 401 });
  }

  const body = await request.json();
  const { gamePrompt } = body;
  if (!gamePrompt) {
    console.error('Missing prompt in request body');
    return NextResponse.json({ error: 'Missing prompt', code: 400 }, { status: 400 });
  }

  try {
    const gameHtml = await generate3DGame();
    console.log('Game generated for user:', validUserId);
    return NextResponse.json({ gameHtml });
  } catch (error) {
    console.error('Game generation error:', error);
    return NextResponse.json({ error: 'Failed to generate game', code: 500 }, { status: 500 });
  }
}

async function generate3DGame() {
  // Placeholder 3D game HTML using Three.js
  return `
<!DOCTYPE html>
<html>
<head>
  <title>3D Game</title>
  <script src="https://threejs.org/build/three.js"></script>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>
  `;
}
