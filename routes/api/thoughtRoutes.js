const router = require('express').Router();
const { 
    getThoughts, 
    getSingleThought, 
    createThought,
    deleteThought,
    updateThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

router
    .route('/')
    .get(getThoughts)
    .post(createThought);

router
    .route('/:id')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

router
    .route('/:thoughtId/reactions')
    .post(createReaction);

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);


module.exports = router;