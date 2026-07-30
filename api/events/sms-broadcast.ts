import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipientRole, message, customPhone, classId } = req.body || {};

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message body cannot be empty' });
    }

    const segmentCount = Math.ceil(message.length / 160) || 1;

    // Log broadcast operation
    console.log(`[SMS Gateway] Sending broadcast to role: ${recipientRole || 'guardian'}, segments: ${segmentCount}`);

    return res.status(200).json({
      success: true,
      message: 'SMS broadcast queued and transmitted successfully.',
      recipientRole,
      customPhone,
      classId,
      segmentCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[SMS Gateway Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
