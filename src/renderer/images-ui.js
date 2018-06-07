import url from 'url'
import path from 'path'
import applyFilter from './filters'

function addImageEvents () {
  const thumbs = document.querySelectorAll('li.list-group-item')

  for (let i = 0, length1 = thumbs.length; i < length1; i++) {
    thumbs[i].addEventListener('click', function () {
      changeImage(this)
    })
  }
}

function changeImage (node) {
  if (node) {
    const selected = document.querySelector('li.selected')
    if (selected) {
      selected.classList.remove('selected')
    }
    node.classList.add('selected')
    const image = document.getElementById('image-displayed')
    image.src = node.querySelector('img').src
    image.dataset.original = image.src
  } else {
    document.getElementById('image-displayed').src = ''
  }
}

function selectFirstImage () {
  const image = document.querySelector('li.list-group-item:not(.hidden')
  if (image != null) {
    changeImage(image)
  }
}

function searchImagesEvent () {
  const searchBox = document.getElementById('search-box')

  searchBox.addEventListener('keyup', function () {
    // para validar si lo que escribe en la caja coincide con los elementos que contiene la lista
    const regex = new RegExp(this.value.toLowerCase(), 'gi')

    if (this.value.length > 0) {
      const thumbs = document.querySelectorAll('li.list-group-item img')
      for (let i = 0; i < thumbs.length; i++) {
        const fileUrl = url.parse(thumbs[i].src)
        const fileName = path.basename(fileUrl.pathname)
        // para mostrar sólo el que se selecciona al hacer click
        if (fileName.match(regex)) {
          thumbs[i].parentNode.classList.remove('hidden')
        } else {
          thumbs[i].parentNode.classList.add('hidden')
        }
      }
      selectFirstImage()
    } else {
      const hidden = document.querySelectorAll('li.hidden')
      for (let i = 0; i < hidden.length; i++) {
        hidden[i].classList.remove('hidden')
      }
    }
  })
}

function selectEvent () {
  const select = document.getElementById('filters')

  select.addEventListener('change', function () {
    applyFilter(this.value, document.getElementById('image-displayed'))
  })
}

function clearImages () {
  const oldImages = document.querySelectorAll('li.list-group-item')
  console.log('limpiando las imagenes antiguas', oldImages)
  for (let i = 0; i < oldImages.length; i++) {
    oldImages[i].parentNode.removeChild(oldImages[i])
  }
}

function loadImages (images) {
  const imagesList = document.querySelector('ul.list-group')

  for (let i = 0; i < images.length; i++) {
    const node = `<li class="list-group-item">
                    <img class="media-object pull-left" src="${images[i].src}" height="32">
                    <div class="media-body">
                      <strong>${images[i].filename}</strong>
                      <p>${images[i].size}</p>
                    </div>
                  </li>`
    imagesList.insertAdjacentHTML('beforeend', node)
  }
}

module.exports = {
  addImageEvents,
  changeImage,
  selectFirstImage,
  selectEvent,
  searchImagesEvent,
  clearImages,
  loadImages
}
