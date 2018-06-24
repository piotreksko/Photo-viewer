let photosData,
    currentPage = 1,
    numPages,
    pages = [];

const pageSize = 12;

//Split data into arrays - 12 records per array
const unflatten = (arr, groupSize) => {
  let arrCopy = [...arr];
  let res = [];

  while (arrCopy.length > 0) {
    res.push(arrCopy.splice(0, groupSize));
  }
  numPages = res.length - 1;
  return res;
}

const renderPage = (idx) => {
  createPagination();
  const data = pages[idx];

  let list = document.getElementById('photosList');
  clearContent(list);

  data.map((item, idx) => addItem(item, idx, list));
}

//Clear children elements
const clearContent = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

//Add records to display
const addItem = (item, idx, list) => {
  let ul = document.getElementById("photosList");
  let li = document.createElement("li");
  li.innerHTML = `${item.title}`;
  li.setAttribute("onclick", `loadImage('${item.thumbnailUrl}')`);
  ul.appendChild(li);
}

const showSpinner = (display) => {
  let spinner = document.getElementById('spinner');
  let mainSection = document.getElementById('main');
  spinner.style = display ? 'display: block;' : 'display: none;';
  main.style = !display ? 'display: block;' : 'display: none;';
}

showSpinner(true);
setTimeout(() => axios.get('http://jsonplaceholder.typicode.com/Photos')
           .then(res => {
  pages = (unflatten(res.data, pageSize));
  renderPage(currentPage);
  showSpinner(false);
})
           .catch(err => console.log(err)), 700);

const loadImage = (url) => {
  const imageDisplay = document.getElementById("imageDisplay");
  imageDisplay.innerHTML = "<img class='img-round-square' src='" + url + "'/>";
}

//Create buttons for pagination and display
const createPagination = () => {
  let paginationResult = '';
  const pagination = document.getElementById('pagination');
  const button = "<div class='button' onclick='changePage(this)' data-value='";

  //Add previous button
  paginationResult += "<div class='button' id='previousPageButton' onclick='prevPage()'>&lt;</div >";

  //Go to first page
  if ((currentPage == 1 || currentPage) > 3) {
    paginationResult += button + "1'>1</div>";
  }

  //Add dots if above 3rd page
  if (currentPage > 3) {
    paginationResult += "<div class='button'>...</div>";
  }

  //100 pages lower than current
  if (currentPage > 101) {
    paginationResult += button + (currentPage - 100) + "'>" + (currentPage - 100) + "</div>";
  }

  //1 page lower than current
  if (currentPage > 1) {
    paginationResult += button + (currentPage - 1) + "'>" + (currentPage - 1) + "</div>";
  }

  //Current page
  paginationResult += "<div class='button focused'>" + currentPage + "</div >";

  //1 page higher than current
  if ((numPages - currentPage) > 2) {
    paginationResult += button + (currentPage + 1) + "'>" + (currentPage + 1) + "</div>";
  }

  //100 pages higher than current
  if ((numPages - currentPage) > 101) {
    paginationResult += button + (currentPage + 100) + "'>" + (currentPage + 100) + "</div>";
  }

  //Add dots if less than 3 pages are remaining
  if ((numPages - currentPage) > 3) {
    paginationResult += "<div class='button'>...</div >";
  }

  //Go to last page
  if (currentPage !== numPages) {
    paginationResult += button + (numPages) + "'>" + (numPages) + "</div>";
  }

  //Go to next page
  paginationResult += "<div class='button buttonLast' id='nextPageButton' onclick='nextPage()'>&gt;</div>";

  //Page number input & go to chosen page button
  paginationResult += "<br><input id='pageInput' type='number' min='1' max='" + numPages + "' required onkeyup='maxLengthCheck(this)' value='" + currentPage + "'>"
  paginationResult += "<br><div class='button' id='confirmButton' onclick='changePage(this)'>Go to page</div>";

  pagination.innerHTML = paginationResult;
}

//Click event handlers
  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      imageDisplay.innerHTML = "";
      renderPage(currentPage);
    }
  }

  const nextPage = () => {
    if (currentPage < numPages) {
      currentPage++;
      imageDisplay.innerHTML = "";
      renderPage(currentPage);
    }
  }

  const changePage = (page) => {
    if (page.id == "confirmButton") {
      currentPage = Number(document.getElementById('pageInput').value);
    } else {
      currentPage = Number(page.dataset.value);
    }
    imageDisplay.innerHTML = "";
    renderPage(currentPage);
  }

  const maxLengthCheck = (object) => {
    if (Number(object.value) > Number(object.max)) {
      object.value = object.max
    }
  }
