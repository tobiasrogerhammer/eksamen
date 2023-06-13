const router = require("express").Router();
const Message = require("./message");

router.post('/create', async (req, res) => {
    console.log(req.body)
    try{
        const newMessage = new Message({
            message: req.body.message,
            username: req.body.username,
            time: req.body.time,
        });
        const message = await newMessage.save();
        res.status(200).json(message);
    }  catch (err){res.status(500).json('feil')}
})

router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;