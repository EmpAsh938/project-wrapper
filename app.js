const projectwrapper = document.querySelector('.projects');
const selecttags = document.querySelector('.header__search--filter select');
const searchform = document.querySelector('.header__search--box');
const input = document.querySelector('.header__search--box input');
const searchbutton = document.querySelector('.header__search--box button');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

let main_projects = [];
let projects = [];
let tags = [];
let start = -8;
let end = 0;
let amount = 8;

function displayProjects(tag){
    const temp_tags = new Set();
    projectwrapper.innerHTML = "";
    if(projects.length === 0) {
      projectwrapper.innerHTML = `
      <div class="projects__empty">
        <h3>Projects not found</h3>
      </div>
      `;
    } else {
      projectwrapper.innerHTML = projects.map(item => {
          const {snapshot,title,techs,links:{srcode,slink}} = item;
          return `
          <article class="projects__box">
          <div class="projects__box--img">
            <img src="${snapshot}" alt="${title}" />
          </div>
          <div class="projects__box--desc">
            <h3>${title}</h3>
            <div class="projects__tags">
              ${techs.map(val => {
                  temp_tags.add(val);
                  return `<span>${val}</span>`
              }).join("")}
            </div>
            <div class="projects__links">
              <a href="${srcode}" target="_blank">source code</a>
              <a href="${slink}" target="_blank">site preview</a>
            </div>
          </div>
        </article>
          `
      }).join("")
    }
    tags = [...temp_tags];
    displayTags(tag);
}

function displayTags(tag){
    selecttags.innerHTML = "";
    tags.push("all");
    selecttags.innerHTML = tags.map(item => {
        if(item === tag || (tag === "all" && item === "all")) {
          return `<option value="${item}" selected>${item}</option>`;
        }
        return `<option value="${item}">${item}</option>`;
    }).join("")
}

function filterProjects(e){
  if(e.target.value === "all"){
    projects = [...main_projects];
  } else {
    projects = main_projects.filter(items => items.techs.includes(e.target.value));

  }
  displayProjects(e.target.value);
}

function searchByName(e){
  e.preventDefault();
  projects = main_projects.filter(item => item.title.search(input.value) !== -1);
  displayProjects("");
}

async function fetchData(){
    try {
        const req = await fetch('data.json');
        const res = await req.json();
        main_projects = [...res.projects];
        paginate(1);
    } catch (error) {
        console.log(error);
    }
}



function paginate(num){
  if(num === 1) {
    if(end > main_projects.length) return;
    start += amount;
    end += amount;
  }
  if(num === -1) {
    if(start <= 0) return;
    start -= amount;
    end -= amount;
  }

  console.log("start: "+start+"end: "+end);
  projects = main_projects.slice(start,end);
  displayProjects("all");
}


window.addEventListener('DOMContentLoaded', fetchData);
selecttags.addEventListener('change', filterProjects);
input.addEventListener('input',searchByName);
searchform.addEventListener('submit', searchByName);
searchbutton.addEventListener('click',searchByName);
nextButton.addEventListener('click', ()=>paginate(1));
prevButton.addEventListener('click', ()=>paginate(-1));
