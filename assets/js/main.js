// ===============================
// MR.DANESHVAAR MAIN JAVASCRIPT
// ===============================


// REMOVE LOADER AFTER PAGE LOAD

window.addEventListener("load",()=>{

    const loader=document.querySelector(".loader");

    setTimeout(()=>{

        loader.style.display="none";

    },1800);

});




// HEADER SCROLL EFFECT


const header=document.querySelector("header");


window.addEventListener("scroll",()=>{


    if(window.scrollY > 80){

        header.style.background="rgba(0,0,0,0.95)";

    }else{

        header.style.background="rgba(0,0,0,0.65)";

    }


});





// SCROLL REVEAL ANIMATION


const revealElements=document.querySelectorAll(
"section, .service-card, .portfolio-item, .about-content"
);



const revealObserver=new IntersectionObserver((entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";


}


});


},{

threshold:.15

});




revealElements.forEach(el=>{


el.style.opacity="0";

el.style.transform="translateY(50px)";

el.style.transition="all .8s ease";


revealObserver.observe(el);


});







// HERO TITLE TYPING EFFECT


const heroTitle=document.querySelector(".hero h1");


if(heroTitle){


const text=heroTitle.innerText;


heroTitle.innerText="";


let index=0;



function typing(){


if(index < text.length){


heroTitle.innerHTML += text.charAt(index);

index++;

setTimeout(typing,70);


}


}


typing();


}





// ACTIVE MENU


const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll("nav a");



window.addEventListener("scroll",()=>{


let current="";


sections.forEach(section=>{


const sectionTop=section.offsetTop-150;


if(scrollY >= sectionTop){

current=section.getAttribute("id");

}


});



navLinks.forEach(link=>{


link.style.color="white";


if(link.getAttribute("href")==="#"+current){

link.style.color="#d4af37";

}


});


});






// IMAGE LAZY LOAD


const images=document.querySelectorAll("img");


images.forEach(img=>{


img.loading="lazy";


});







// WHATSAPP BUTTON EFFECT


const whatsapp=document.querySelector(".whatsapp");


if(whatsapp){


setInterval(()=>{


whatsapp.style.transform="scale(1.05)";


setTimeout(()=>{

whatsapp.style.transform="scale(1)";

},500);



},3000);


}
// PORTFOLIO FILTER


const filterButtons =
document.querySelectorAll(".portfolio-filter button");


const portfolioItems =
document.querySelectorAll(".portfolio-item");



filterButtons.forEach(button=>{


button.addEventListener("click",()=>{


filterButtons.forEach(btn=>
btn.classList.remove("active")
);


button.classList.add("active");



let filter =
button.dataset.filter;



portfolioItems.forEach(item=>{


if(filter==="all" ||
item.dataset.category===filter){


item.style.display="block";


}else{


item.style.display="none";


}


});


});


});






// VIDEO POPUP


const videoButtons =
document.querySelectorAll(".play-video");


const modal =
document.querySelector(".video-modal");


const video =
document.querySelector(".video-container video");



videoButtons.forEach(btn=>{


btn.onclick=()=>{


video.src=btn.dataset.video;

modal.style.display="flex";

video.play();


}


});



document.querySelector(".close-video").onclick=()=>{


modal.style.display="none";

video.pause();

video.src="";


};