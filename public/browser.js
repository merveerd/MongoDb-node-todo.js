document.getElementById('create-form').addEventListener('submit', (e)=> {

})

document.addEventListener('click', (e) => {

    //delete
    if(e.target.classList.contains('delete-me')){
        axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
                e.target.parentElement.parentElement.remove();
              }).catch(function() {
                console.log("Please try again later.")
              });
    }

    //update
if(e.target.classList.contains('edit-me')){
    let userInput = prompt('write what you want to edit')

    if (userInput) {
        axios.post('/update-item', {text: 'userInput', id: e.target.getAttribute("data-id")}).then(function () {
      console.log(e.target.getAttribute("data-id"))
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        }).catch(function() {
          console.log("Please try again later.")
        });
      }
    }
  })