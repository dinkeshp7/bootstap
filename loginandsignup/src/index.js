const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')

app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            // If a user with the same name already exists
            return res.send("User already exists");
        }

        const data = {
            name: req.body.name,
            password: req.body.password
        };

        await LogInCollection.insertMany([data]);
        res.status(201).render("home", {
            naming: req.body.name
        });
    } catch (error) {
        res.send("Error during signup");
    }
});



app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            // If login is successful, render home page
            res.status(201).render("home", { naming: `${req.body.name}` });
        } else {
            res.send("Incorrect username or password");
        }
    } catch (e) {
        res.send("Error during login");
    }
});




app.listen(port, () => {
    console.log('port connected');
})