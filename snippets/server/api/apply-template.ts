import { db, schema } from "@slat/db";
import { and, eq } from "drizzle-orm";

// lib/application/templats/actions/apply-template.ts

type InitialTemplateProps = {
  name?: string | null;
  bio?: string | null;
};

export async function applyTemplate(
  userId: number,
  templateId: number,
  initialProps?: InitialTemplateProps
) {
  await db.transaction(async (tx) => {
    const [existingTemplateUse] = await tx
      .select()
      .from(schema.templateUses)
      .where(
        and(
          eq(schema.templateUses.userId, userId),
          eq(schema.templateUses.templateId, templateId)
        )
      );

    if (!existingTemplateUse) {
      await tx.insert(schema.templateUses).values({
        userId,
        templateId,
      });
    }

    const relatedTables = [
      schema.cards,
      schema.icons,
      schema.miscellanea,
      schema.biolinks,
    ];

    for (const table of relatedTables) {
      const templateTables = await tx
        .select()
        .from(table)
        .where(eq(table.templateId, templateId));

      if (templateTables.length > 0) {
        for (const templateRecord of templateTables) {
          const { id, ...recordWithoutId } = templateRecord;

          const existingRecord = await tx
            .select()
            .from(table)
            .where(and(eq(table.userId, userId)));

          if (existingRecord.length > 0) {
            await tx
              .update(table)
              .set({
                ...recordWithoutId,
                userId,
                templateId: null,
              })
              .where(eq(table.userId, userId));
          } else {
            await tx.insert(table).values({
              ...recordWithoutId,
              userId,
              templateId: null,
            });
          }
        }
      }
    }

    if (initialProps) {
      await tx
        .update(schema.biolinks)
        .set({
          ...initialProps,
        })
        .where(eq(schema.biolinks.userId, userId));
    }
  });
}
