import Rental from '../models/Rental.js';
import Order from '../models/Order.js';

export const checkStockAvailability = async (product, startDate, endDate) => {
  // 1. Find overlapping Rental documents (assuming qty=1)
  const rentalDocs = await Rental.find({
    product: product._id,
    status: { $in: ['requested', 'approved', 'ongoing'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  // 2. Find overlapping Order items (type='rental')
  const orderDocs = await Order.find({
    'items.product': product._id,
    'items.type': 'rental',
    'items.rentalStart': { $lte: endDate },
    'items.rentalEnd': { $gte: startDate }
  });

  let maxUsed = 0;
  
  // Clone startDate to avoid modifying the original date object passed in
  const d = new Date(startDate);
  const end = new Date(endDate);
  
  while (d <= end) {
    let dailyUsed = 0;

    for (const r of rentalDocs) {
      if (new Date(r.startDate) <= d && new Date(r.endDate) >= d) {
        dailyUsed += 1;
      }
    }

    for (const o of orderDocs) {
      for (const item of o.items) {
        if (item.product.toString() === product._id.toString() && item.type === 'rental') {
          if (new Date(item.rentalStart) <= d && new Date(item.rentalEnd) >= d) {
            dailyUsed += item.qty;
          }
        }
      }
    }

    if (dailyUsed > maxUsed) maxUsed = dailyUsed;
    d.setDate(d.getDate() + 1);
  }

  const available = product.stock - maxUsed;
  return {
    available: available > 0 ? available : 0,
    maxUsed
  };
};