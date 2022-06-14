let createField = document.getElementById("create-field");
// let btn = document.getElementById("add");
// btn.disabled = true;

// createField.addEventListener("change", stateHandle);

// function stateHandle() {
//   if (createField.value == "") {
//     btn.disabled = true;
//   } else {
//     btn.disabled = false;
//   }
// }
function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <div>
  <blockquote class="blockquote">${item.text}</blockquote>
  <figcaption class="blockquote-footer"> Added At :- ${item.date}</figcaption></div>
 
  <div>
  <button data-id ="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
  <button data-id ="${item._id}"  class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
   </li>`;
}

//initial page load render

let ourHTML = items
  .map(function (item) {
    return itemTemplate(item);
  })
  .join(" ");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// create feature
document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
    var d = new Date();
    var date = [ d.getDate() ,d.getMonth(),d.getFullYear()].join('/');
     axios
    .post("/create-item", {
      text: createField.value,
      date: date,
    })
    .then(function (response) {
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));

      createField.value = " ";
      createField.focus();
    })
    .catch(function () {
      console.log("please try again later");
    });
});

// delete feature
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-me")) {
    if (confirm("do you really want to delete it ?")) {
      axios
        .post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log("please try again later");
        });
    }
  }

  // update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "enter your new task here",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );

    if (userInput) {
      axios
        .post("update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
          console.log(userInput);
        })
        .catch(function () {
          console.log("please try again later");
        });
    }
  }
});
