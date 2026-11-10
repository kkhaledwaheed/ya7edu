async function testError() {
  const res = await fetch('http://localhost:3000/api/lms/bootstrap');
  const text = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('Response body:', text);
}
testError();

