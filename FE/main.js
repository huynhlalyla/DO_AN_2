
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sdt = form.sdt.value;
    const password = form.password.value;
    const response = await fetch('http://localhost:3000/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sdt,
            password
        })
    });
    const data = await response.json();
    console.log(data);
    if(data.message === 'success') {
        document.querySelector('h1#message').innerText = 'Đăng nhập thành công';
        document.querySelector('li#name').innerText = `Name: ${data.user.name}`;
        document.querySelector('li#email').innerText = `Email: ${data.user.email}`;
    } else {
        document.querySelector('li#name').innerText = ''
        document.querySelector('li#email').innerText = ''
        document.querySelector('h1#message').innerText = 'Đăng nhập thất bại';
    }
});