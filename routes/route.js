const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to my API!' });
});

app.use('/api', router);
