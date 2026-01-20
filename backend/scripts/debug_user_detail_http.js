async function test() {
    try {
        console.log('1. Logging in as admin...');

        const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password123' })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', loginRes.status, await loginRes.text());
            process.exit(1);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        console.log('2. Fetching User Details for ID 1...');
        const res = await fetch('http://127.0.0.1:3000/api/admin/users/1/details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);

    } catch (e) {
        console.error('Test Failed:', e.message);
    }
}

test();
