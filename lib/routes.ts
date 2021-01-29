import { Router } from 'express';
const router = Router();
// Controllers
import * as Personas from './controllers/personas' ;
import * as Books from './controllers/books' ;
import * as History from './controllers/history' ;
// ==================== ROUTES ==================== //
router.post('/persona', Personas.create);
router.get('/persona/:id', Personas.get);
router.put('/persona/:id', Personas.update);
router.delete('/persona/:id', Personas.remove);
router.get('/persona/search/:query', Personas.search);

router.post('/book', Books.create);
router.get('/book/:id', Books.get);
router.put('/book/:id', Books.update);
router.delete('/book/:id', Books.remove);
router.get('/book/search/:query', Books.search);
router.put('/book/lend/:id', Books.lend);
router.put('/book/return/:id', Books.giveback);

router.get('/history/:page?', History.getPaginated);
router.get('/history/persona/:id', History.getPersonaRecords);
router.get('/history/book/:id', History.getBookRecords);

export default router;