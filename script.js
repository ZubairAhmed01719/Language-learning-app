
let words = [
{ word: "Bitter Sweet", translation: "Mixed Emotion - sad and happy at once" },
  { word: "Break a leg", translation: "Idiom - means Good Luck" },
  { word: "Once in a blue moon", translation: "Rarely happens" },
  { word: "It's raining cats and dogs", translation: "Very heavy rain" },
  { word: "Through thick and thin", translation: "Support in good and bad times" },
  { word: "Out of the blue", translation: "Happened suddenly, unexpectedly" },
  { word: "Cost an arm and a leg", translation: "Very expensive" },
  { word: "Under the weather", translation: "Feeling unwell or sick" },
  { word: "Let the cat out of the bag", translation: "Reveal a secret by mistake" },
  { word: "Hit the sack", translation: "Go to sleep" },
  { word: "Speak of the devil", translation: "Talking about someone and they appear" },
  { word: "Feeling blue", translation: "Feeling sad or down" },
  { word: "Time flies", translation: "Time passes quickly" },
  { word: "Cut corners", translation: "Do something the easy or cheap way" },
  { word: "Sit on the fence", translation: "Not choosing a side or decision" }
];

let currentIndex = 0;

function updateCard() {
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  if (words.length > 0) {
    front.textContent = words[currentIndex].word;
    back.textContent = words[currentIndex].translation;
  } else {
    front.textContent = "No Words";
    back.textContent = "Add Some!";
  }
  document.getElementById('streak').textContent = `🔥 ${localStorage.getItem('streak') || 0}-Day Streak`;
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  currentIndex = (currentIndex + 1) % words.length;
  updateCard();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  updateCard();
}

function speak() {
  const utter = new SpeechSynthesisUtterance(words[currentIndex].word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

document.getElementById('add-form').addEventListener('submit', e => {
  e.preventDefault();
  const word = document.getElementById('new-word').value;
  const translation = document.getElementById('new-translation').value;
  if (word && translation) {
    words.push({ word, translation });
    currentIndex = words.length - 1;
    updateCard();
    renderList();
    e.target.reset();
    updateStreak();
  }
});

function renderList() {
  const list = document.getElementById('vocab-list');
  list.innerHTML = "";
  words.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.word} → ${item.translation} <button onclick="deleteWord(${index})">✖</button>`;
    list.appendChild(li);
  });
}

function deleteWord(index) {
  words.splice(index, 1);
  currentIndex = 0;
  updateCard();
  renderList();
}

function clearWords() {
  if (confirm("Clear all words?")) {
    words = [];
    updateCard();
    renderList();
    localStorage.setItem('streak', '0');
  }
}

document.getElementById('search').addEventListener('input', () => {
  const query = document.getElementById('search').value.toLowerCase();
  const filtered = words.filter(w => w.word.toLowerCase().includes(query));
  const list = document.getElementById('vocab-list');
  list.innerHTML = "";
  filtered.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.word} → ${item.translation}`;
    list.appendChild(li);
  });
});

function startQuiz() {
  const random = words[Math.floor(Math.random() * words.length)];
  const answer = prompt(`Translate: ${random.word}`);
  if (answer?.toLowerCase() === random.translation.toLowerCase()) {
    alert("✅ Correct!");
  } else {
    alert(`❌ Wrong. Correct: ${random.translation}`);
  }
  updateStreak();
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem('lastDate');
  let streak = parseInt(localStorage.getItem('streak')) || 0;

  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) streak++;
    else streak = 1;
    localStorage.setItem('lastDate', today);
    localStorage.setItem('streak', streak.toString());
    document.getElementById('streak').textContent = `🔥 ${streak}-Day Streak`;
  }
}

updateCard();
renderList();
