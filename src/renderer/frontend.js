import url from 'url'
import path from 'path'
import applyFilter from './filters'
import { setIpc, sendIpc } from './ipcRendererEvents'

// import os from 'os'
window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por JS'
  // console.log(os.cpus())
  setIpc()
  addImageEvents()
  searchImagesEvent()
  selectEvent()
  openDirectory()
})

function openDirectory () {
  const openDirectory = document.getElementById('open-directory')
  openDirectory.addEventListener('click', () => {
    sendIpc()
  })
}

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
    document.querySelector('li.selected').classList.remove('selected')
    node.classList.add('selected')
    document.getElementById('image-displayed').src = node.querySelector('img').src
  } else {
    document.getElementById('image-displayed').src = ''
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

function selectFirstImage () {
  const image = document.querySelector('li.list-group-item:not(.hidden')
  if (image != null) {
    changeImage(image)
  }
}

function selectEvent () {
  const select = document.getElementById('filters')

  select.addEventListener('change', function () {
    applyFilter(this.value, document.getElementById('image-displayed'))
  })
}
