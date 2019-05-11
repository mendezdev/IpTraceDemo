const router = require('express').Router();

router.get('/:ipValue', (req, res) => {
    const { ipValue } = req.params;

    res.status(200).json({
        message: 'The ip to trace is: ' + ipValue
    })
})

module.exports = router;