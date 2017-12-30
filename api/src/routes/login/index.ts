import { Router, Request, Response } from 'express';
import { MongoId, ROLES } from '../../constants';
import User from '../../models/User';
import Entry, { EntryModel } from '../../models/Entry';
import Slot from '../../models/Slot';

const loginRouter = Router();

/**
 * Login
 */
loginRouter.get('/', async (request: Request, response: Response, next) => {
  try {
    const childrenIds: MongoId[] = request.user.children;
    const children = await User
      .find({ _id: { $in: childrenIds } })
      .select('-password');

    const entries: EntryModel[] = await Entry
      .find({ student: { $in: childrenIds } });

    const slotIds: MongoId[] = [];
    entries.forEach(entry => slotIds.push(...entry.slots));
    const slots = await Slot
      .find({ _id: { $in: slotIds } });
    
    return response.json({
      auth: {
        displayname: request.user.displayname,
        role: request.user.role,
        children: request.user.children,
      },
      users: [...children],
      entries: [...entries],
      slots: [...slots],
    });
  } catch (error) {
    return next(error);
  }
});

export default loginRouter;
