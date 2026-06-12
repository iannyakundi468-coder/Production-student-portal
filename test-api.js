

const API_URL = 'https://somobloombackend.solianwolves.com/api';

async function test() {
  console.log('Logging in...');
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'parent1@somobloom.com', password: 'demo' })
  });
  const data = await res.json();
  console.log('Login Response:', data);

  if (data.token) {
    console.log('Fetching parent students...');
    const studentsRes = await fetch(`${API_URL}/parent/students`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    const studentsData = await studentsRes.json();
    console.log('Students Response:', JSON.stringify(studentsData, null, 2));

    if (studentsData.students && studentsData.students.length > 0) {
      const studentId = studentsData.students[0].id;
      
      const pRes = await fetch(`${API_URL}/parent/students/${studentId}/portfolio`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      console.log('Portfolio status:', pRes.status, await pRes.text());

      const gRes = await fetch(`${API_URL}/parent/students/${studentId}/grades`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      console.log('Grades status:', gRes.status, await gRes.text());

      const annRes = await fetch(`${API_URL}/parent/announcements`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      console.log('Announcements status:', annRes.status, await annRes.text());

      const msgRes = await fetch(`${API_URL}/messages`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      console.log('Messages status:', msgRes.status, await msgRes.text());
    }
  }
}

test();
