/*** ВЫБОР ЭЛЕМЕНТОВ ***/

const shuffleButton = document.querySelector('.shuffle__btn');
const kindInput = document.querySelector('.kind__input');
const colorInput = document.querySelector('.color__input');
const weightInput = document.querySelector('.weight__input');
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time');
const sortChangeButton = document.querySelector('.sort__change__btn');
const sortActionButton = document.querySelector('.sort__action__btn');
const addActionButton = document.querySelector('.add__action__btn');
const fruitsList = document.querySelector('.fruits__list');

/*** ДАННЫЕ ***/

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const fruit1 = arr1[i];
    const fruit2 = arr2[i];

    if (fruit1.kind !== fruit2.kind || fruit1.color !== fruit2.color || fruit1.weight !== fruit2.weight) {
      return false;
    }
  }

  return true;
};

const newFruits = [
  {
    kind: 'Мангустин',
    color: 'фиолетовый',
    weight: 13,
  },
  {
    kind: 'Дуриан',
    color: 'зеленый',
    weight: 35,
  },
  {
    kind: 'Личи',
    color: 'розово-красный',
    weight: 17,
  },
  {
    kind: 'Карамбола',
    color: 'желтый',
    weight: 28,
  },
  {
    kind: 'Тамаринд',
    color: 'светло-коричневый',
    weight: 22,
  },
];

if (compareArrays(fruits, newFruits)) {
  alert('Массивы совпадают! Перемешайте!');
}

/*** ВЫВОД ФРУКТОВ ***/

const display = (fruits) => {
  fruitsList.innerHTML = ''; // очищаем список отрисовкой новых элементов
  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];
    const li = document.createElement('li'); // создаем новый элемент li
    li.classList.add('fruit__item'); // добавляем ему класс для стилей
    li.innerHTML = `
      <span class="fruit__number">index ${i + 1}</span><br> 
      <span class="fruit__kind">Fruit: ${fruit.kind}</span><br>
      <span class="fruit__color">Color: ${fruit.color}</span><br>
      <span class="fruit__weight">Weight: ${fruit.weight}</span>
    `; // заполняем элемент содержимым
    fruitsList.appendChild(li); // добавляем элемент в конец списка
  }
};

display(fruits); // вызов функции для отрисовки карточек на странице


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1); // находим случайный индекс из fruits
    const randomFruit = fruits.splice(randomIndex, 1)[0]; // вырезаем случайный элемент из fruits
    result.push(randomFruit); // добавляем вырезанный элемент в result
  }

  fruits = result; // присваиваем новый массив fruits
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация по весу
const filterFruitsByWeight = (minWeight, maxWeight) => {
  fruits = fruits.filter((fruit) => fruit.weight >= minWeight && fruit.weight <= maxWeight);
};

filterButton.addEventListener('click', () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value);
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value);

  if (!isNaN(minWeight) && !isNaN(maxWeight)) {
    filterFruitsByWeight(minWeight, maxWeight);
    display(fruits);
  }
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorA = a.color.toLowerCase();
  const colorB = b.color.toLowerCase();

  if (colorA < colorB) {
    return -1;
  } else if (colorA > colorB) {
    return 1;
  } else {
    return 0;
  }
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // допишите функцию сортировки пузырьком
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },
  

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }
  
    const colors = arr.map(({ color }) => color.toLowerCase());
  
    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr[pivotIndex];
    const pivotColor = colors[pivotIndex];
  
    const less = [];
    const equal = [];
    const greater = [];
  
    for (let i = 0; i < arr.length; i++) {
      const result = comparation(arr[i], pivot);
      const colorA = colors[i];
      const colorB = pivotColor;
  
      if (result < 0) {
        less.push(arr[i]);
      } else if (result > 0) {
        greater.push(arr[i]);
      } else {
        if (colorA < colorB) {
          less.push(arr[i]);
        } else if (colorA > colorB) {
          greater.push(arr[i]);
        } else {
          equal.push(arr[i]);
        }
      }
    }
  
    return [...sortAPI.quickSort(less, comparation), ...equal, ...sortAPI.quickSort(greater, comparation)];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display(fruits);
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: parseInt(weightInput.value),
  };

  fruits.push(newFruit);
  display(fruits);
});