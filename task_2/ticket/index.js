// массивы опций для селектов
const route = [
  "из A в B", "из B в A", "из A в B и обратно в А"
]
const timeFromAToB = [
  "18:00", "18:30", "18:45", "19:00", "19:15", "21:00", "22:00"
]
const timeFromBToA = [
  "18:30", "18:45", "19:00", "19:15", "19:35", "21:50", "21:55"
]

// длительность поездки
const tripLasting = 50
// div для селектов
const divForSelects = document.querySelector('.choose_ticket_option')
// кнопка
const btn = document.querySelector('#btn')

// функция получения значения
const getValue = (select) => {
  return document.querySelector(select).value
  // console.log(document.querySelector(select))
}

// РАБОТА С СЕЛЕКТАМИ
// добавить опции
function addOptions(data, id, direction = '') {
  data.forEach(el => {
    const option = `
      <option value="${el}">${el} ${direction}</option>
    `
    document.querySelector(`#${id}`).insertAdjacentHTML('beforeend', option)
  }) 
} 

// добавить селект
function addSelect(id, title, data, direction) {
  const select = `
    <select name="${id}" id="${id}">
      <option value="" disabled selected>${title}</option>
    </select>
  `
  divForSelects.insertAdjacentHTML('beforeend', select)
  addOptions(data, id, direction)
}

// строку со временем преобразуем в массив
const timeToArr = (value) => {
  return value.split(':')
}

// пересчёт времени отправления в мс
const hoursToMs = (hours) => {
  const time = timeToArr(hours)
  //создаём объект с сегодняшней датой
  let currentTime = new Date()
  //устанавливаем для даты часы и минуты
  currentTime.setHours(+(time[0]), +(time[1]))
  return currentTime.getTime()
}

// расчёт времени прибытия
const getArriveTime = (departureTime, lasting) => {
  const ms = hoursToMs(departureTime)
  // console.log(ms)
  const res = new Date(ms + (lasting * 60 * 1000))
  return res
  // console.log(res)
}

// пересчёт мс в секунды
// const msToDate = (ms) => {
//   return new Date(ms)
// }

// посчитать длительность пути


// получаем из даты часов и минут строкой
const getStrHours = (date) => {
  return `
    ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
  `
}

// найти доступное время для возвращения
function enabledTimes (data, value, lasting) {
  // для вывода при отсутствии доступных
  const noOptions = `
    <p class="no_option">
      Нет доступных по времени поездок обратно, пожалуйста, выберите другое время или поездку в одну сторону
    </p>
  `
  // время отправления в мс
  // const departureTime = hoursToMs(value)

  // время прибытия
  const arriveTime = getStrHours(getArriveTime(value, lasting))
  console.log(arriveTime)
  const enableTimeArr = []

  // перебор массива с временем по направлению из В в А
  // сравниваем с временем прибытия, чтобы увидеть доступные
  data.forEach(el => {
    const backTime = hoursToMs(el)
    if (backTime > hoursToMs(arriveTime)) {
      const backHour =  getStrHours(new Date(backTime)) 
      enableTimeArr.push(backHour)
    }
    return enableTimeArr
  })
  enableTimeArr.length === 0 ? divForSelects.insertAdjacentHTML('beforeend', noOptions)
  : addSelect('timeback', 'Выберите время', enableTimeArr, 'из B в A')
}


// на основе выбранного направления создаются следующие селекты
function getRoute() {
  // получаем значение из селекта
  const routeValue = getValue('#route')

  // проверки и удаления селекторов, если уже было выбрано другое направление
  if (document.querySelector('#time')) {
    document.querySelector('#time').remove()
  }
  if (document.querySelector('#timeback')) {
    document.querySelector('#timeback').remove()
  }

  // создание следующих селектов
  switch (routeValue) {
    case 'из A в B':
      addSelect('time', 'Выберите время', timeFromAToB, routeValue)
      break
    case 'из B в A':
      addSelect('time', 'Выберите время', timeFromBToA, routeValue)
      break
    case 'из A в B и обратно в А':
      addSelect('time', 'Выберите время', timeFromAToB, 'из A в B')
      // создание селекта с выбором обратного времени, в зависимости от времени туда
      document.querySelector('#time').addEventListener('change',
        () => {
          // проверка на уже имеющийся селект
          if (document.querySelector('#timeback')) {
            document.querySelector('#timeback').remove()
          }
          if (document.querySelector('.no_option')) {
            document.querySelector('.no_option').remove()
          }
          // получение значения из селекта
          const timeValue = getValue('#time')
          enabledTimes(timeFromBToA, timeValue, tripLasting)
        }
      )
  }
}

// РАБОТА С ИНПУТОМ

// ограничение ввода количества билетов
// function checkInputValue () {
//   getValue('.input')
// }


// ОБРАБОТЧИК СОБЫТИЯ ДЛЯ КНОПКИ
function getInfo () {
  // получение всех необходимых значений
  const routeValue = getValue('#route')
  const timeValue = getValue('#time')
  const ticketAmount = getValue('#num')

  // установка цены в зависимости от направления
  // и расчёт полной
  const price = routeValue === 'из A в B и обратно в А' ? 1200 : 700
  const fullPrice = price * ticketAmount
  // получение времени обратной поездки, если выбрано туда и обратно
  const timeBackValue = routeValue === 'из A в B и обратно в А'
    ? getValue('#timeback') : null
  
  // расчёт длительности поездки
  const minToHour = (min) => {
    if (min > 60) {
      const hours = Math.floor(min / 60)
      const minutes = (min - (hours * 60))
      return `${hours} ч. ${minutes} мин.`
    }
    return `${min} мин.`
  }

  const lasting = routeValue === 'из A в B и обратно в А'
    ? minToHour(tripLasting * 2)
    : minToHour(tripLasting)
  
  
  // заполнение информации о времени и длительности поездки
  const pTime = timeBackValue
      ? `<p>
        Общая продолжительность ${lasting}.
        Отправление в ${timeValue}.
        Прибытие в ${getStrHours(getArriveTime(timeValue, tripLasting))}.

        Отправление в обратную сторону в ${timeBackValue}.
        Прибытие в ${getStrHours(getArriveTime(timeBackValue, tripLasting))}.
        </p>`
      : `<p>Продолжительность ${lasting}.
        Отправление в ${timeValue}.
        Прибытие в ${getStrHours(getArriveTime(timeValue, tripLasting))}.</p>`

  // полная информация по выбранным билетам
  const result = `
    <p>
    Вы выбрали маршрут ${routeValue}, стоимостью ${price} рублей, количество билетов: ${ticketAmount}.
    </p>
    <p>Общая стоимость: ${fullPrice} руб.</p>
    <p>
      ${pTime}
    </p>
  `
  document.querySelector('.result').innerHTML = result
}

addSelect('route', 'Выберите направление', route)
document.querySelector('#route').addEventListener('change', getRoute)
btn.addEventListener('click', getInfo)