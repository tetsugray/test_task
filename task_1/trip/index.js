const timesFew = [
  '12:00', '13:00', '14:00'
]
const timesMany = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
]

const getTimeArr = (arr) => {
  const timeArr = []
  arr.forEach(el => {
    const buttonTime = `<button class="tripcard__button_time">${el}</button>`
    timeArr.push(buttonTime)
  })
  return timeArr
}

function addTime(arr, selector) {
  if (arr.length <= 5) {
    arr.forEach(el => {
      document.querySelector(selector).insertAdjacentHTML('beforeend', el)
    })
  } else {
    const newArr = arr.slice(0, 3)
    newArr.push(`<button class="tripcard__button_time tripcard__button_more-time">ещё...</button>`)
    newArr.forEach(el => {
      document.querySelector(selector).insertAdjacentHTML('beforeend', el)
    })
  }
}

function showFullTime (arr, node) {
  arr.forEach(el => {
    node.insertAdjacentHTML('beforeend', el)
  })
}

const buttonsFew = getTimeArr(timesFew)
const buttonsMany = getTimeArr(timesMany)

function showTime (e) {
  const parent = e.target.parentElement
  parent.querySelectorAll('.tripcard__button_time').forEach(el => {el.remove()})
  showFullTime(buttonsMany, parent)
}

addTime(buttonsFew, '.tripcard__list_item-times-few')
addTime(buttonsMany, '.tripcard__list_item-times-many')
document.querySelector('.tripcard__button_more-time').addEventListener('click', showTime)