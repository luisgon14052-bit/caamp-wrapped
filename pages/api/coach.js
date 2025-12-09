
import coaches from '../../data/coaches.json';

export default function handler(req, res) {
  const { name } = req.query;
  if (!coaches[name]) {
    return res.status(404).json({ error: 'Coach no encontrado' });
  }
  res.status(200).json(coaches[name]);
}
