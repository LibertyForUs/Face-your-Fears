window.addEventListener('DOMContentLoaded', (event) => {
    
    document.querySelector('.tutorial').addEventListener('click', (event) => {
        document.querySelector('.top .confirmation').classList.remove('dn');
        document.querySelector('.bottom.confirmation').classList.remove('dn');
        document.querySelector('.top .logo').classList.add('dn');
        document.querySelector('.bottom.menu').classList.add('dn');
    })

    document.querySelector('.no').addEventListener('click', (event) => {
        document.querySelector('.top .confirmation').classList.add('dn');
        document.querySelector('.bottom.confirmation').classList.add('dn');
        document.querySelector('.top .logo').classList.remove('dn');
        document.querySelector('.bottom.menu').classList.remove('dn');
    })

})