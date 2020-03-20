(function(){
  const INDEX_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const user = document.getElementById('user')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('searchBar')
  const data = JSON.parse(localStorage.getItem('favoriteUsers'))

  showUserPanel(data)

  user.addEventListener('click', event => {
    if (event.target.matches('.btn-show')) {
      modalShowDital(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteUser(event.target.dataset.id)
    }
  })

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = []
    results.push(...data.filter(
      user => user.name.toLowerCase().includes(input)
    ))
    results.push(...data.filter(
      user => user.surname.toLowerCase().includes(input)
    ))
    console.log(results)
    showUserPanel(results)
  })

  function showUserPanel(data) {
    if (data.length === 0) {
      user.classList.remove('justify-content-around')
      user.classList.add('justify-content-center')
      user.innerHTML = `
        <p style="color: #1dd7a7; font-size: 60px;">No one is here:)</p>
      `
    } else {
      let htmlContent = ''
      data.forEach(user => {
        htmlContent += `
        <div class="col-auto">
          <div class="card hvr-border-fade" style="width: 15rem;">
            <button type="input" data-id="${user.id}" class="fa fa-heart heart btn-remove-favorite"></button>
            <img data-id="${user.id}" class="card-img-top panel square hvr-grow btn-show" src="${user.avatar}" data-toggle="modal" data-target="#userModal" alt="Card image cap">
            <div class="card-inner">
              <h5 class="card-title">${user.name}</h5>
              <h5 class="card-title">${user.surname}<i class="fa fa-${user.gender}" style="float:right;"></i></h5>
            </div>
          </div>
        </div>
      `
      })
      user.innerHTML = htmlContent
    }
  }

  function modalShowDital(id) {
    const url = INDEX_URL + id
    const modalShow = document.getElementById('modal-content')
    modalShow.innerHTML = ''
    axios.get(url)
      .then(response => {
        const user = response.data
        modalShow.innerHTML = `
          <div class="modal-header">
            <h5 id="user-name" class="modal-title" id="exampleModalLabel">
            ${user.name} ${user.surname}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div id="user-pic" class="row justify-content-center">
                <img class="show square" src="${user.avatar}">
              </div>
              <div id="user-dital" class="row justify-content-center">
                <ul class="model-ul">
                  <li>
                    <i class="fa fa-transgender icon"></i>
                    ${user.gender}
                  </li>
                  <li>
                    <i class="fa fa-user icon"></i>
                    ${user.age} years old
                  </li>
                  <li>
                    <i class="fa fa-birthday-cake icon"></i>
                    ${user.birthday}
                  </li>
                  <li>
                    <i class="fa fa-comment icon"></i>
                    ${user.email}
                  </li>
                  <li>
                    <i class="fa fa-map-marker icon"  style="margin-left: 4px;"></i>
                    ${user.region}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
          </div>
        `
      })
      .catch(err => {
        console.log(err)
      })
  }

  function removeFavoriteUser (id) {
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    data.splice(index,1)
    localStorage.setItem('favoriteUsers', JSON.stringify(data))

    showUserPanel(data)
  }

})()
