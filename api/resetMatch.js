// api/resetMatch.js
import { adminDb } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { matchId, userId } = req.body;

  if (!matchId || !userId) {
    return res.status(400).json({ error: 'Missing matchId or userId' });
  }

  try {
    const matchRef  = adminDb.collection('matches').doc(matchId);
    const matchSnap = await matchRef.get();

    if (!matchSnap.exists) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const matchData = matchSnap.data();
    const [uid1, uid2] = matchData.users;

    // Cooldown expires 15 seconds from now
    const cooldownUntil = Date.now() + 15000;

    await adminDb.collection('users').doc(uid1).update({
      matched:       false,
      matchId:       null,
      inPool:        false,
      cooldownUntil: cooldownUntil,
    });

    await adminDb.collection('users').doc(uid2).update({
      matched:       false,
      matchId:       null,
      inPool:        false,
      cooldownUntil: cooldownUntil,
    });

    await matchRef.update({ status: 'passed' });

    console.log('Match reset for both users:', uid1, uid2);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Reset error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
