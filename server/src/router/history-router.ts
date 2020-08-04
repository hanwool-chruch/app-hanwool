import { Router } from 'express';
import { HistoryController } from '../controller';

const historyRouter = Router();
historyRouter.post('/', HistoryController.create);
historyRouter.get('/', HistoryController.findByMonth);
historyRouter.put('/', HistoryController.update);
historyRouter.delete('/', HistoryController.remove);

export default historyRouter;
