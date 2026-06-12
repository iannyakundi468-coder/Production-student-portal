const API_URL = 'https://somobloombackend.solianwolves.com/api';

async function test() {
  console.log('Logging in as student...');
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@somobloom.com', password: 'demo' })
  });
  const data = await res.json();
  console.log('Login Response:', data);

  if (data.token) {
    console.log('Fetching student profile...');
    const pRes = await fetch(`${API_URL}/student/me`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    console.log('Profile status:', pRes.status, await pRes.text());

    console.log('Fetching student classes...');
    const cRes = await fetch(`${API_URL}/student/classes`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    console.log('Classes status:', cRes.status, await cRes.text());
  }
}

test();
