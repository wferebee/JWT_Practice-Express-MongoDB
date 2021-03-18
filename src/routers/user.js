
const express = require('express')
var path = require('path');
const User = require('../models/User')
const auth = require("../middleware/auth")
const router = express.Router()
const toggleLogIn = require("../../public/js/helperFunctions")



router.get("/", (req, res, next)=> {
    res.sendFile(path.join(__dirname + '../../../public/html/login.html'));
})
router.post('/new-users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()

        req.session.message = 'Now you may Login';
        return res.redirect("/");
       
    } catch (error) {
        return res.redirect("/");
    }
  
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
       
        if (!user) {
            return res.sendFile(path.join(__dirname + '../../../public/html/login.html'));
        } else {
            const token = await user.generateAuthToken()
            
            res.sendFile(path.join(__dirname + '../../../public/html/chat.html'));
        }
    
        
    } catch (error) {
        return res.sendFile(path.join(__dirname + '../../../public/html/login.html'));
    }
    
})




router.get('/chat', auth, async(req, res) => {
    // View logged in user profile
    res.sendFile(path.join(__dirname + '../../../public/html/chat.html'));
})


router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router