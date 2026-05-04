import { fail, ok } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { createChannelSchema } from '@/modules/community-chat/community-chat.schema';
import { CommunityChatService } from '@/modules/community-chat/community-chat.service';
import { z } from 'zod';

import { requireAdminSession } from '../_shared';

const updateChannelSchema = createChannelSchema.partial().extend({
  description: z.string().max(500).optional().nullable(),
  coverUrl: z.string().url().optional().nullable().or(z.literal('')),
});

const parsePositiveInt = (value: unknown) => {
  const num = typeof value === 'string' ? Number(value) : Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
};

export async function GET(req: Request) {
  const { session, response } = await requireAdminSession();
  if (response) return response;

  const url = new URL(req.url);
  const all = url.searchParams.get('all') !== 'false';

  const channels = await CommunityChatService.listChannels(
    session?.user.id,
    all,
  );

  return ok(channels);
}

export async function PATCH(req: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return fail('BAD_REQUEST', 'Invalid JSON body', 400);
  }

  const id = parsePositiveInt(body.id);

  if (!id) {
    return fail('BAD_REQUEST', 'id must be a positive integer', 400);
  }

  const { id: _id, ...payload } = body;
  const parsed = updateChannelSchema.safeParse(payload);

  if (!parsed.success) {
    return fail('BAD_REQUEST', 'Invalid channel update payload', 400);
  }

  const data = parsed.data;
  const updateData: {
    name?: string;
    description?: string | null;
    coverUrl?: string | null;
    type?: 'PUBLIC' | 'PRIVATE';
  } = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.coverUrl !== undefined) {
    updateData.coverUrl = data.coverUrl === '' ? null : data.coverUrl;
  }
  if (data.type !== undefined) updateData.type = data.type;

  if (Object.keys(updateData).length === 0) {
    return fail('BAD_REQUEST', 'No fields to update', 400);
  }

  const existing = await prisma.channel.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return fail('NOT_FOUND', 'Channel not found', 404);
  }

  const updated = await prisma.channel.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      description: true,
      coverUrl: true,
      type: true,
    },
  });

  return ok(updated);
}

export async function DELETE(req: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  let body: { id?: number } | null = null;

  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const url = new URL(req.url);
  const idParam = url.searchParams.get('id');
  const id = parsePositiveInt(body?.id ?? idParam);

  if (!id) {
    return fail('BAD_REQUEST', 'id must be a positive integer', 400);
  }

  const existing = await prisma.channel.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return fail('NOT_FOUND', 'Channel not found', 404);
  }

  await prisma.$transaction([
    prisma.chat.deleteMany({ where: { channelId: id } }),
    prisma.channelMember.deleteMany({ where: { channelId: id } }),
    prisma.channel.delete({ where: { id } }),
  ]);

  return ok({ id });
}
