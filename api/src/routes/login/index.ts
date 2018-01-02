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
    const users = await User
      .find({
        $or: [
          { _id: { $in: childrenIds } },
          { role: ROLES.TEACHER },
        ],
      })
      .select('-password');

    const entries: EntryModel[] = await Entry
      .find({ student: { $in: childrenIds } });

    const slotIds: MongoId[] = [];
    entries.forEach(entry => slotIds.push(...entry.slots));
    const slots = await Slot
      .find({ _id: { $in: slotIds } });
    
    return response.json({
      entries,
      slots,
      users,
      auth: {
        displayname: request.user.displayname,
        role: request.user.role,
        children: request.user.children,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default loginRouter;
