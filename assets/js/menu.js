window.addEventListener('DOMContentLoaded', (event) => {

    // Play menu audio
    // document.querySelector('audio').play();
    let audio = new Audio('/audio/title-song.mp3');
    document.querySelector('.logo').addEventListener('click', (event) => {
        
        audio.loop = true;
        audio.play();
        document.removeEventListener('click', this);
        debugger;
        // let playPromise = audio.play();
        // document.querySelector('audio').play();
    })


    // Tutorial button, updates menu state to show tutorial confirmation
    document.querySelector('.tutorial').addEventListener('click', (event) => {
        document.querySelector('.top .confirmation').classList.remove('dn');
        document.querySelector('.bottom.confirmation').classList.remove('dn');
        document.querySelector('.top .logo').classList.add('dn');
        document.querySelector('.bottom.menu').classList.add('dn');
    })

    // Tutorial cancel button, returns menu UI state to main-menu
    document.querySelector('.no').addEventListener('click', (event) => {
        document.querySelector('.top .confirmation').classList.add('dn');
        document.querySelector('.bottom.confirmation').classList.add('dn');
        document.querySelector('.top .logo').classList.remove('dn');
        document.querySelector('.bottom.menu').classList.remove('dn');
    })

})