const express = require('express');
const app = express()
var bodyParser = require('body-parser')
const port = 3001;
require('dotenv').config({ path: require('find-config')('.env') })
const cors = require('cors');
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	organization: "org-7EI8r48srsW3pVpQ7E7KPmy6",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const dialogExample = [
	{
	  "speaker": "user",
	  "text": "Hello, how are you?"
	},
	{
	  "speaker": "bot",
	  "text": "I am doing well, thank you. How can I help you today?"
	}
  ];

async function request(req) {
	// console.log(req)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
	  prompt: req.prompt,
	  max_tokens: 256,
	  temperature: 0.8,
  });
  return { 'result': completion.data.choices[0].text };
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.
Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

app.get('/api', (req, res) => {
	res.send("hi")
	})


app.post('/api', (req, res) => {
	console.log(req.body)
	console.log(process.env.OPENAI_API_KEY)
	// res.send("hi")
	// let output = request().then((result) => console.log(result))
	let output = null;
	request(req.body).then((result) => {res.json(result)}).then((data) => {output = data; console.log(data)})
	
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
