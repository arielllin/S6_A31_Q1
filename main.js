(function () {
  const INDEX_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const user = document.getElementById('user')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('searchBar')
  const data = []
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 16
  let paginationData = []
  
  //設置點擊大頭貼與我的最愛事件
  user.addEventListener('click', event => {
    if (event.target.matches('.btn-show')) {
      modalShowDital(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteUser(event.target.dataset.id)
    }
  })

  //設置搜尋事件
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

  //新增 Pagination 標籤的事件監聽器
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  //顯示全部User
  function showUserPanel(data) {
    let htmlContent = ''
    data.forEach(user => {
      htmlContent += `
        <div class="col-auto">
          <div class="card hvr-border-fade" style="width: 15rem;">
            <button type="input" data-id="${user.id}" class="fa fa-heart-o heart btn-add-favorite"></button>
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

  //顯示User Model
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

  //存入我的最愛
  function addFavoriteUser(id) {
    const user = data.find(item => item.id === Number(id))
    const index = list.findIndex(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      if (index === -1) return
      console.log(index)

      list.splice(index, 1)
    } else {
      list.push(user)
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
  }

  //抓取api
  axios.get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results)
      // showUserPanel(data)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch(err => {
      console.log(err)
    })

  //計算總頁數並演算 li.page-item
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    showUserPanel(pageData)
  }

})()
