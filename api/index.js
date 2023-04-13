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
  	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function request(req) {
	// console.log(req)

	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: req.prompt,
		max_tokens: 50,
		temperature: 0.4
	
	  });
	  return { result: completion.data.choices[0].message.content };
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
