async function testEducation() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rohit@example.com',
        password: 'password123' 
      })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
    }

    const loginData = await loginRes.json();
    console.log('Login response:', loginData);
    const token = loginData.accessToken;
    console.log('Got token:', token ? 'Yes' : 'No');

    // 2. Create Education
    console.log('Creating education entry...');
    const eduData = {
      schoolCollege: 'Test College',
      boardUniversity: 'Test University',
      degree: 'Test Degree',
      fieldOfStudy: 'Test Field',
      startDate: '2020',
      endDate: '2024',
      grade: 'A',
      description: 'Test Description',
      documents: []
    };

    const createRes = await fetch('http://localhost:3000/education', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(eduData)
    });

    console.log('Create response status:', createRes.status);
    const createData = await createRes.json();
    console.log('Create response data:', createData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEducation();
