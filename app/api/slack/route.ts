import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_TOKEN);

export async function POST(request: Request) {
  try {
    const { message, channel } = await request.json();
    
    if (!message || !channel) {
      return NextResponse.json(
        { error: 'Message and channel are required' },
        { status: 400 }
      );
    }

    const result = await slack.chat.postMessage({
      channel,
      text: message
    });

    if (!result.ok) {
      throw new Error('Failed to send message to Slack');
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return NextResponse.json(
      { error: 'Failed to send message to Slack' },
      { status: 500 }
    );
  }
}
