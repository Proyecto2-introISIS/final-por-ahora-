import dbConnect from '@/utils/dbConnect';
import Budget from '@/models/Budget';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, participants } = req.body;
    const budget = new Budget({ name, participants });
    await budget.save();
    res.status(201).json(budget);
  } else if (req.method === 'GET') {
    const budgets = await Budget.find({});
    res.status(200).json(budgets);
  }
}