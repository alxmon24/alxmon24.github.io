// Array de 20 temas ENARM (cada uno se asignará a una pregunta distinta)
const topics = [
  "Fisiología cardiovascular",
  "Patología renal",
  "Neurología",
  "Gastroenterología",
  "Endocrinología",
  "Infectología",
  "Medicina interna",
  "Cirugía general",
  "Pediatría",
  "Obstetricia y Ginecología",
  "Psiquiatría",
  "Dermatología",
  "Oncología",
  "Nutrición y metabolismo",
  "Toxicología",
  "Epidemiología",
  "Hematología",
  "Reumatología",
  "Inmunología",
  "Urgencias"
];

// Plantillas para formular preguntas. Se insertará el {topic} en cada una.
const questionTemplates = [
  "¿Cuál es la manifestación clínica más frecuente en la condición de {topic}?",
  "En relación a {topic}, ¿cuál de las siguientes afirmaciones es la más precisa?",
  "Respecto a {topic}, ¿qué hallazgo es más característico?",
  "¿Cuál de los siguientes es el principal factor diagnóstico en {topic}?",
  "Para el abordaje de {topic}, ¿cuál es la prueba diagnóstica de elección?"
];

// Función para generar opciones que incorporen el tema
function generateOptions(topic) {
  return [
    `Se asocia a síntomas inespecíficos en ${topic}.`,
    `Presenta hallazgos clínicos característicos en ${topic}.`,
    `Requiere pruebas diagnósticas específicas en ${topic}.`,
    `Su manejo se basa en tratamiento multidisciplinario en ${topic}.`
  ];
}

// Función para mezclar (barajar) un arreglo utilizando el algoritmo Fisher-Yates
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Objeto que contendrá las preguntas para cada nivel (1 a 20)
const questionsData = {};

// Generar 20 preguntas para cada nivel
for (let level = 1; level <= 20; level++) {
  // Usamos el número de nivel como clave (convertido a string)
  questionsData[level.toString()] = [];
  for (let i = 0; i < 20; i++) {
    // Seleccionamos el tema (cada pregunta utiliza uno de los 20 temas)
    const topic = topics[i]; 
    // Elegir aleatoriamente una plantilla y reemplazar {topic} por el tema
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    const questionText = `Nivel ${level} - Pregunta ${i + 1}: ` + template.replace("{topic}", topic);
    
    // Generar las opciones (se genera un arreglo nuevo para cada pregunta)
    let options = generateOptions(topic);
    // Barajar las opciones para que el orden sea aleatorio
    options = shuffleArray(options.slice());
    // Seleccionar aleatoriamente el índice de la respuesta correcta
    const correctIndex = Math.floor(Math.random() * options.length);
    
    // Agregar el objeto pregunta al arreglo del nivel correspondiente
    questionsData[level.toString()].push({
      question: questionText,
      options: options,
      correct: correctIndex
    });
  }
}

// Esperar a que el DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
  const levelSelect = document.getElementById('levelSelect');
  const quizContainer = document.getElementById('quizContainer');
  const resultContainer = document.getElementById('resultContainer');

  // Cuando el usuario selecciona un nivel, se carga el cuestionario
  levelSelect.addEventListener('change', function() {
    const selectedLevel = this.value;
    resultContainer.innerHTML = ''; // Limpiar resultados anteriores
    loadQuiz(selectedLevel);
  });

  // Función para cargar el cuestionario del nivel seleccionado
  function loadQuiz(level) {
    quizContainer.innerHTML = '';
    // Validar si existen preguntas para el nivel seleccionado
    if (!questionsData[level] || questionsData[level].length === 0) {
      quizContainer.innerHTML = `<p>No hay preguntas definidas para este nivel.</p>`;
      return;
    }

    const form = document.createElement('form');
    questionsData[level].forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');
      
      const questionTitle = document.createElement('h3');
      questionTitle.textContent = q.question;
      questionDiv.appendChild(questionTitle);

      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('options');

      q.options.forEach((option, optIndex) => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question${index}`;
        radio.value = optIndex;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        optionsDiv.appendChild(label);
      });

      questionDiv.appendChild(optionsDiv);
      form.appendChild(questionDiv);
    });

    // Botón para enviar respuestas
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Enviar respuestas';
    form.appendChild(submitBtn);

    // Evento de envío del formulario
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      gradeQuiz(level, form);
    });

    quizContainer.appendChild(form);
  }

  // Función para calificar el cuestionario y mostrar el feedback
  function gradeQuiz(level, form) {
    let score = 0;
    let feedback = '';
    const questions = questionsData[level];

    questions.forEach((q, index) => {
      const selected = form.querySelector(`input[name="question${index}"]:checked`);
      if (selected) {
        if (parseInt(selected.value) === q.correct) {
          score++;
        } else {
          feedback += `<p><strong>Pregunta ${index + 1}:</strong> Respuesta incorrecta. Respuesta correcta: ${q.options[q.correct]}</p>`;
        }
      } else {
        feedback += `<p><strong>Pregunta ${index + 1}:</strong> No se seleccionó respuesta. Respuesta correcta: ${q.options[q.correct]}</p>`;
      }
    });

    resultContainer.innerHTML = `<h2>Resultado: ${score} de ${questions.length} correctas</h2>`;
    if (feedback !== '') {
      resultContainer.innerHTML += feedback;
    }
  }
});
