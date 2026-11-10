async function testLocalServer() {
  try {
    console.log('Testing http://localhost:3000/api/lms/bootstrap...');
    const res = await fetch('http://localhost:3000/api/lms/bootstrap');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Success:', data.success);
    console.log('Source:', data.source);
    console.log('Users count:', data.users?.length);
    if (data.users) {
      console.log('Users list:', data.users.map(u => ({ id: u.id, name: u.name, phone: u.phone, email: u.email })));
    }
  } catch (err) {
    console.error('Local server fetch error:', err);
  }
}
testLocalServer();

