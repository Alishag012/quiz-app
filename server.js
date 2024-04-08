const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3007; // Or choose a different port if needed

// Serve static HTML/CSS/JS files
app.use(express.static(path.join(__dirname, 'public')));

// Load quiz questions from 'questions.json'
const questionsFile = path.join(__dirname, 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsFile));

// Retrieve all quiz questions
app.get('/questions', (req, res) => {
    res.json(questions);
});

// Handle submission of quiz answers
app.post('/submit', express.json(), (req, res) => {
    const userAnswers = req.body.answers;
    console.log("Received Answers:", userAnswers); // Log received answers
    console.log("Questions:", questions);

    let score = 0;
    let feedback = [];

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].answer) {
            score++;
            feedback.push({ question: questions[i].text, result: 'correct' });
        } else {
            feedback.push({
                question: questions[i].text,
                result: 'incorrect', 
                correctAnswer: questions[i].options[questions[i].answer]
            });
        }
    }

    res.json({ score, feedback });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Something went wrong!');
}); 

app.listen(port, () => {
    console.log(`Quiz app listening on port ${port}`);
});
