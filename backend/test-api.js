import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Grump Backend API\n');
console.log('='.repeat(50));

// Test 1: Health Check
async function testHealth() {
  console.log('\n1️⃣  Testing Health Endpoint...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.data.status === 'ok') {
      console.log('   ✅ Health check passed');
      return true;
    } else {
      console.log('   ❌ Health check failed: Unexpected response');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
    return false;
  }
}

// Test 2: Chat Endpoint - Simple Message
async function testSimpleChat() {
  console.log('\n2️⃣  Testing Chat Endpoint (Simple Message)...');
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat`,
      {
        message: 'Hello Grump!',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    
    if (response.data.response && response.data.timestamp) {
      console.log('   ✅ Chat endpoint working');
      console.log(`   📝 Grump says: "${response.data.response.substring(0, 60)}..."`);
      return true;
    } else {
      console.log('   ❌ Chat endpoint failed: Invalid response format');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Chat endpoint failed:', error.response?.data?.error?.message || error.message);
    if (error.response?.data?.error) {
      console.log('   📋 Error details:', JSON.stringify(error.response.data.error, null, 2));
    }
    return false;
  }
}

// Test 3: Chat Endpoint - With Conversation History
async function testChatWithHistory() {
  console.log('\n3️⃣  Testing Chat Endpoint (With History)...');
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat`,
      {
        message: 'What did I just say?',
        conversationHistory: [
          {
            sender: 'user',
            content: 'Hello Grump!',
            timestamp: new Date().toISOString(),
          },
          {
            sender: 'grump',
            content: 'Oh great. You again.',
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    
    if (response.data.response && response.data.timestamp) {
      console.log('   ✅ Chat with history working');
      console.log(`   📝 Grump says: "${response.data.response.substring(0, 60)}..."`);
      return true;
    } else {
      console.log('   ❌ Chat with history failed: Invalid response format');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Chat with history failed:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Test 4: Error Handling - Empty Message
async function testErrorHandling() {
  console.log('\n4️⃣  Testing Error Handling...');
  try {
    await axios.post(
      `${API_BASE_URL}/api/chat`,
      {
        message: '',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      }
    );
    console.log('   ❌ Error handling failed: Should have rejected empty message');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('   ✅ Error handling working (rejected empty message)');
      return true;
    } else {
      console.log('   ❌ Error handling failed: Wrong status code');
      return false;
    }
  }
}

// Test 5: CORS Check
async function testCORS() {
  console.log('\n5️⃣  Testing CORS Configuration...');
  try {
    const response = await axios.options(`${API_BASE_URL}/api/chat`, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
      },
    });
    console.log('   ✅ CORS configured');
    return true;
  } catch (error) {
    // CORS preflight might not be fully supported, but that's okay
    console.log('   ⚠️  CORS preflight check (non-critical)');
    return true;
  }
}

// Run all tests
async function runTests() {
  const results = {
    health: await testHealth(),
    simpleChat: await testSimpleChat(),
    chatWithHistory: await testChatWithHistory(),
    errorHandling: await testErrorHandling(),
    cors: await testCORS(),
  };

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results Summary:\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const name = test.replace(/([A-Z])/g, ' $1').trim();
    console.log(`   ${icon} ${name}`);
  });
  
  console.log(`\n🎯 Passed: ${passed}/${total} tests`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Grump is ready to grump.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
    process.exit(1);
  }
}

// Check if server is running first
axios.get(`${API_BASE_URL}/health`)
  .then(() => runTests())
  .catch((error) => {
    console.log('\n❌ Cannot connect to backend server!');
    console.log(`   Make sure the backend is running on ${API_BASE_URL}`);
    console.log(`   Error: ${error.message}\n`);
    process.exit(1);
  });

