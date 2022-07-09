const projectwrapper = document.querySelector('.projects');
const selecttags = document.querySelector('.header__search--filter select');
const searchform = document.querySelector('.header__search--box');
const input = document.querySelector('.header__search--box input');
const searchbutton = document.querySelector('.header__search--box button');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const themeButton = document.querySelector('.header__theme');

let main_projects = [];
let projects = [];
let tags = [];
let amount = 8;
let start = -amount;
let end = 0;

function toggleTheme(){
  if(document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.querySelector('.header__theme--sunny').style.display = "none";
      document.querySelector('.header__theme--moon').style.display = "block";
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.querySelector('.header__theme--moon').style.display = "none";
      document.querySelector('.header__theme--sunny').style.display = "block";

  }
}

function displayProjects(tag,arr){
    projectwrapper.innerHTML = "";
    if(arr.length === 0) {
      projectwrapper.innerHTML = `
      <div class="projects__empty">
        <h3>Projects not found</h3>
      </div>
      `;
    } else {
      projectwrapper.innerHTML = arr.map(item => {
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
	      listTags();
    displayTags(tag);
}

function listTags(){
    const temp_tags = new Set();
	projects.forEach(item => item.techs.forEach(val => temp_tags.add(val)));
	tags = [...temp_tags];
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
  start = -amount;
  end = 0;
  paginate(1);
}

function searchByName(e){
  e.preventDefault();
  projects = main_projects.filter(item => item.title.search(input.value) !== -1);
  start = -amount;
  end = 0;
  paginate(1);
}

async function fetchData(){
    try {
        const req = await fetch('data.json');
        const res = await req.json();
        main_projects = [...res.projects];
        projects = [...main_projects];
        paginate(1);
    } catch (error) {
        console.log(error);
    }
}



function paginate(num){
  
  if(num === 1) {
    if(end > projects.length) return;
    start += amount;
    end += amount;
  }
  if(num === -1) {
    if(start === 0) return;
    start -= amount;
    end -= amount;
  }
  let temp_projects = projects.slice(start,end);
  if(selecttags.value === "all") displayProjects("all",temp_projects);
  else displayProjects(selecttags.value,temp_projects);
}



window.addEventListener('DOMContentLoaded', fetchData);
selecttags.addEventListener('change', filterProjects);
input.addEventListener('input',searchByName);
searchform.addEventListener('submit', searchByName);
searchbutton.addEventListener('click',searchByName);
nextButton.addEventListener('click', ()=>paginate(1));
prevButton.addEventListener('click', ()=>paginate(-1));
themeButton.addEventListener('click', toggleTheme);
