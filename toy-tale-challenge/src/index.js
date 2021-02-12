const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const addForm = document.querySelector('.add-toy-form')
let addToy = false

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    handleAddToy();
  } else {
    toyForm.style.display = 'none'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
})

function fetchData(){
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => renderData(toys))
}

function renderData(toys){
  toys.forEach(toy => {
    createToyCards(toy);
  })
}

function handleAddToy(){
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.querySelector('#name-input');
    const urlInput = document.querySelector('#url-input');
    reqObj = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: nameInput.value,
        image: urlInput.value,
        likes: 0
      })
    }
    fetch('http://localhost:3000/toys', reqObj)
    .then(resp => resp.json())
    .then(toy => createToyCards(toy))
    alert(`<${nameInput.value}> has been successfully Added to the lists.`);
    nameInput.value = "";
    urlInput.value = "";
  })
}

function createToyCards(toy){
  const toyCollection = document.querySelector('#toy-collection');
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';

  const toyName = document.createElement('h2');
  toyName.innerText = toy.name;

  const toyImg = document.createElement('img');
  toyImg.className = 'toy-avatar';
  toyImg.src = toy.image;

  const toyLikes = document.createElement('p');
  let countLikes = toy.likes;
  // countLikes has to be defined with let
  toyLikes.innerText = `${toy.likes} Likes`;

  const likebtn = document.createElement('button');
  likebtn.className = 'like-btn';
  likebtn.innerText = 'Like <3'

  likebtn.addEventListener('click', () => {
  var addLikes = {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json',
    Accept:"application/json"},
    body: JSON.stringify({
      "likes": countLikes++
    })
    }
    fetch(`http://localhost:3000/toys/${toy.id}`, addLikes)
    toyLikes.innerText = `${countLikes} Likes`
  })


  const delbtn = document.createElement('button');
  delbtn.className = 'delete-btn';
  delbtn.innerText = '❌';
  delbtn.addEventListener('click', (e) => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(toy => {e.target.parentNode.remove()})
    alert(`<${toy.name}> has been successfully removed from the lists.`)
  })

  cardDiv.append(delbtn, toyName, toyImg, toyLikes, likebtn);
  toyCollection.append(cardDiv);
}
